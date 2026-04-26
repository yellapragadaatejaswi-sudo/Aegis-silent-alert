import { useState } from 'react';
import { motion } from 'framer-motion';
import { Divide, Minus, Plus, X, ShieldAlert } from 'lucide-react';
import { useEmergency } from '../hooks/useEmergency';

export default function Calculator() {
  const { triggerAlert, status } = useEmergency();
  const [display, setDisplay] = useState('0');
  const [lastPress, setLastPress] = useState(0);

  const handlePress = (val: string) => {
    if (val === 'AC') {
      setDisplay('0');
      
      const now = Date.now();
      if (now - lastPress < 300) {
        triggerAlert();
      }
      setLastPress(now);
      return;
    }

    if (val === '=') {
      if (display === '8008') {
        // Broadcast a custom event or use a callback to open settings
        window.dispatchEvent(new CustomEvent('aegis-open-settings'));
        setDisplay('0');
        return;
      }
      // Normal calculation logic would go here
      setDisplay('0');
      return;
    }

    if (display === '0') {
      setDisplay(val);
    } else {
      setDisplay(prev => prev + val);
    }
  };

  const buttons = [
    ['AC', '+/-', '%', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=', 'S'],
  ];

  return (
    <div className="flex flex-col h-full bg-[#050505] text-white p-4 font-sans relative">
      {/* Top Indicators - absolute or fixed at top to stay out of flex flow if needed, but let's keep it in flow for now */}
      <div className="pt-6 px-2 mb-2">
        <div className="flex justify-between items-center">
          <span className="font-mono text-[10px] text-zinc-500 font-bold">9:41</span>
          <div className="flex items-center gap-2">
            {status !== 'SAFE' ? (
              <span className="text-hw-accent-red font-mono text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-hw-accent-red animate-pulse" />
                ALERT MODE
              </span>
            ) : (
              <span className="text-zinc-600 font-mono text-[10px] font-bold">100%</span>
            )}
          </div>
        </div>
      </div>

      {/* Display Area - Takes up remaining space */}
      <div className="flex-grow flex flex-col justify-center text-right px-4">
        <div className="text-hw-accent-orange/40 text-xs font-mono mb-1 uppercase tracking-widest">
          {display.length > 8 ? 'Buffer_Overflow' : 'System_Ready'}
        </div>
        <div className="text-5xl font-mono tracking-tighter truncate text-[#E0E0E0] py-4">
          {display}
        </div>
      </div>

      {/* Buttons Grid - Positioned towards middle/bottom but clearly visible */}
      <div className="pb-8">
        <div className="grid grid-cols-4 gap-2 bg-black/40 p-2 rounded-[32px] backdrop-blur-sm">
          {buttons.flat().map((btn) => (
            <motion.button
              key={btn}
              whileTap={{ scale: 0.90 }}
              onClick={() => handlePress(btn)}
              className={`
                h-[62px] w-full rounded-full text-lg font-medium flex items-center justify-center
                ${['/', '*', '-', '+', '='].includes(btn) 
                  ? 'bg-[#ff9f0a] text-white' 
                  : ['AC', '+/-', '%'].includes(btn)
                  ? 'bg-[#a5a5a5] text-black'
                  : 'bg-[#1a1a1a] text-white'}
                ${btn === '0' ? 'col-span-2 px-6 justify-start rounded-[31px]' : ''}
                ${btn === 'S' ? 'invisible' : ''}
                transition-colors shadow-sm
              `}
            >
              {btn === '*' ? <X size={18} /> : 
               btn === '/' ? <Divide size={18} /> :
               btn === '-' ? <Minus size={18} /> :
               btn === '+' ? <Plus size={18} /> :
               btn}
            </motion.button>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-[8px] uppercase tracking-[0.4em] text-zinc-800 font-bold">
            {status === 'SAFE' ? 'Secure Layer: Active' : 'Protocol: Deprioritized'}
          </p>
        </div>
      </div>
    </div>
  );
}
