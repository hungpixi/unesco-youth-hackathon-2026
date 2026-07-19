import React, { useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { Shield, EyeOff, Lock, Check, Key } from 'lucide-react';

export const EvidenceVault: React.FC = () => {
  const { isEvidenceSaved, saveEvidence } = useGameStore();
  const [pin, setPin] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isBlurred, setIsBlurred] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const sampleEvidence = {
    title: "Bằng chứng Confession bôi nhọ Vy",
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300",
    textContent: "Confession #1823: Vy ăn cắp 5 triệu quỹ lớp để mua đồ hiệu... [Tin nhắn riêng tư nhạy cảm: Bố tớ hay đánh tớ lắm...]"
  };

  const handleAutoBlur = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Giả lập vẽ ảnh gốc và che mờ tin nhắn nhạy cảm bằng Canvas API
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText("ECHOSHIELD AI FACE-BLUR DECTECTOR", 10, 25);
    ctx.font = '11px sans-serif';
    ctx.fillText("Phát hiện 1 khu vực nhạy cảm cần làm mờ:", 10, 45);
    
    // Áp dụng lớp che mờ (vùng bôi đen/làm mờ có tương phản tốt)
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(10, 65, 280, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText("[TIN NHẮN RIÊNG TƯ GIA ĐÌNH ĐÃ ĐƯỢC CHE MỜ]", 15, 88);

    setIsBlurred(true);
    setStatusMsg("AI đã tự động làm mờ và ẩn thông tin nhạy cảm thành công.");
  };

  const handleEncryptAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.length < 4) {
      setStatusMsg("Vui lòng nhập mã PIN bảo mật tối thiểu 4 chữ số.");
      return;
    }

    try {
      setStatusMsg("Đang mã hóa đầu cuối AES-GCM 256-bit...");
      
      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const keyMaterial = await window.crypto.subtle.importKey(
        "raw", new TextEncoder().encode(pin), { name: "PBKDF2" }, false, ["deriveKey"]
      );
      const key = await window.crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false, ["encrypt"]
      );
      
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv }, key, new TextEncoder().encode(JSON.stringify(sampleEvidence))
      );

      saveEvidence();
      setIsEncrypted(true);
      setStatusMsg("Mã hóa thành công! Bằng chứng đã được lưu trữ an toàn trong IndexedDB của thiết bị.");
    } catch (err) {
      console.error(err);
      setStatusMsg("Có lỗi xảy ra trong quá trình mã hóa.");
    }
  };

  return (
    <div className="bg-white border-4 border-slate-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-6 flex flex-col gap-6 transition-all">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-50 border-2 border-indigo-200 rounded-2xl">
          <Shield className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-md font-black text-slate-900 uppercase tracking-wider">Evidence Path Secure Vault</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Trình thu thập và mã hóa chứng cứ cục bộ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Image & Blur */}
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-900 flex flex-col gap-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Nguồn bằng chứng nặc danh</h3>
            <p className="text-xs text-slate-700 font-mono bg-white border border-slate-200 p-3 rounded-xl break-all">
              {sampleEvidence.textContent}
            </p>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-200 border-2 border-slate-900 flex items-center justify-center">
              {!isBlurred ? (
                <img 
                  src={sampleEvidence.src} 
                  alt="Evidence source" 
                  className="w-full h-full object-cover blur-md hover:blur-none transition-all"
                />
              ) : (
                <canvas 
                  ref={canvasRef} 
                  width={300} 
                  height={150} 
                  className="w-full h-full object-cover rounded-xl"
                />
              )}
            </div>
            {!isBlurred && (
              <button 
                onClick={handleAutoBlur}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition"
              >
                <div className="flex items-center justify-center gap-2">
                  <EyeOff className="w-4 h-4" />
                  TỰ ĐỘNG LÀM MỜ TIN NHẠY CẢM
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Encryption Form */}
        <div className="flex flex-col justify-between">
          <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-900 flex flex-col gap-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Cài đặt ổ khóa AES-GCM 256</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              Nhập mã PIN cá nhân của cậu để tạo khóa giải mã. Key được tính toán offline hoàn toàn bằng Web Crypto API trên trình duyệt. Tuyệt đối không lưu trên server.
            </p>
            
            <form onSubmit={handleEncryptAndSave} className="flex flex-col gap-3">
              <div className="relative flex items-center">
                <Key className="absolute left-3 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  placeholder="Nhập mã PIN bí mật (Ví dụ: 1234)" 
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  disabled={isEncrypted}
                  className="w-full pl-9 p-3 bg-white border-2 border-slate-900 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600 font-bold"
                />
              </div>
              {!isEncrypted ? (
                <button 
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    KÍCH HOẠT MÃ HÓA & LƯU DB CỤC BỘ
                  </div>
                </button>
              ) : (
                <div className="py-3 bg-emerald-50 border-2 border-emerald-950 text-emerald-800 text-xs font-black rounded-xl flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  <Check className="w-4 h-4" />
                  MÃ HÓA HOÀN TẤT & ĐÃ LƯU DB OFFLINE
                </div>
              )}
            </form>
          </div>

          {statusMsg && (
            <div className="p-3 bg-indigo-50 border-2 border-indigo-900 text-indigo-950 text-xs font-semibold rounded-xl mt-4">
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
