/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { EmergencyProvider, useEmergency } from './hooks/useEmergency';
import Calculator from './components/Calculator';
import AlertDashboard from './components/AlertDashboard';
import ContactsManager from './components/ContactsManager';
import { AnimatePresence, motion } from 'framer-motion';

function AppContent() {
  const { status } = useEmergency();
  const [screen, setScreen] = useState<'APP' | 'SETTINGS'>('APP');

  useEffect(() => {
    const handleOpenSettings = () => setScreen('SETTINGS');
    window.addEventListener('aegis-open-settings', handleOpenSettings);
    return () => window.removeEventListener('aegis-open-settings', handleOpenSettings);
  }, []);

  return (
    <div className="h-screen w-full bg-[#050505] overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Hardware Frame Emulator */}
      <div className="relative w-full h-full max-w-[320px] max-h-[640px] bg-[#121212] rounded-[40px] border-[8px] border-[#222] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        
        {/* Notch/Camera Area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#222] rounded-b-2xl z-50 flex items-center justify-center space-x-2">
           <div className="w-1 h-1 rounded-full bg-zinc-800" />
           <div className="w-6 h-1 rounded-full bg-zinc-800" />
        </div>

        <AnimatePresence mode="wait">
          {status !== 'SAFE' ? (
            <motion.div
              key="alert"
              initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              className="h-full w-full overflow-y-auto"
            >
              <AlertDashboard />
            </motion.div>
          ) : screen === 'SETTINGS' ? (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="h-full w-full overflow-y-auto"
            >
              <ContactsManager onBack={() => setScreen('APP')} />
            </motion.div>
          ) : (
            <motion.div
              key="calculator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="h-full w-full"
            >
              <Calculator />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-zinc-800 rounded-full z-50" />
      </div>
      
      {/* Desktop Helper */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        className="mt-8 text-center hidden md:block"
      >
        <h1 className="text-white text-lg font-light tracking-[0.4em] uppercase">Aegis Protocol</h1>
        <p className="label-mono mt-2 italic font-normal">Discreet Emergency Interface</p>
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <EmergencyProvider>
      <AppContent />
    </EmergencyProvider>
  );
}

