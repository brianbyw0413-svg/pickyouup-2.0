import React, { useState, useEffect } from 'react';
import { Plane, Truck, Wallet, Clipboard, Zap, Clock, ChevronRight, AlertTriangle, Users, BarChart3, MessageSquare, ShieldCheck, MapPin } from 'lucide-react';

// --- 組件：機場翻頁鐘風格卡片 ---
const FlipOrderCard = ({ order, role, onAccept }) => (
  <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[32px] hover:border-yellow-500 transition-all cursor-pointer group shadow-2xl backdrop-blur-xl mb-4 relative overflow-hidden">
    {order.amount >= 1000 && <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-bl-2xl animate-pulse">PREMIUM</div>}
    
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <div className="bg-black text-yellow-500 font-mono text-3xl px-4 py-2 rounded-xl border border-zinc-700 shadow-inner">
          {order.pickup_time}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-black text-zinc-500 tracking-widest uppercase">{order.flight_no}</span>
          <span className="text-sm font-bold text-white">{order.terminal}</span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-3xl font-black text-white italic">${order.amount}</p>
        {order.amount >= 1000 && <p className="text-[10px] text-yellow-500 font-bold">+20 點獎勵 ✨</p>}
      </div>
    </div>

    <div className="flex items-center gap-6 mb-6">
      <div className="flex-1">
        <p className="text-zinc-500 text-[10px] font-black uppercase mb-1">起點</p>
        <p className="text-white font-bold text-lg">{order.origin}</p>
      </div>
      <div className="flex flex-col items-center">
        <Plane className="text-zinc-700 rotate-90 mb-1" size={20}/>
        <div className="h-px w-12 bg-zinc-800"></div>
      </div>
      <div className="flex-1 text-right">
        <p className="text-zinc-500 text-[10px] font-black uppercase mb-1">終點</p>
        <p className="text-white font-bold text-lg">{order.destination}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 mb-6">
      <div className="bg-black/40 rounded-2xl p-3 border border-zinc-800/50">
        <p className="text-zinc-500 text-[9px] font-black uppercase mb-1">乘客資訊</p>
        <p className="text-zinc-200 text-xs font-bold">{order.passengers}位 / {order.luggage}</p>
      </div>
      <div className="bg-black/40 rounded-2xl p-3 border border-zinc-800/50">
        <p className="text-zinc-500 text-[9px] font-black uppercase mb-1">預估車程</p>
        <p className="text-zinc-200 text-xs font-bold">{order.duration} 分鐘</p>
      </div>
    </div>

    <button 
      onClick={() => onAccept(order)}
      className="w-full bg-white hover:bg-yellow-500 text-black font-black py-4 rounded-[20px] transition-all transform active:scale-95 shadow-xl flex items-center justify-center gap-2 group-hover:gap-4"
    >
      {role === 'driver' ? '立即接單' : '管理行程'} <ChevronRight size={18}/>
    </button>
  </div>
);

export default function PickYouUP_v2() {
  const [activeTab, setActiveTab] = useState('lobby'); // lobby, admin, wallet
  const [isCollision, setIsCollision] = useState(false);

  const mockOrders = [
    { id: 1, pickup_time: '05:30', flight_no: 'BR607', terminal: '桃園 T1', origin: '桃園機場', destination: '板橋區', passengers: 1, luggage: '6大行李 (大車)', duration: 45, amount: 1700 },
    { id: 2, pickup_time: '08:15', flight_no: 'JX101', terminal: '桃園 T2', origin: '內湖區', destination: '桃園機場', passengers: 2, luggage: '2大行李', duration: 50, amount: 1200 },
    { id: 3, pickup_time: '12:00', flight_no: 'CI106', terminal: '松山 TSA', origin: '新店區', destination: '松山機場', passengers: 1, luggage: '1小行李', duration: 30, amount: 900 }
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans pb-32">
      {/* --- 頂部導航 --- */}
      <nav className="sticky top-0 w-full border-b border-zinc-900 bg-black/80 backdrop-blur-3xl z-50 px-6 py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 p-1.5 rounded-xl text-black shadow-lg shadow-yellow-500/20"><Truck size={24} strokeWidth={3}/></div>
            <div>
              <h1 className="text-xl font-black tracking-tighter leading-none">PickYouUP <span className="text-yellow-500 italic text-sm">2.0</span></h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Driver Alliance</p>
            </div>
          </div>
          
          {/* 管理數據 (桌面版顯示) */}
          <div className="hidden md:flex gap-8">
            <div className="text-center">
              <p className="text-[10px] text-zinc-500 font-bold uppercase">在線行程</p>
              <p className="text-lg font-mono font-bold text-yellow-500">42</p>
            </div>
            <div className="text-center border-l border-zinc-800 pl-8">
              <p className="text-[10px] text-zinc-500 font-bold uppercase">今日回饋</p>
              <p className="text-lg font-mono font-bold text-green-500">+480 點</p>
            </div>
          </div>

          <div className="w-10 h-10 bg-gradient-to-tr from-zinc-800 to-zinc-700 rounded-2xl flex items-center justify-center border border-zinc-600 shadow-xl font-black">B</div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        {/* --- 1. 接單大廳 --- */}
        {activeTab === 'lobby' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="lg:col-span-2 text-white">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter">接單大廳</h2>
                <div className="flex-1 h-px bg-zinc-800"></div>
                <div className="flex gap-2">
                   <span className="bg-zinc-800 p-2 rounded-lg text-zinc-400"><MapPin size={16}/></span>
                   <span className="bg-zinc-800 p-2 rounded-lg text-zinc-400"><Clock size={16}/></span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockOrders.map(order => (
                  <FlipOrderCard 
                    key={order.id} 
                    order={order} 
                    role="driver"
                    onAccept={(o) => o.pickup_time === '08:15' ? setIsCollision(true) : alert('汪！接單成功！')} 
                  />
                ))}
              </div>
            </div>
            
            {/* 右側小工具：快速統計 */}
            <div className="space-y-6">
               <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[32px]">
                  <h3 className="font-black text-sm uppercase mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-yellow-500"/> 熱門區域趨勢</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400">桃園機場 T1</span>
                        <span className="font-bold">12 趟預約</span>
                     </div>
                     <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 h-full w-[70%]"></div>
                     </div>
                     <div className="flex justify-between items-center text-xs pt-2">
                        <span className="text-zinc-400">台北板橋區</span>
                        <span className="font-bold">8 趟預約</span>
                     </div>
                     <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[45%]"></div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* --- 2. 車頭/管理員指揮中心 --- */}
        {activeTab === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
             {/* 快速拋單窗口 */}
             <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-5 rotate-12 text-white"><MessageSquare size={300}/></div>
                <h2 className="text-3xl font-black mb-2 italic flex items-center gap-3">老皮指揮官 <span className="text-yellow-500">TAB</span></h2>
                <p className="text-zinc-500 text-sm mb-8">貼上亂碼訊息，小弟自動幫您產出卡片。</p>
                <div className="bg-black rounded-3xl p-1 mb-6 flex border border-zinc-800">
                   <button className="flex-1 py-3 text-xs font-black bg-zinc-800 rounded-2xl text-yellow-500">快速發單解析</button>
                   <button className="flex-1 py-3 text-xs font-black text-zinc-500">對話調度中心</button>
                </div>
                <textarea 
                  className="w-full h-64 bg-black border-2 border-zinc-800 rounded-3xl p-6 text-zinc-100 focus:border-yellow-500 outline-none transition-all placeholder:text-zinc-800 font-mono text-sm"
                  placeholder="2/23 BR607 05:30 桃園接機 1人6大行李 回板橋..."
                ></textarea>
                <button className="w-full mt-6 bg-white text-black font-black py-5 rounded-[24px] hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 shadow-2xl">
                  一鍵解析並發布單據 <Zap size={18} fill="currentColor"/>
                </button>
             </div>

             {/* 管理員儀表板：司機與客戶管理 */}
             <div className="space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px]">
                   <h3 className="text-xl font-black mb-6 flex items-center gap-3"><Users className="text-blue-500"/> 優質司機監控</h3>
                   <div className="space-y-4">
                      {['陳大哥 (Tesla Y)', '張大哥 (RAV4)', '李姐 (n7)'].map((name, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-zinc-800">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-zinc-800 rounded-full border border-zinc-700 flex items-center justify-center text-[10px]">{name[0]}</div>
                              <span className="text-sm font-bold">{name}</span>
                           </div>
                           <span className="text-xs bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20 font-black">在線中</span>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px]">
                   <h3 className="text-xl font-black mb-6 flex items-center gap-3"><ShieldCheck className="text-green-500"/> VIP 客戶識別</h3>
                   <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl">
                      <p className="text-yellow-500 text-sm font-bold">板橋陳先生 已上線</p>
                      <p className="text-zinc-500 text-[10px] mt-1 italic">身分識別碼：U87925b...a83a</p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- 3. 司機錢包 --- */}
        {activeTab === 'wallet' && (
          <div className="max-w-2xl mx-auto animate-in slide-in-from-right-8 duration-500">
             <div className="bg-gradient-to-br from-yellow-500 via-yellow-500 to-amber-600 p-10 rounded-[50px] text-black shadow-[0_20px_50px_rgba(250,204,21,0.2)] mb-10 relative overflow-hidden group">
                <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 transition-transform group-hover:scale-110 duration-700"><Wallet size={240}/></div>
                <p className="font-black text-xs uppercase tracking-[0.2em] mb-2 opacity-60">可用收益餘額 (TWD)</p>
                <h3 className="text-7xl font-black italic tracking-tighter">$12,450</h3>
                <div className="mt-12 grid grid-cols-2 gap-4">
                   <div className="bg-black/10 backdrop-blur-xl rounded-[24px] p-5 border border-black/5">
                      <p className="text-[10px] font-black uppercase opacity-50 mb-1">待轉入手續費 (5%)</p>
                      <p className="text-2xl font-black tracking-tighter">$622</p>
                   </div>
                   <div className="bg-black/10 backdrop-blur-xl rounded-[24px] p-5 border border-black/5">
                      <p className="text-[10px] font-black uppercase opacity-50 mb-1">分享獎勵儲值金</p>
                      <p className="text-2xl font-black tracking-tighter text-black">+140 點</p>
                   </div>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-zinc-900 border border-zinc-800 py-6 rounded-[28px] font-black text-sm flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all">
                   <BarChart3 size={20}/> 歷史收益報表
                </button>
                <button className="bg-white text-black py-6 rounded-[28px] font-black text-sm flex items-center justify-center gap-3 hover:bg-zinc-100 transition-all shadow-xl">
                   <ChevronRight size={20}/> 申請提領收益
                </button>
             </div>
          </div>
        )}
      </main>

      {/* --- 底部全局導航選單 (毛玻璃質感) --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-zinc-900/60 backdrop-blur-3xl border border-white/5 rounded-[40px] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex justify-between items-center z-50">
        {[
          { id: 'lobby', icon: Zap, label: '大廳' },
          { id: 'admin', icon: ShieldCheck, label: '指揮' },
          { id: 'wallet', icon: Wallet, label: '錢包' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-1 flex-col items-center py-4 rounded-[30px] transition-all duration-300 ${
              activeTab === item.id ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 scale-105' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <item.icon size={22} strokeWidth={activeTab === item.id ? 3 : 2} />
            <span className="text-[10px] font-black mt-1.5 uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </div>

      {/* --- 邏輯組件：智慧防撞期警告 --- */}
      {isCollision && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-zinc-900 border-2 border-red-500/30 p-10 rounded-[50px] text-center max-w-sm shadow-[0_0_50px_rgba(239,68,68,0.1)]">
            <div className="bg-red-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <AlertTriangle className="text-red-500" size={48}/>
            </div>
            <h3 className="text-3xl font-black mb-4">行程衝突！汪！🐶✋</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-10">
              小弟幫您算過，您跑完上一趟絕對趕不到這裡，會遲到的！<br/><br/>
              <span className="text-white font-black px-3 py-1 bg-red-500/20 rounded-lg">
                (路程需 40 分鐘，您只有 10 分鐘緩衝)
              </span>
            </p>
            <button 
              onClick={() => setIsCollision(false)}
              className="w-full bg-zinc-800 text-white py-5 rounded-[24px] font-black text-sm hover:bg-zinc-700 transition-all border border-zinc-700"
            >
              我知道了，找下一張
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
