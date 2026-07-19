# Tài liệu Kiến trúc Kỹ thuật Game Visual Novel - EchoShield

Tài liệu này cung cấp kiến trúc mã nguồn React/Next.js hoàn chỉnh cho game Visual Novel phân nhánh dài trên 2 tiếng, lấy cảm hứng từ cấu trúc của Claude Code Game Studios.

## 1. Zustand Store (`gameStore.ts`)
Quản lý trạng thái 3 chỉ số động (Trust, Stress, Viral), lịch sử lựa chọn, chương hiện tại, và đồng bộ tự động với IndexedDB (Dexie.js).

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { db } from './db'; // Dexie instance

interface GameState {
  trust: number;
  stress: number;
  viral: number;
  currentChapter: string;
  currentNode: string;
  choiceHistory: string[];
  
  updateStat: (stat: 'trust' | 'stress' | 'viral', amount: number) => void;
  makeChoice: (choiceId: string, nextNode: string) => void;
  setChapter: (chapterId: string, startNode: string) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      trust: 50,
      stress: 0,
      viral: 0,
      currentChapter: 'prologue',
      currentNode: 'start',
      choiceHistory: [],

      updateStat: (stat, amount) => 
        set((state) => ({ [stat]: Math.max(0, Math.min(100, state[stat] + amount)) })),
      
      makeChoice: (choiceId, nextNode) =>
        set((state) => ({
          choiceHistory: [...state.choiceHistory, choiceId],
          currentNode: nextNode
        })),

      setChapter: (chapterId, startNode) =>
        set({ currentChapter: chapterId, currentNode: startNode }),

      resetGame: () => set({
        trust: 50, stress: 0, viral: 0,
        currentChapter: 'prologue', currentNode: 'start', choiceHistory: []
      })
    }),
    {
      name: 'echoshield-storage',
      // Custom storage engine using Dexie.js
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => {
          const record = await db.store.get(name);
          return record?.value ?? null;
        },
        setItem: async (name: string, value: string) => {
          await db.store.put({ key: name, value });
        },
        removeItem: async (name: string) => {
          await db.store.delete(name);
        },
      })),
    }
  )
);
```

## 2. Dialog Manager (`DialogManager.tsx`)
Nhận file kịch bản JSON (Dialog Trees) và render giao diện hội thoại, sprite nhân vật, bối cảnh, âm thanh, và các nút bấm lựa chọn.

```tsx
import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';

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
  bgm?: string;
  sfx?: string;
  choices?: Choice[];
  nextNode?: string; // Nếu không có choices, nút tiếp tục
}

interface DialogManagerProps {
  dialogTree: Record<string, DialogNode>;
}

