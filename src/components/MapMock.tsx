import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function MapMock() {
  return (
    <div className="absolute inset-0 bg-[#0a0a0a] overflow-hidden">
      {/* Heavy Tech Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(#222 1px, transparent 1px),
            linear-gradient(90deg, #222 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(#444 2px, transparent 2px),
            linear-gradient(90deg, #444 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px'
        }}
      />

      {/* Pulsing Location Dot */}
      <motion.div
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: [1, 2.5, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-500/20 rounded-full"
      />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="relative"
        >
          <div className="absolute inset-0 bg-red-500 blur-[15px] opacity-30 rounded-full" />
          <MapPin className="text-hw-accent-red relative z-10" size={36} fill="rgba(255, 59, 48, 0.2)" />
        </motion.div>
      </div>

      {/* Specialist Tech Overlays */}
      <div className="absolute top-4 left-4 flex flex-col gap-1">
         <div className="label-mono !text-[8px] !text-zinc-600">Sat-Ref: GPS-ZULU</div>
         <div className="label-mono !text-[8px] !text-hw-accent-green">Sync: Realtime</div>
      </div>

      <div className="absolute top-4 right-4 text-right">
         <div className="label-mono !text-[8px] text-zinc-600">Heading: 342°</div>
         <div className="label-mono !text-[8px] text-zinc-600">Velocity: 0.0 m/s</div>
      </div>

      <div className="absolute bottom-4 left-4 glass px-3 py-1.5 rounded-lg border-hw-accent-red/20 border">
         <div className="text-[10px] text-hw-accent-red font-mono font-bold tracking-tight">
           34° N, 118° W
         </div>
      </div>
      
      <div className="absolute bottom-4 right-4">
         <div className="w-12 h-12 border-r border-b border-red-500/30 rounded-br-lg" />
      </div>
      <div className="absolute top-4 left-4">
         <div className="w-4 h-4 border-l border-t border-red-500/30 rounded-tl-sm" />
      </div>
    </div>
  );
}
