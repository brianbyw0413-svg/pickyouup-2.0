import React, { useState } from 'react';

// --- 用內建 HTML 代替外部圖示，保證不全黑 ---
const IconTruck = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;

export default function App() {
  const [step, setStep] = useState('home');
  const [price, setPrice] = useState(1300);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans p-6 flex flex-col items-center">
      {/* 頂部導航 */}
      <nav className="w-full max-w-md flex justify-between items-center mb-20 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-500 p-1 rounded text-black"><IconTruck /></div>
          <h1 className="text-xl font-black italic">PickYouUP 2.0</h1>
        </div>
      </nav>

      {/* 主內容區 */}
      <div className="w-full max-w-md text-center">
        {step === 'home' && (
          <div className="animate-in fade-in duration-700">
            <h2 className="text-4xl font-black italic mb-4 leading-tight">
              去時載得下，<br/><span className="text-yellow-500">回來我們就接得了：）</span>
            </h2>
            <p className="text-zinc-500 text-sm mb-12">全台最懂您的 AI 智能接送。汪！🐶</p>

            <button 
              onClick={() => setStep('quick-warning')}
              className="w-full bg-yellow-500 text-black py-8 rounded-[40px] font-black text-xl shadow-xl shadow-yellow-500/20 mb-4 transition-transform active:scale-95"
            >
              🚀 快速預約接機
            </button>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-900 py-6 rounded-[30px] text-zinc-500 font-bold">我要送機</div>
              <div className="bg-zinc-900 py-6 rounded-[30px] text-zinc-500 font-bold">一般接機</div>
            </div>
          </div>
        )}

        {step === 'quick-warning' && (
          <div className="bg-zinc-900 p-10 rounded-[50px] border border-yellow-500/30">
            <h3 className="text-2xl font-black mb-6">您正在 UBER 上嗎？</h3>
            <p className="text-zinc-300 leading-relaxed mb-10 text-lg">
              「去的時候載得下，回來的時候我們就接得了：）」<br/><br/>
              <span className="text-zinc-500 text-sm">如果確認您回程和去程的人數相同，那就開始預訂吧！</span>
            </p>
            <button 
              onClick={() => alert('進入填表流程！')}
              className="w-full bg-white text-black py-6 rounded-[30px] font-black text-lg"
            >
              我確認回程人數相同
            </button>
            <button onClick={() => setStep('home')} className="mt-6 text-zinc-600 block w-full">返回首頁</button>
          </div>
        )}
      </div>
    </div>
  );
}