export const DialogManager: React.FC<DialogManagerProps> = ({ dialogTree }) => {
  const { currentNode, makeChoice, updateStat } = useGameStore();
  const node = dialogTree[currentNode];
  
  const [playBgm, { stop: stopBgm }] = useSound(node?.bgm || '', { loop: true });
  const [playSfx] = useSound(node?.sfx || '');

  useEffect(() => {
    if (node?.bgm) playBgm();
    if (node?.sfx) playSfx();
    return () => { stopBgm(); };
  }, [node?.bgm, node?.sfx, playBgm, playSfx, stopBgm]);

  if (!node) return <div>Đang tải dữ liệu...</div>;

  const handleChoice = (choice: Choice) => {
    if (choice.stateEffects) {
      if (choice.stateEffects.trust) updateStat('trust', choice.stateEffects.trust);
      if (choice.stateEffects.stress) updateStat('stress', choice.stateEffects.stress);
      if (choice.stateEffects.viral) updateStat('viral', choice.stateEffects.viral);
    }
    makeChoice(choice.id, choice.nextNode);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex flex-col justify-end">
      {/* Background */}
      <motion.img 
        key={node.background}
        src={node.background} 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* Character Sprite */}
      <AnimatePresence>
        {node.sprite && (
          <motion.img 
            key={node.sprite}
            src={node.sprite}
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[80%] z-10"
          />
        )}
      </AnimatePresence>

      {/* Dialog Box */}
      <div className="relative z-20 w-full max-w-4xl mx-auto p-6 bg-black/80 text-white rounded-t-2xl border-t-4 border-indigo-500 shadow-2xl backdrop-blur-sm">
        <h3 className="text-xl font-bold text-indigo-300 mb-2">{node.speaker}</h3>
        <p className="text-lg leading-relaxed mb-6">{node.text}</p>
        
        {/* Choices */}
        <div className="flex flex-col gap-3">
          {node.choices ? (
            node.choices.map(choice => (
              <button 
                key={choice.id}
                onClick={() => handleChoice(choice)}
                className="p-3 bg-indigo-900/50 hover:bg-indigo-600 transition-colors rounded-lg border border-indigo-500/30 text-left"
              >
                {choice.text}
              </button>
            ))
          ) : node.nextNode ? (
            <button 
              onClick={() => makeChoice('continue', node.nextNode!)}
              className="p-3 bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg text-center"
            >
              Tiếp tục
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
```

## 3. Crypto & Evidence Path Vault (`cryptoHelper.ts`)
Mã hóa AES-GCM 256 cục bộ bằng mã PIN (hoặc vân tay), kết nối Dexie.js để lưu cục bộ bền vững an toàn (Zero-knowledge architecture).

```typescript
import Dexie, { Table } from 'dexie';

// 1. Dexie DB Setup for Secure Vault
export class SecureVaultDB extends Dexie {
  evidence!: Table<{ id: string; encryptedData: string; iv: string }, string>;
  
  constructor() {
    super('EchoShieldVault');
    this.version(1).stores({
      evidence: 'id'
    });
  }
}
export const vaultDb = new SecureVaultDB();

// 2. Web Crypto API Helpers (AES-GCM 256)
export class CryptoVault {
  // Derive key from PIN/Password using PBKDF2
  static async deriveKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw", enc.encode(pin), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]
    );
    return window.crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false, ["encrypt", "decrypt"]
    );
  }

  static async encryptData(data: any, key: CryptoKey): Promise<{ encrypted: string, iv: string }> {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv }, key, enc.encode(JSON.stringify(data))
    );
    return {
      encrypted: btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer))),
      iv: btoa(String.fromCharCode(...iv))
    };
  }

  static async decryptData(encryptedBase64: string, ivBase64: string, key: CryptoKey): Promise<any> {
    const encrypted = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
    
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv }, key, encrypted
    );
    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decryptedBuffer));
  }

  // Save evidence to Dexie
  static async saveEvidence(id: string, data: any, pin: string) {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    localStorage.setItem(`salt_${id}`, btoa(String.fromCharCode(...salt)));
    
    const key = await this.deriveKey(pin, salt);
    const { encrypted, iv } = await this.encryptData(data, key);
    
    await vaultDb.evidence.put({ id, encryptedData: encrypted, iv });
  }

  // Load evidence from Dexie
  static async loadEvidence(id: string, pin: string) {
    const record = await vaultDb.evidence.get(id);
    if (!record) return null;
    
    const saltBase64 = localStorage.getItem(`salt_${id}`);
    if (!saltBase64) throw new Error("Salt not found");
    const salt = Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0));
    
    const key = await this.deriveKey(pin, salt);
    return await this.decryptData(record.encryptedData, record.iv, key);
  }
}
```

## 4. Auto Blur Filter (`faceBlur.ts`)
Sử dụng TensorFlow.js BlazeFace để nhận diện và làm mờ khuôn mặt tự động trên client (bảo vệ danh tính nhân vật/chứng cứ trong game).

```typescript
import * as blazeface from '@tensorflow-models/blazeface';
import '@tensorflow/tfjs-backend-webgl';

let model: blazeface.BlazeFaceModel | null = null;

export const loadModel = async () => {
  if (!model) {
    model = await blazeface.load();
  }
  return model;
};

/**
 * Áp dụng bộ lọc mờ lên khuôn mặt được nhận diện trong ảnh/video
 * @param sourceElement Element gốc (HTMLImageElement | HTMLVideoElement)
 * @param canvas Canvas đích để vẽ kết quả đã làm mờ
 */
export const applyAutoFaceBlur = async (
  sourceElement: HTMLImageElement | HTMLVideoElement,
  canvas: HTMLCanvasElement
) => {
  const loadedModel = await loadModel();
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Đồng bộ kích thước canvas với source
  canvas.width = sourceElement instanceof HTMLVideoElement ? sourceElement.videoWidth : sourceElement.width;
  canvas.height = sourceElement instanceof HTMLVideoElement ? sourceElement.videoHeight : sourceElement.height;

  // Vẽ ảnh gốc lên canvas
  ctx.drawImage(sourceElement, 0, 0, canvas.width, canvas.height);

  // Nhận diện khuôn mặt
  const returnTensors = false;
  const predictions = await loadedModel.estimateFaces(sourceElement, returnTensors);

  if (predictions.length > 0) {
    // Làm mờ từng khuôn mặt
    predictions.forEach(prediction => {
      const topLeft = prediction.topLeft as [number, number];
      const bottomRight = prediction.bottomRight as [number, number];
      
      const x = topLeft[0];
      const y = topLeft[1];
      const width = bottomRight[0] - x;
      const height = bottomRight[1] - y;
      
      const padding = width * 0.2; // Mở rộng vùng làm mờ
      const blurX = Math.max(0, x - padding);
      const blurY = Math.max(0, y - padding);
      const blurW = width + padding * 2;
      const blurH = height + padding * 2;

      ctx.save();
      ctx.filter = 'blur(15px)'; // Hiệu ứng làm mờ
      // Ghi đè vùng khuôn mặt bằng hiệu ứng làm mờ
      ctx.drawImage(
        canvas, 
        blurX, blurY, blurW, blurH, 
        blurX, blurY, blurW, blurH  
      );
      ctx.restore();
    });
  }
};
```
