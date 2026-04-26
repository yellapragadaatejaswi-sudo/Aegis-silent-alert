import { motion } from 'framer-motion';
import { Shield, Phone, AlertTriangle, RefreshCw, LogOut, Radio } from 'lucide-react';
import { useEmergency } from '../hooks/useEmergency';
import MapMock from './MapMock';

export default function AlertDashboard() {
  const { status, location, contacts, resetAlert } = useEmergency();

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] p-6 font-sans relative overflow-hidden flex flex-col">
      {/* Red Alert Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-[#1a0505] to-[#050505] opacity-100 pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-grow space-y-6">
        <header className="flex justify-between items-center pt-4">
          <div>
            <h1 className="text-xl font-light tracking-[0.3em] text-white uppercase">Aegis Protocol</h1>
            <p className="label-mono mt-1">Deployment Phase 01</p>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={resetAlert}
            className="p-2.5 rounded-xl glass text-hw-accent-red hover:bg-hw-accent-red/10 transition-colors"
          >
            <LogOut size={18} />
          </motion.button>
        </header>

        {/* Pulse Indicator */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-hw-accent-red rounded-full"
            />
            <div className="w-20 h-20 rounded-full bg-hw-accent-red/20 border-2 border-hw-accent-red flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(255,59,48,0.4)]">
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Radio className="text-hw-accent-red" size={32} />
              </motion.div>
            </div>
          </div>
          <h2 className="mt-4 text-hw-accent-red font-mono font-bold text-lg tracking-tight">PROTOCOL ACTIVE</h2>
          <div className="status-badge status-badge-danger mt-2">Broadcasting Live</div>
        </div>

        {/* Status Cards Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-4 rounded-2xl">
            <div className="label-mono mb-1">Signal</div>
            <div className="text-hw-accent-green font-mono text-sm font-bold">ENC-AES 256</div>
          </div>
          <div className="glass p-4 rounded-2xl">
            <div className="label-mono mb-1">Status</div>
            <div className="text-hw-accent-red font-mono text-sm font-bold animate-pulse">REC...</div>
          </div>
        </div>

        {/* Map Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="label-mono">Target Coordinates</h3>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-hw-accent-red/10 border border-hw-accent-red/20">
               <span className="w-1 h-1 rounded-full bg-hw-accent-red animate-ping" />
               <span className="text-[9px] text-hw-accent-red font-bold uppercase">Uplink Stable</span>
            </div>
          </div>
          
          <div className="h-56 bg-black rounded-3xl border border-zinc-800/50 overflow-hidden relative shadow-2xl">
            {location ? <MapMock /> : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-600 text-xs italic p-12 text-center space-y-4">
                <RefreshCw size={24} className="animate-spin text-zinc-700" />
                <p className="label-mono">Synchronizing Satellites...</p>
              </div>
            )}
          </div>
        </section>

        {/* Notified Contacts */}
        <section className="space-y-3 flex-grow">
          <h3 className="label-mono">Alert Queue</h3>
          <div className="space-y-2">
            {contacts.map(contact => (
              <div key={contact.id} className="glass rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                    <Phone size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">{contact.name}</h4>
                    <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">{contact.phone}</p>
                  </div>
                </div>
                <div className="status-badge status-badge-safe !px-2 !py-0.5 !text-[8px]">SMS SENT</div>
              </div>
            ))}
          </div>
        </section>

        <footer className="py-4 border-top border-white/5">
             <div className="flex justify-between items-center">
                <div className="label-mono !text-[8px]">8f2a-91d4-cc01-b55x</div>
                <div className="flex items-center gap-2">
                   <Shield size={12} className="text-hw-accent-green" />
                   <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">Hardware Secured</span>
                </div>
             </div>
        </footer>
      </div>
    </div>
  );
}
