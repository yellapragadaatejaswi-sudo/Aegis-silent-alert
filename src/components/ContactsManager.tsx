import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Trash2, ArrowLeft, ShieldCheck, Phone, User, FileText } from 'lucide-react';
import { useEmergency } from '../hooks/useEmergency';

export default function ContactsManager({ onBack, onOpenReport }: { onBack: () => void, onOpenReport?: () => void }) {
  const { contacts, addContact, removeContact } = useEmergency();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      addContact(name, phone);
      setName('');
      setPhone('');
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] p-6 font-sans flex flex-col">
      <header className="flex items-center gap-4 pt-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 rounded-xl glass text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-light tracking-tight text-white">Trusted Contacts</h1>
          <p className="label-mono opacity-50">Authorized Personnel Only</p>
        </div>
      </header>

      <main className="flex-grow space-y-6">
        {/* Add New Contact Button */}
        {!isAdding ? (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAdding(true)}
            className="w-full py-4 rounded-2xl border border-dashed border-zinc-800 hover:border-hw-accent-orange/50 hover:bg-hw-accent-orange/5 transition-all flex items-center justify-center gap-3 text-zinc-500 hover:text-hw-accent-orange"
          >
            <UserPlus size={18} />
            <span className="text-sm font-medium">Provision New Contact</span>
          </motion.button>
        ) : (
          <motion.form 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="glass p-6 rounded-3xl space-y-4 border-hw-accent-orange/20"
          >
            <div className="space-y-2">
              <label className="label-mono">Full Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Guardian"
                  className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-hw-accent-orange transition-colors"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="label-mono">Security Line (Phone)</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-hw-accent-orange transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 py-3 text-sm font-bold text-zinc-500 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 py-3 bg-hw-accent-orange text-black rounded-xl text-sm font-bold shadow-lg shadow-hw-accent-orange/20"
              >
                Authorize
              </button>
            </div>
          </motion.form>
        )}

        {/* Contact List */}
        <section className="space-y-4">
          <h3 className="label-mono">Active Protocols ({contacts.length})</h3>
          <div className="space-y-3">
            <AnimatePresence>
              {contacts.map((contact) => (
                <motion.div 
                  key={contact.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="glass p-4 rounded-2xl flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-hw-accent-orange">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{contact.name}</h4>
                      <p className="font-mono text-[10px] text-zinc-500 tracking-widest">{contact.phone}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeContact(contact.id)}
                    className="p-2 text-zinc-700 hover:text-hw-accent-red transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <footer className="py-6 space-y-4 border-t border-zinc-900 mt-auto">
        <button
          onClick={onOpenReport}
          className="w-full py-3 px-4 rounded-xl glass border-hw-accent-orange/10 flex items-center justify-center gap-2 text-hw-accent-orange hover:bg-hw-accent-orange/5 transition-colors"
        >
          <FileText size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Project Documentation</span>
        </button>
        <p className="text-[10px] text-zinc-700 font-mono tracking-widest text-center">END TO END ENCRYPTED SYNC</p>
      </footer>
    </div>
  );
}
