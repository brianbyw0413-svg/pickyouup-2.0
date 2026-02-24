import React, { useState } from 'react';
import { Plane, Truck, Zap, Clock, ShieldCheck, MapPin, ChevronRight, Star, Users } from 'lucide-react';

export default function PickYouUP_Flagship() {
  const [serviceType, setServiceType] = useState('dropoff'); // dropoff, pickup

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* --- 1. 導航欄 --- */}
      <nav className="fixed top-0 w-full z-[100] bg-[#0a0a0c]/60 backdrop-blur-2xl border-b border-white/5 px-6 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-yellow-500 p-1.5 rounded-xl text-black shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform"><Truck size={24} strokeWidth={3}/></div>
            <h1 className="text-xl font-black tracking-tighter italic">PickYouUP <span className="text-yellow-500 text-sm not-italic">2.0</span></h1>
          </div>
          <div className="hidden md:flex gap-8 text-xs font-black uppercase tracking-widest text-zinc-400">
            <a href="#" className="hover:text-yellow-500 transition">服務範圍</a>
            <a href="#" className="hover:text-yellow-500 transition">車型介紹</a>
            <a href="#" className="hover:text-yellow-500 transition">VIP 專區</a>
          </div>
          <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-full text-xs font-black transition-all">司機登入</button>
        </div>
      </nav>

      {/* --- 2. 英雄展位 (Hero Section) --- */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* 背景光暈 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent opacity-50"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-1 rounded-full text-yellow-500 text-[10px] font-black tracking-[0.2em] mb-6 animate-bounce">
            <Star size={12} fill="currentColor"/> 24H 專業機場接送服務
          </div>
          <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-8 leading-tight">
            從從容容，<br/>
            <span className="text-yellow-500">遊刃有餘。</span>
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            我們不只是開車，是為您的每一趟旅程注入安心與溫度。<br/>
            全台灣最聰明的 AI 調度系統，守護您的每一哩路。汪！🐶
          </p>

          {/* --- 核心預約框 (SuperShuttle Style) --- */}
          <div className="bg-zinc-900/80 backdrop-blur-3xl border border-white/10 p-2 rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.8)] max-w-2xl mx-auto">
            <div className="flex p-1 gap-1 mb-2">
              <button 
                onClick={() => setServiceType('dropoff')}
                className={`flex-1 py-4 rounded-[30px] text-sm font-black transition-all flex items-center justify-center gap-2 ${serviceType === 'dropoff' ? 'bg-yellow-500 text-black shadow-xl shadow-yellow-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Plane className={serviceType === 'dropoff' ? '' : 'opacity-50'} size={18}/> 我要送機
              </button>
              <button 
                onClick={() => setServiceType('pickup')}
                className={`flex-1 py-4 rounded-[30px] text-sm font-black transition-all flex items-center justify-center gap-2 ${serviceType === 'pickup' ? 'bg-yellow-500 text-black shadow-xl shadow-yellow-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Plane className={serviceType === 'pickup' ? 'rotate-180' : 'rotate-180 opacity-50'} size={18}/> 我要接機
              </button>
            </div>
            
            <div className="p-4 space-y-3">
               <div className="group bg-black/40 border border-white/5 rounded-3xl p-5 flex items-center gap-4 hover:border-yellow-500/50 transition-all cursor-pointer">
                  <div className="bg-zinc-800 p-3 rounded-2xl text-zinc-400 group-hover:text-yellow-500 transition-colors"><MapPin size={24}/></div>
                  <div className="text-left">
                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">您的位置</p>
                     <p className="text-lg font-bold text-zinc-300">請輸入上車地址...</p>
                  </div>
               </div>
               <div className="group bg-black/40 border border-white/5 rounded-3xl p-5 flex items-center gap-4 hover:border-yellow-500/50 transition-all cursor-pointer">
                  <div className="bg-zinc-800 p-3 rounded-2xl text-zinc-400 group-hover:text-yellow-500 transition-colors"><Plane size={24}/></div>
                  <div className="text-left flex-1">
                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">前往機場</p>
                     <p className="text-lg font-bold text-zinc-300">桃園機場 T1/T2, 松山機場</p>
                  </div>
                  <ChevronRight className="text-zinc-700" size={24}/>
               </div>
               <button className="w-full bg-white text-black py-6 rounded-[30px] font-black text-lg hover:bg-yellow-500 transition-all transform active:scale-95 flex items-center justify-center gap-3 mt-4">
                  即刻試算車資 <Zap size={20} fill="currentColor"/>
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. 動態即時看板 (Busy Vibes) --- */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1">
               <h3 className="text-3xl font-black italic mb-6">全台最忙碌的<br/><span className="text-yellow-500">智能調度中心</span></h3>
               <p className="text-zinc-500 font-medium leading-relaxed">
                  老皮大腦正 24 小時不間斷地監控全台航班與路況，確保每一位司機都能精準抵達。汪！🐶
               </p>
               <div className="mt-8 flex gap-4">
                  <div className="bg-zinc-900 p-6 rounded-3xl border border-white/5 flex-1">
                     <p className="text-3xl font-black italic text-yellow-500">42</p>
                     <p className="text-[9px] font-bold text-zinc-500 uppercase mt-1">在線行程</p>
                  </div>
                  <div className="bg-zinc-900 p-6 rounded-3xl border border-white/5 flex-1">
                     <p className="text-3xl font-black italic text-green-500">99.8%</p>
                     <p className="text-[9px] font-bold text-zinc-500 uppercase mt-1">準點率</p>
                  </div>
               </div>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* 模擬動態卡片 1 */}
               <div className="bg-gradient-to-tr from-zinc-900 to-zinc-900/50 border border-white/5 p-6 rounded-[32px] relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-4">
                     <div className="bg-black text-yellow-500 font-mono text-xl px-3 py-1 rounded-lg">08:15</div>
                     <span className="text-[10px] font-black text-zinc-500 tracking-widest">JX101 / T2</span>
                  </div>
                  <p className="text-lg font-bold mb-4">內湖區 ➔ 桃園機場</p>
                  <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase">
                     <ShieldCheck size={14}/> 司機已出發
                  </div>
               </div>
               {/* 模擬動態卡片 2 */}
               <div className="bg-gradient-to-tr from-zinc-900 to-zinc-900/50 border border-white/5 p-6 rounded-[32px] relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-4">
                     <div className="bg-black text-yellow-500 font-mono text-xl px-3 py-1 rounded-lg">12:00</div>
                     <span className="text-[10px] font-black text-zinc-500 tracking-widest">CI106 / TSA</span>
                  </div>
                  <p className="text-lg font-bold mb-4">新店區 ➔ 松山機場</p>
                  <div className="flex items-center gap-2 text-yellow-500 text-[10px] font-black uppercase">
                     <Clock size={14}/> 媒合成功
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- 4. 品牌溫度牆 --- */}
      <section className="bg-yellow-500 py-20 px-6 overflow-hidden relative">
         <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12 text-black"><Truck size={400}/></div>
         <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="max-w-xl">
               <h3 className="text-4xl md:text-5xl font-black text-black italic mb-6">不只是接送，<br/>是家人的叮嚀。</h3>
               <p className="text-black/70 font-bold text-lg mb-8">
                  「最重要就是溫度」。我們賣的是安心與體貼。從行李打包提醒到即時路況警報，老皮幫您想在最前面。
               </p>
               <div className="flex gap-4">
                  <div className="bg-black/5 p-4 rounded-2xl flex items-center gap-3">
                     <Users className="text-black" size={32}/>
                     <div>
                        <p className="text-xl font-black text-black">VIP</p>
                        <p className="text-xs font-bold text-black/50 tracking-widest">專屬接待機制</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="w-full md:w-80 h-96 bg-black rounded-[40px] shadow-2xl flex items-center justify-center p-8 border-4 border-white/20">
               <div className="text-center">
                  <div className="bg-yellow-500 w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-black"><Zap size={40} fill="currentColor"/></div>
                  <p className="text-white font-black text-xl mb-2 italic">老皮大腦已就位</p>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed">隨時監控全台 12 家航空公司與 5 條國道路況</p>
               </div>
            </div>
         </div>
      </section>

      {/* --- 頁尾 --- */}
      <footer className="py-12 px-6 border-t border-white/5 text-center">
         <p className="text-zinc-600 text-[10px] font-black tracking-[0.4em] uppercase">© 2026 PickYouUP Driver Alliance. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
