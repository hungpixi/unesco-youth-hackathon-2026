'use client';

import React, { useState } from 'react';
import { DialogManager } from '../components/DialogManager';
import { CareCoach } from '../components/CareCoach';
import { EvidenceVault } from '../components/EvidenceVault';
import { useGameStore } from '../store/gameStore';
import dialogTree from '../data/dialogs.json';
import { Shield, RefreshCw, BookOpen, AlertCircle, Sparkles, Trophy, HelpCircle } from 'lucide-react';

export default function Home() {
  const { resetGame, trust, stress, viral, currentNode, setChapter } = useGameStore();

  // Danh sách sidequests giả lập để nâng cấp độ tương tác (Genshin Impact style)
  const [sidequests, setSidequests] = useState([
    { id: 'camera', title: 'Mượn thẻ nhớ bác bảo vệ', status: 'Đang làm', reward: 'Unlock Scene 006' },
    { id: 'music', title: 'Lân la CLB Âm nhạc gặp Lan', status: 'Chưa mở khóa', reward: 'Unlock Scene 015' },
    { id: 'ip_room', title: 'Đột nhập phòng tin học tra IP', status: 'Chưa mở khóa', reward: 'Unlock Scene 028' }
  ]);

  const handleCompleteSidequest = (id: string) => {
    setSidequests(prev => prev.map(sq => {
      if (sq.id === id) {
        return { ...sq, status: 'Hoàn thành' };
      }
      // Mở khóa các sidequest tiếp theo
      if (id === 'camera' && sq.id === 'music') {
        return { ...sq, status: 'Đang làm' };
      }
      if (id === 'music' && sq.id === 'ip_room') {
        return { ...sq, status: 'Đang làm' };
      }
      return sq;
    }));
  };

  const handleInteract = (target: string | null) => {
    if (!target) return;
    
    // Nếu đứng gần Vy và đang ở node bắt đầu, chuyển sang cảnh nói chuyện với Vy
    if (target === 'Vy' && currentNode === 'start') {
      setChapter('prologue', 'scene1_1');
    }
    
    // Khi đến tủ đồ cuối hành lang
    if (target === 'Locker') {
      const cameraQuest = sidequests.find(sq => sq.id === 'camera');
      if (cameraQuest && cameraQuest.status === 'Đang làm') {
        handleCompleteSidequest('camera');
      }
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Brand Header - Premium Light Theme */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-slate-900 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 border-2 border-indigo-900 rounded-2xl">
            <Shield className="w-6 h-6 text-indigo-600 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-outfit font-black tracking-wider text-slate-900">ECHOSHIELD INTERACTIVE DEMO</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">UNESCO Youth Hackathon 2026</p>
          </div>
        </div>

        <button 
          onClick={resetGame}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-900 text-xs font-black rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Tiến Trình</span>
        </button>
      </header>

      {/* Main Grid Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Game play window + Evidence (Left 2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-slate-900 px-1">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Visual Novel Player</h2>
          </div>
          
          <DialogManager dialogTree={dialogTree as any} onInteract={handleInteract} />
          
          <EvidenceVault />
        </div>

        {/* Sidebar panels (Right 1 col) */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-slate-900 px-1">
            <AlertCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">CARE Coach & Sidequests</h2>
          </div>
          
          <CareCoach />

          {/* Interactive Sidequests Board */}
          <div className="bg-white border-4 border-slate-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2">
              <Trophy className="w-5 h-5 text-amber-500 animate-pulse" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Sidequest Board</h3>
            </div>
            
            <div className="flex flex-col gap-3">
              {sidequests.map(sq => (
                <div key={sq.id} className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl flex items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{sq.title}</h4>
                    <span className="text-[10px] text-indigo-600 font-bold">{sq.reward}</span>
                  </div>
                  
                  {sq.status === 'Đang làm' ? (
                    <button 
                      onClick={() => handleCompleteSidequest(sq.id)}
                      className="px-2.5 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg border border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none transition"
                    >
                      Xong
                    </button>
                  ) : sq.status === 'Hoàn thành' ? (
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-300">
                      Đã Xong
                    </span>
                  ) : (
                    <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                      Khóa
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick HUD stats summary */}
          <div className="bg-white border-4 border-slate-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-5 flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Bảng Tóm Tắt Tác Động</h3>
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Vy's Trust</span>
                  <span>{trust}/100</span>
                </div>
                <div className="w-full bg-slate-100 h-3 border-2 border-slate-900 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${trust}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Stress Level</span>
                  <span>{stress}/100</span>
                </div>
                <div className="w-full bg-slate-100 h-3 border-2 border-slate-900 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${stress}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Viral Index</span>
                  <span>{viral}/100</span>
                </div>
                <div className="w-full bg-slate-100 h-3 border-2 border-slate-900 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${viral}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Premium Light Footer */}
      <footer className="w-full border-t-4 border-slate-900 py-6 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-white">
        EchoShield Vietnam © 2026 - Phục vụ UNESCO Youth Hackathon 2026.
      </footer>
    </main>
  );
}
