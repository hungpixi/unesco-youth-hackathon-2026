import React, { useState } from 'react';
import { Heart, Send, PhoneCall, AlertTriangle, User } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  isEmergency?: boolean;
}

export const CareCoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'coach',
      text: "Xin chào, tớ là CARE Coach - Trợ lý sơ cứu tinh thần của cậu. Nếu cậu đang phải trải qua cảm giác nghẹt thở vì tin đồn hoặc bị bạo lực mạng, tớ ở đây để lắng nghe và hỗ trợ cậu."
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [showEmergency, setShowEmergency] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Quét từ khóa tự hại
    const emergencyRegex = /(chết|tự tử|tự sát|bế tắc|kết thúc cuộc sống|muốn đi xa|cắt tay)/gi;
    const isEmergencyDetected = emergencyRegex.test(inputText);

    setTimeout(() => {
      if (isEmergencyDetected) {
        setShowEmergency(true);
        const emergencyReply: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'coach',
          text: "Tớ nghe thấy nỗi đau quá lớn và sự bế tắc của cậu lúc này. Tớ vô cùng trân trọng vì cậu đã dám nói ra. Nhưng lúc này, tính mạng và sự an toàn của cậu là quan trọng nhất. Xin hãy kết nối ngay với các chuyên gia con người qua Hotline bên dưới. Tớ luôn đồng hành cùng cậu.",
          isEmergency: true
        };
        setMessages(prev => [...prev, emergencyReply]);
      } else {
        const normalReplies = [
          "Tớ hiểu cậu đang rất lo lắng. Bão Confession là một trải nghiệm rất tàn bạo. Cậu hãy thử áp dụng nguyên tắc: Không phản hồi, Không đọc tin nhắn thêm nữa.",
          "Cậu không đơn độc. Mọi chuyện đều có cách giải quyết. Hãy tập trung lưu lại bằng chứng mã hóa và tớ khuyên cậu nên tâm sự với thầy cô/phòng tham vấn học đường.",
          "Đừng tự đổ lỗi cho mình nhé. Hành vi bôi nhọ của kẻ xấu là vi phạm đạo đức và pháp luật. Cậu là nạn nhân, cậu xứng đáng được bảo vệ."
        ];
        const randomReply = normalReplies[Math.floor(Math.random() * normalReplies.length)];
        
        const coachReply: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'coach',
          text: randomReply
        };
        setMessages(prev => [...prev, coachReply]);
      }
    }, 800);
  };

  return (
    <div className="bg-white border-4 border-slate-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-5 flex flex-col h-[500px] transition-all">
      {/* Header */}
      <div className="flex items-center gap-3 border-b-4 border-slate-900 pb-3">
        <div className="p-2.5 bg-indigo-50 border-2 border-indigo-200 rounded-2xl">
          <Heart className="w-5 h-5 text-indigo-600 animate-pulse" />
        </div>
        <div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">CARE Coach Hub</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sơ cứu tâm lý PFA (WHO)</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto my-4 flex flex-col gap-4 pr-1 scrollbar-thin">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex flex-col max-w-[85%] rounded-2xl p-3.5 border-2 border-slate-900 text-xs md:text-sm shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] ${
              msg.sender === 'user' 
                ? 'self-end bg-indigo-600 border-indigo-900 text-white rounded-tr-none' 
                : msg.isEmergency 
                  ? 'self-start bg-rose-50 border-rose-900 text-rose-950 rounded-tl-none'
                  : 'self-start bg-slate-50 border-slate-900 text-slate-950 rounded-tl-none'
            }`}
          >
            {msg.sender === 'coach' && (
              <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">CARE Coach</span>
            )}
            <p className="leading-relaxed font-semibold">{msg.text}</p>
          </div>
        ))}

        {showEmergency && (
          <div className="p-4 bg-rose-50 border-4 border-rose-900 rounded-2xl flex flex-col gap-3 mt-2 animate-bounce">
            <div className="flex items-center gap-2 text-rose-700 font-black text-xs md:text-sm">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              <span>ĐỊNH TUYẾN PHÒNG CHỐNG TỰ HẠI</span>
            </div>
            <p className="text-xs text-rose-950 font-medium">
              Vui lòng ngắt chat và liên hệ ngay các đường dây cứu hộ khẩn cấp hoàn toàn miễn phí dưới đây:
            </p>
            <div className="flex flex-col gap-2">
              <a 
                href="tel:111" 
                className="flex items-center justify-center gap-2 p-3 bg-rose-600 hover:bg-rose-500 border-2 border-slate-900 text-white font-black text-xs rounded-xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition"
              >
                <PhoneCall className="w-4 h-4" />
                GỌI TỔNG ĐÀI QUỐC GIA 111
              </a>
              <a 
                href="tel:0963061414" 
                className="flex items-center justify-center gap-2 p-3 bg-white hover:bg-slate-50 border-2 border-slate-900 text-rose-600 font-black text-xs rounded-xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition"
              >
                <PhoneCall className="w-4 h-4" />
                GỌI HOTLINE NGÀY MAI
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Input controls */}
      <form onSubmit={handleSendMessage} className="flex gap-2 border-t-4 border-slate-900 pt-3">
        <input 
          type="text" 
          placeholder="Nhập tâm sự của cậu vào đây..." 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 p-3 bg-slate-50 border-2 border-slate-900 rounded-2xl text-slate-900 placeholder-slate-400 text-xs md:text-sm focus:outline-none focus:border-indigo-600"
        />
        <button 
          type="submit"
          className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white border-2 border-slate-900 rounded-2xl flex items-center justify-center transition active:scale-[0.95] shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:shadow-none"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
