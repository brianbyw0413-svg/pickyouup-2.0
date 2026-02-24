import React, { useState } from 'react';
import { Plane, Truck, Zap, Clock, ShieldCheck, MapPin, ChevronRight, Star, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function PickYouUP_v2_Flagship() {
  const [step, setStep] = useState('home'); // home, quick-warning, quick-form, lobby, admin, wallet
  const [formData, setFormData] = useState({ date: '', flight: '', contact: '', address: '', time: '' });
  const [totalPrice, setTotalPrice] = useState(1300);

  // 計算價格邏輯
  const handleTimeChange = (timeValue) => {
    const hour = parseInt(timeValue.split(':')[0]);
    if (hour >= 23 || hour < 6) {
      setTotalPrice(1400);
    } else {
      setTotalPrice(1300);
    }
    setFormData({...formData, time: timeValue});
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-yellow-500 selection:text-black pb-24">
      
      {/* --- 1. 導航欄 --- */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0a0a0c]/60 backdrop-blur-2xl border-b border-white/5 px-6 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setStep('home')}>
            <div className="bg-yellow-500 p-1.5 rounded-xl text-black shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform"><Truck size={24} strokeWidth={3}/></div>
            <h1 className="text-xl font-black tracking-tighter italic">PickYouUP <span className="text-yellow-500 text-sm not-italic font-black">2.0</span></h1>
          </div>
          <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-full text-xs font-black transition-all">司機登入</button>
        </div>
      </nav>

      {/* --- 2. 核心內容區 --- */}
      <main className="max-w-xl mx-auto pt-32 px-6">
        
        {step === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-1 rounded-full text-yellow-500 text-[10px] font-black tracking-[0.2em] mb-6">
                <Zap size={12} fill="currentColor"/> THE PREMIUM AIRPORT SHUTTLE
              </div>
              <h2 className="text-4xl font-black italic tracking-tighter leading-tight mb-4">
                去時載得下，<br/><span className="text-yellow-500">回來我們就接得了：）</span>
              </h2>
              <p className="text-zinc-500 text-sm font-medium">全台最懂您的 AI 智能接送，預約只需一秒鐘。汪！🐶</p>
            </header>

            {/* --- 預約選擇框 --- */}
            <div className="space-y-4">
               {/* 快速接機按鈕 - 核心重點 */}
               <button 
                  onClick={() => setStep('quick-warning')}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-8 rounded-[40px] font-black text-xl shadow-[0_20px_50px_rgba(250,204,21,0.3)] flex flex-col items-center justify-center gap-2 transition-transform active:scale-95"
               >
                  <div className="flex items-center gap-3">
                    <Zap size={24} fill="currentColor"/> 快速預約接機
                  </div>
                  <span className="text-[10px] opacity-70 font-black tracking-widest uppercase">一鍵帶入去程資訊</span>
               </button>

               <div className="grid grid-cols-2 gap-3">
                  <button className="bg-zinc-900 border border-zinc-800 py-6 rounded-[30px] font-bold text-zinc-400 hover:text-white transition-all flex flex-col items-center gap-2">
                    <Plane size={20}/> 我要送機
                  </button>
                  <button className="bg-zinc-900 border border-zinc-800 py-6 rounded-[30px] font-bold text-zinc-400 hover:text-white transition-all flex flex-col items-center gap-2">
                    <Plane size={20} className="rotate-180"/> 一般接機
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* --- 3. 快速接機警告標語 --- */}
        {step === 'quick-warning' && (
          <div className="animate-in zoom-in-95 duration-500 text-center">
             <div className="bg-zinc-900 border border-yellow-500/30 p-10 rounded-[50px] shadow-2xl">
                <div className="bg-yellow-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
                   <AlertCircle className="text-yellow-500" size={40}/>
                </div>
                <h3 className="text-2xl font-black mb-6">您正在 UBER 上嗎？</h3>
                <p className="text-zinc-300 leading-relaxed font-medium mb-10 text-lg">
                   「去的時候載得下，回來的時候我們就接得了：）」<br/><br/>
                   <span className="text-zinc-500 text-sm">如果確認您回程和去程的行李、人數相同，那我們就開始預訂吧！汪！🐶</span>
                </p>
                <button 
                  onClick={() => setStep('quick-form')}
                  className="w-full bg-white text-black py-6 rounded-[30px] font-black text-lg hover:bg-yellow-500 transition-all shadow-xl"
                >
                   我確認回程人數及行李相同
                </button>
                <button onClick={() => setStep('home')} className="mt-6 text-zinc-600 text-xs font-bold hover:text-zinc-400">返回首頁</button>
             </div>
          </div>
        )}

        {/* --- 4. 快速接機填寫表單 --- */}
        {step === 'quick-form' && (
          <div className="animate-in slide-in-from-right-8 duration-500">
             <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl">
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3 italic text-yellow-500"><Clipboard/> 填寫回程資料</h2>
                
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">降落日期與預計時間</label>
                      <div className="flex gap-2">
                        <input type="date" className="flex-1 bg-black border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-yellow-500 transition" />
                        <input type="time" onChange={(e) => handleTimeChange(e.target.value)} className="w-32 bg-black border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-yellow-500 transition" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">回程航班編號</label>
                      <input type="text" placeholder="例如：JX58" className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-yellow-500 transition" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">聯絡人姓名與電話</label>
                      <input type="text" placeholder="例如：王先生 0912..." className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-yellow-500 transition" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">下車地址 (限雙北市)</label>
                      <input type="text" placeholder="請輸入您的下車完整地址" className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-yellow-500 transition" />
                   </div>
                </div>

                <div className="mt-10 pt-8 border-t border-zinc-800 flex justify-between items-center">
                   <div>
                      <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">本趟預估費用</p>
                      <p className="text-4xl font-black italic text-white">${totalPrice}</p>
                   </div>
                   <button 
                    onClick={() => alert('汪！預約明細已送出，請留意 LINE 通知確認付款！')}
                    className="bg-yellow-500 text-black px-10 py-5 rounded-[24px] font-black text-lg hover:bg-yellow-400 shadow-xl shadow-yellow-500/20 transition-all active:scale-95"
                   >
                     立即預約
                   </button>
                </div>
             </div>
             <button onClick={() => setStep('home')} className="w-full mt-6 text-zinc-600 text-xs font-bold hover:text-zinc-400">返回取消</button>
          </div>
        )}
      </main>

      {/* --- 底部導航選單 (老皮樣式) --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-zinc-900/60 backdrop-blur-3xl border border-white/5 rounded-[40px] p-2 flex justify-between items-center z-50 shadow-2xl">
        {[
          { id: 'home', icon: Zap, label: '預約' },
          { id: 'lobby', icon: Truck, label: '大廳' },
          { id: 'wallet', icon: Wallet, label: '我的' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => { if(item.id === 'home') setStep('home'); }}
            className={`flex flex-1 flex-col items-center py-4 rounded-[30px] transition-all ${
              (step === 'home' || step === 'quick-warning' || step === 'quick-form') && item.id === 'home' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 scale-105' : 'text-zinc-500'
            }`}
          >
            <item.icon size={20} strokeWidth={3} />
            <span className="text-[9px] font-black mt-1 uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
