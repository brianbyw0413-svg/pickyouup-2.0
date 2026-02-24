import React, { useState, useEffect } from 'react';

// --- 用內建 HTML 代替外部圖示，確保 100% 成功執行 ---
const IconTruck = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconZap = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;

export default function App() {
  const [isQuickMode, setIsQuickMode] = useState(false);
  const [quickStep, setQuickStep] = useState('warning'); // warning, form
  const [price, setPrice] = useState(1300);

  // --- 自動偵測網址，若是掃碼進入則切換到「另一個網頁」介面 ---
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'quick') {
      setIsQuickMode(true);
    }
  }, []);

  const handleTimeChange = (e) => {
    const hour = parseInt(e.target.value.split(':')[0]);
    setPrice((hour >= 23 || hour < 6) ? 1400 : 1300);
  };

  // --- 頁面 A：正式純淨首頁 ---
  if (!isQuickMode) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white font-sans p-6 flex flex-col items-center">
        <nav className="w-full max-w-md flex justify-between items-center py-6 border-b border-white/5 mb-20">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500 p-1.5 rounded-lg text-black"><IconTruck /></div>
            <h1 className="text-xl font-black italic tracking-tighter">PickYouUP 2.0</h1>
          </div>
        </nav>
        <div className="w-full max-w-md space-y-4 text-center animate-in fade-in duration-700">
          <h2 className="text-4xl font-black italic mb-12 tracking-tighter leading-tight">
             從從容容，<br/><span className="text-yellow-500 text-5xl font-black">遊刃有餘。</span>
          </h2>
          <button className="w-full bg-zinc-900 border border-zinc-800 py-8 rounded-[40px] font-black text-xl shadow-xl transition-all active:scale-95">我要接機</button>
          <button className="w-full bg-zinc-900 border border-zinc-800 py-8 rounded-[40px] font-black text-xl shadow-xl">我要送機</button>
          <button className="w-full bg-zinc-900 border border-zinc-800 py-8 rounded-[40px] font-black text-xl shadow-xl">接送一併預訂</button>
          <p className="text-zinc-600 text-[10px] mt-16 font-black uppercase tracking-[0.4em]">© 2026 PickYouUP Driver Alliance</p>
        </div>
      </div>
    );
  }

  // --- 頁面 B：另一個網頁 (快速接機特攻網頁) ---
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans p-6 flex flex-col items-center">
      <nav className="w-full max-w-md flex justify-center py-6 mb-12">
        <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20">
          <div className="text-yellow-500 animate-pulse"><IconZap /></div>
          <span className="text-yellow-500 text-[10px] font-black tracking-widest uppercase">Quick Pickup Mode</span>
        </div>
      </nav>

      <div className="w-full max-w-md">
        {quickStep === 'warning' ? (
          <div className="bg-zinc-900 border border-yellow-500/30 p-10 rounded-[50px] shadow-2xl text-center animate-in zoom-in-95">
            <h3 className="text-3xl font-black mb-6 italic">您正在 UBER 上嗎？</h3>
            <p className="text-zinc-300 leading-relaxed font-medium mb-12 text-lg">
              「去的時候載得下，<br/>回來的時候我們就接得了：）」<br/><br/>
              <span className="text-zinc-500 text-sm italic">只要確認回程人數與行李相同，<br/>小弟立刻幫您排車！汪！🐶</span>
            </p>
            <button 
              onClick={() => setQuickStep('form')}
              className="w-full bg-yellow-500 text-black py-6 rounded-[30px] font-black text-xl shadow-xl active:scale-95 transition-all"
            >
              我確認回程人數及行李相同
            </button>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl animate-in slide-in-from-right-8">
            <h2 className="text-2xl font-black mb-8 italic text-yellow-500 flex items-center gap-2">
              <IconZap /> 極速預約回程
            </h2>
            <div className="space-y-5">
              <div className="flex gap-2">
                <input type="date" className="flex-1 bg-black border border-zinc-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-yellow-500" />
                <input type="time" onChange={handleTimeChange} className="w-28 bg-black border border-zinc-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-yellow-500" />
              </div>
              <input type="text" placeholder="航班編號 (例如: JX58)" className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-yellow-500" />
              <input type="text" placeholder="聯絡人姓名與電話" className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-yellow-500" />
              <input type="text" placeholder="下車完整地址 (限雙北)" className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-yellow-500" />
            </div>
            <div className="mt-10 pt-8 border-t border-zinc-800 flex justify-between items-center">
               <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">預估費用</p>
                  <p className="text-4xl font-black italic text-white">${price}</p>
               </div>
               <button 
                 onClick={() => alert('汪！預約已送出，請留意 LINE 通知！')}
                 className="bg-white text-black px-10 py-5 rounded-[24px] font-black text-lg hover:bg-yellow-500 transition-all active:scale-95"
               >
                 立即預約
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
