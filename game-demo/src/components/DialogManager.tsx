'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Flame, AlertCircle, RefreshCw, MessageCircle, Lock, Key, Award, AlertTriangle, UserCheck } from 'lucide-react';

interface Choice {
  id: string;
  text: string;
  nextNode: string;
  stateEffects?: { trust?: number; stress?: number; viral?: number };
}

interface DialogNode {
  id: string;
  speaker: string;
  text: string;
  background: string;
  sprite: string;
  choices?: Choice[];
  nextNode?: string;
}

interface DialogManagerProps {
  dialogTree: Record<string, DialogNode>;
  onInteract?: (target: string | null) => void;
}

import Classroom3D from './Classroom3D';

export const DialogManager: React.FC<DialogManagerProps> = ({ dialogTree, onInteract }) => {
  const { currentNode, makeChoice, updateStat, trust, stress, viral, isEvidenceSaved } = useGameStore();
  const node = dialogTree[currentNode];
  
  // Hiệu ứng Typewriter
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    if (!node) return;
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + node.text.charAt(i));
      i++;
      if (i >= node.text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [node]);

  if (!node) return <div className="text-slate-900 p-6 font-semibold">Đang tải kịch bản game...</div>;

  const handleChoice = (choice: Choice) => {
    if (choice.stateEffects) {
      if (choice.stateEffects.trust) updateStat('trust', choice.stateEffects.trust);
      if (choice.stateEffects.stress) updateStat('stress', choice.stateEffects.stress);
      if (choice.stateEffects.viral) updateStat('viral', choice.stateEffects.viral);
    }
    makeChoice(choice.id, choice.nextNode);
  };

  // Xác định avatar của Shieldy
  const isShieldy = node.speaker.includes("Shieldy");

  return (
    <div className="bg-white border-4 border-slate-900 rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col h-[650px] transition-all">
      
      {/* Top Banner - Phone Mockup UI */}
      <div className="bg-slate-900 text-slate-100 px-6 py-3 flex items-center justify-between font-outfit border-b-4 border-slate-900">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-xs font-bold tracking-wider uppercase">ECHOSHIELD INTERACTIVE SIMULATOR</span>
        <span className="text-xs font-black text-indigo-400">CHƯƠNG: PROLOGUE</span>
      </div>

      {/* Game Viewport Container */}
      <div className="relative flex-1 bg-slate-100 overflow-hidden flex flex-col justify-between">
        
        {/* Background Layer - 3D Interactive Classroom */}
        <div className="absolute inset-0 z-0">
          <Classroom3D onInteract={onInteract || (() => {})} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* HUD Overlay (Light Theme, high visibility) */}
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-black text-slate-900">Vy's Trust: {trust}%</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <Flame className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-black text-slate-900">Stress: {stress}%</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-black text-slate-900">Viral Index: {viral}%</span>
          </div>
        </div>

        {/* Character Sprite Display */}
        <div className="relative z-10 w-full h-[50%] flex justify-center items-end">
          <AnimatePresence mode="wait">
            {node.sprite && (
              <motion.div 
                key={node.sprite}
                initial={{ y: 50, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-[90%] relative"
              >
                {isShieldy ? (
                  // Shieldy mascot bubble style
                  <div className="flex flex-col items-center bg-indigo-50 border-4 border-slate-900 p-4 rounded-3xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] max-w-[280px] animate-bounce">
                    <span className="text-[10px] font-black uppercase text-indigo-700 tracking-widest">Shieldy Mascot</span>
                    <div className="w-20 h-20 bg-indigo-200 border-4 border-slate-900 rounded-full overflow-hidden flex items-center justify-center mt-2">
                      <Shield className="w-12 h-12 text-indigo-600 animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <img 
                    src={node.sprite} 
                    alt={node.speaker}
                    className="h-full object-contain border-4 border-slate-900 rounded-2xl bg-white/10"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dialog / Chat Box Area (Light Theme, high contrast) */}
        <div className="relative z-10 p-5 bg-white border-t-4 border-slate-900 flex flex-col gap-4">
          <div>
            <span className="inline-block px-3 py-1 bg-indigo-100 border-2 border-slate-900 text-indigo-800 text-xs font-black rounded-lg uppercase tracking-wider mb-2">
              {node.speaker}
            </span>
            <p className="text-slate-900 font-medium text-sm md:text-base leading-relaxed min-h-[50px]">
              {displayedText}
            </p>
          </div>

          {/* Interactive choices */}
          <div className="flex flex-col gap-2">
            {node.choices ? (
              node.choices.map((choice) => (
                <button 
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  className="w-full text-left p-3.5 bg-slate-50 hover:bg-indigo-50 border-2 border-slate-900 text-slate-800 hover:text-indigo-900 text-xs md:text-sm font-bold rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-150"
                >
                  {choice.text}
                </button>
              ))
            ) : node.nextNode ? (
              <button 
                onClick={() => makeChoice('continue', node.nextNode!)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs md:text-sm font-bold rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-150 text-center"
              >
                Tiếp tục hội thoại
              </button>
            ) : null}
          </div>
        </div>

      </div>
    </div>
  );
};
