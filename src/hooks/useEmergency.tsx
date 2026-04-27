import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type AlertStatus = 'SAFE' | 'ALERT_SENT' | 'TRACKING';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

interface EmergencyContextType {
  status: AlertStatus;
  triggerAlert: () => void;
  resetAlert: () => void;
  location: { lat: number; lng: number } | null;
  contacts: Contact[];
  addContact: (name: string, phone: string) => void;
  removeContact: (id: string) => void;
}

const EmergencyContext = createContext<EmergencyContextType | null>(null);

function useShakeDetection(onShake: () => void, threshold = 15) {
  useEffect(() => {
    let lastX: number | null = null;
    let lastY: number | null = null;
    let lastZ: number | null = null;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      const { x, y, z } = acc;
      if (x === null || y === null || z === null) return;

      if (lastX !== null && lastY !== null && lastZ !== null) {
        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);

        if ((deltaX > threshold && deltaY > threshold) || 
            (deltaX > threshold && deltaZ > threshold) || 
            (deltaY > threshold && deltaZ > threshold)) {
          onShake();
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [onShake, threshold]);
}

export function EmergencyProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AlertStatus>('SAFE');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // Load contacts from localStorage
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('aegis_contacts');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Emergency Services', phone: '911' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('aegis_contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (name: string, phone: string) => {
    const newContact = { id: Date.now().toString(), name, phone };
    setContacts(prev => [...prev, newContact]);
  };

  const removeContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const triggerAlert = useCallback(async () => {
    setStatus('ALERT_SENT');
    
    let currentPos: { lat: number, lng: number } | null = null;

    if ("geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { 
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });
        
        currentPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setLocation(currentPos);
        setStatus('TRACKING');
      } catch (err) {
        console.error("GPS Acquisition failed, sending fallback alert:", err);
      }
    }

    // Send SMS with Resolved Location
    contacts.forEach(async (contact) => {
      try {
        const mapsLink = currentPos 
          ? `https://www.google.com/maps?q=${currentPos.lat},${currentPos.lng}`
          : "Location Unavailable (GPS Lock Pending)";

        const response = await fetch('/api/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: contact.phone,
            message: `AEGIS EMERGENCY: ${mapsLink}`
          })
        });
        const result = await response.json();
        if (result.simulated) {
          console.warn(`SMS for ${contact.name} was SIMULATED. Add Twilio keys to Secrets.`);
        }
      } catch (err) {
        console.error("SMS Request Failed:", err);
      }
    });

  }, [contacts]);

  const resetAlert = () => {
    setStatus('SAFE');
    setLocation(null);
  };

  useShakeDetection(() => {
    if (status === 'SAFE') {
      console.log('Shake detected! Triggering silent alert...');
      triggerAlert();
    }
  });

  return (
    <EmergencyContext.Provider value={{ status, triggerAlert, resetAlert, location, contacts, addContact, removeContact }}>
      {children}
    </EmergencyContext.Provider>
  );
}

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) throw new Error('useEmergency must be used within EmergencyProvider');
  return context;
};
