import React, { useState } from 'react';
import { Plane, Truck, Wallet, Clipboard, Zap, Clock, ChevronRight, AlertTriangle } from 'lucide-react';

const OrderCard = ({ order, onAccept }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl hover:border-yellow-500 transition-all cursor-pointer group shadow-2xl mb-4">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="bg-black text-yellow-500 font-mono text-2xl px-4 py-2 rounded-xl border border-zinc-700">
          {order.pickup_time}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{order.flight_no}</span>
          <span className="text-xs font-bold text-zinc-400">{order.terminal}</span>
        </div>
      </div>
      {order.amount >= 1000 && (
        <div className="bg-yellow-500/10 text-yellow-500 text-[10px] font-black px-3 py-1 rounded-full border border-yellow-500/20 animate-pulse flex items-center gap-1">
          <Zap size={10} fill="currentColor"/> 高價獎勵 +20點
        </div>
      )}
    </div>
    <div className="flex items-center gap-4 mb-4">
      <div className="flex-1">
        <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">從哪裡</p>
        <p className="text-white font-bold text-lg leading-tight">{order.origin}</p>
      </div>
      <Plane className="text-zinc-700 rotate-90" size={20}/>
      <div className="flex-1 text-right">
        <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">去哪裡</p>
        <p className="text-white font-bold text-lg leading-tight">{order.destination}</p>
      </div>
    </div>
    <div className="flex justify-between items-center mt-6">
      <span className="text-3xl font-black text-white italic">${order.amount}</span>
      <button 
        onClick={() => onAccept(order)}
        className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-2xl text-sm font-black transition-transform active:scale-95"
      >
        立即接單
      </button>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('lobby');
  const [showAlert, setShowAlert] = useState(false);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans">
      <nav className="fixed top-0 w-full border-b border-zinc-900 bg-black/80 backdrop-blur-2xl z-50 px-6 py-5">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500 p-1.5 rounded-xl text-black font-black"><Truck size={22}/></div>
            <h1 className="text-xl font-black tracking-tighter">PickYouUP <span className="text-yellow-500 italic">2.0</span></h1>
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto pt-28 pb-32 px-6">
        {activeTab === 'lobby' && (
          <div>
            <h2 className="text-3xl font-black italic uppercase mb-8">接單大廳</h2>
            <OrderCard onAccept={() => setShowAlert(true)} order={{pickup_time: '05:30', flight_no: 'BR607', terminal: 'T1', origin: '桃園機場', destination: '板橋區', amount: 1700}} />
            <OrderCard onAccept={() => setShowAlert(true)} order={{pickup_time: '08:15', flight_no: 'JX101', terminal: 'T2', origin: '內湖區', destination: '桃園機場', amount: 1200}} />
          </div>
        )}

        {activeTab === 'dispatch' && (
          <div className="bg-zinc-900 p-8 rounded-[40px] border border-zinc-800">
            <h2 className="text-2xl font-black mb-6 italic flex items-center gap-2"><Clipboard/> 快速發單</h2>
            <textarea className="w-full h-56 bg-black border-2 border-zinc-800 rounded-3xl p-6 text-zinc-100 outline-none focus:border-yellow-500" placeholder="貼上訊息..."></textarea>
            <button className="w-full mt-6 bg-white text-black font-black py-5 rounded-[24px] hover:bg-yellow-500 transition-all flex items-center justify-center gap-2">
              解析並發布單據 <ChevronRight size={20}/>
            </button>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-8 rounded-[40px] text-black shadow-2xl">
            <p className="font-black text-sm opacity-70">預計今日總收入</p>
            <h3 className="text-5xl font-black italic">$3,800</h3>
          </div>
        )}
      </main>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-zinc-900/60 backdrop-blur-3xl border border-white/5 rounded-[32px] p-2 flex justify-between items-center z-50 shadow-2xl">
        {[
          { id: 'lobby', icon: Zap, label: '大廳' },
          { id: 'dispatch', icon: Clipboard, label: '發單' },
          { id: 'wallet', icon: Wallet, label: '錢包' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-1 flex-col items-center py-3 rounded-[24px] transition-all ${
              activeTab === item.id ? 'bg-yellow-500 text-black shadow-lg' : 'text-zinc-500'
            }`}
          >
            <item.icon size={20} strokeWidth={activeTab === item.id ? 3 : 2} />
            <span className="text-[10px] font-black mt-1 uppercase">{item.label}</span>
          </button>
        ))}
      </div>

      {showAlert && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-8">
          <div className="bg-zinc-900 border-2 border-red-500/50 p-8 rounded-[40px] text-center">
            <AlertTriangle className="text-red-500 mx-auto mb-4" size={40}/>
            <h3 className="text-2xl font-black mb-3 text-white">行程衝突！汪！🐶✋</h3>
            <p className="text-zinc-400 text-sm mb-8">小弟幫您算過，您跑完上一趟絕對趕不到這裡！</p>
            <button onClick={() => setShowAlert(false)} className="w-full bg-zinc-800 py-4 rounded-2xl font-black text-sm text-white">我知道了，找下一張</button>
          </div>
        </div>
      )}
    </div>
  );
}
