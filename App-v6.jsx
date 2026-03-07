import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import liff from '@line/liff';

const supabase = createClient(
  'https://vtvytcrkoqbluvczyepm.supabase.co',
  'sb_publishable_SOp1vthQKdTdQUwoHsMIQA_FCTxzbie'
);

// ═══════════════════════════════════════════════════
// 常數
// ═══════════════════════════════════════════════════

const LIFF_ID = '2009218677-iJIIF1oj';
const LINE_ID_ID = '@835acfgq';
const LINE_OA_URL = `https://line.me/R/oaMessage/${encodeURIComponent(LINE_ID_ID)}/`;

const BASE_PRICING = {
  'small-dropoff': 1200,
  'large-dropoff': 1500,
  'small-pickup': 1300,
  'large-pickup': 1600,
};

const CREDIT_CARD_LINKS = {
  1200: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/PN8Fwvsnm1m7AdiVeUUp',
  1300: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/N42KcEIcfxs3YbqIOlCq',
  1400: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/ENwPsxoEKRnlPuBrSmof',
  1500: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/NqKaoMvyeJt1m3oRLyVy',
  1600: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/mFSjuWEYtktw9pT53lXi',
  1700: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/wvYo8iPse2TJA8DoaCgv',
  1800: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/arUDQda2YStEgj0Zckjr',
  1900: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/GT1VZ2GhpVQypVlVXVkM',
  2000: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/3S8SSKwIaTO4qQFFG5ut',
  2100: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/q1ZSvwEqbWuueQgBGWbb',
  2200: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/b3dH6bth8f6baNqrslxk',
  2300: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/FY7KkY2cpxWUdXaiFVAp',
  2400: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/F0FJSY1weNBmHUSP51LC',
  2500: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/0Ki81I3Knx9BgjqN8x1T',
  2600: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/oDgpoE6ZBZflEl2vfe15',
  2700: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/ghIDs1YbPQApJNfGPtzR',
  2800: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/yTmV7m3T9rtdrMLvU28i',
  2900: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/T5lN1BZijoUrwZpEsFju',
  3000: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/b10tDeTF4LU9tikzLBij',
  3100: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/p641ccGnWnzu7JpJ5YDX',
  3200: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/Lt3gvazrBKe9A8EDKHf2',
};

const EMPTY_FORM = { name: '', phone: '', address: '', date: '', time: '', flight: '' };

// ═══════════════════════════════════════════════════
// 工具函式
// ═══════════════════════════════════════════════════

const getTodayString = () => new Date().toISOString().slice(0, 10);
const isValidPhone = (phone) => /^09\d{8}$/.test(phone.replace(/[-\s]/g, ''));

const formatLiffPhone = (phone) => {
  if (!phone) return '';
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+886')) {
    return '0' + cleaned.slice(4);
  }
  if (cleaned.startsWith('886')) {
    return '0' + cleaned.slice(3);
  }
  return cleaned;
};

const generateOrderRef = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PYU-${dateStr}-${rand}`;
};

const getModeLabel = (m) => {
  if (m === 'dropoff') return '送機';
  if (m === 'pickup') return '接機';
  return '來回接送';
};

const getCarLabel = (c) => (c === 'small' ? '小車 (5人座)' : '大車 (9人座)');

// ═══════════════════════════════════════════════════
// 共用元件
// ═══════════════════════════════════════════════════

const Layout = ({ children }) => (
  <div className="min-h-screen bg-[#0a0a0c] text-white p-4 flex flex-col items-center overflow-x-hidden relative font-sans">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none"></div>
    <div className="w-full max-w-[480px] relative z-10">{children}</div>
  </div>
);

const FieldError = ({ message }) =>
  message ? <div className="mt-1 text-red-400 text-sm font-bold">{message}</div> : null;

const Countdown = ({ createdAt }) => {
  const [remaining, setRemaining] = useState('');
  useEffect(() => {
    const deadline = createdAt + 2 * 60 * 60 * 1000;
    const tick = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) { setRemaining('已逾時'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [createdAt]);
  return (
    <p className={`text-sm font-bold ${remaining === '已逾時' ? 'text-red-400' : 'text-zinc-400'}`}>
      付款時限：{remaining}
    </p>
  );
};

// ═══════════════════════════════════════════════════
// 主元件
// ═══════════════════════════════════════════════════

export default function App() {
  const [page, setPage] = useState('home');
  const [carType, setCarType] = useState('');
  const [mode, setMode] = useState('');
  const [paidStep, setPaidStep] = useState('none');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bothStep, setBothStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderRef, setOrderRef] = useState('');
  const [orderCreatedAt, setOrderCreatedAt] = useState(null);

  const [dropoffForm, setDropoffForm] = useState({ ...EMPTY_FORM });
  const [pickupForm, setPickupForm] = useState({ ...EMPTY_FORM });

  // ── LIFF 初始化 ──
  useEffect(() => {
    liff.init({ liffId: LIFF_ID })
      .then(() => {
        if (liff.isLoggedIn()) {
          // 嘗試取得 Profile 與 Phone (若有權限)
          Promise.all([
            liff.getProfile(),
            liff.getPhoneNumber().catch(() => null)
          ]).then(([profile, phoneNumber]) => {
            const formattedPhone = formatLiffPhone(phoneNumber);
            setDropoffForm(prev => ({ 
              ...prev, 
              name: profile.displayName,
              phone: formattedPhone || prev.phone
            }));
            setPickupForm(prev => ({ 
              ...prev, 
              name: profile.displayName,
              phone: formattedPhone || prev.phone
            }));
          });
        }
      })
      .catch(err => console.error('LIFF Init error', err));
  }, []);

  // ── 導覽 ──
  useEffect(() => {
    const handlePopState = (e) => setPage(e.state?.page || 'home');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (nextPage) => {
    window.history.pushState({ page: nextPage }, '', '');
    setPage(nextPage);
    setErrors({});
    window.scrollTo(0, 0);
  };

  // ── 價格計算 ──
  const dropoffBase = BASE_PRICING[`${carType}-dropoff`] || 0;
  const pickupBase = BASE_PRICING[`${carType}-pickup`] || 0;

  const calcTotal = () => {
    if (mode === 'dropoff') return dropoffBase;
    if (mode === 'pickup') return pickupBase;
    if (mode === 'both') return dropoffBase + pickupBase;
    return 0;
  };

  const totalPrice = calcTotal();

  // ── 表單驗證 ──
  const validateForm = (form, formMode) => {
    const errs = {};
    if (!form.name.trim()) errs.name = '請輸入聯絡人姓名';
    if (!form.phone.trim()) errs.phone = '請輸入聯絡電話';
    else if (!isValidPhone(form.phone)) errs.phone = '請輸入正確的手機號碼（09 開頭，共 10 碼）';
    if (!form.date) errs.date = '請選擇日期';
    else if (form.date < getTodayString()) errs.date = '日期不可選擇過去的日期';
    if (!form.flight.trim()) errs.flight = '請輸入航班編號';
    if (!form.address.trim()) errs.address = formMode === 'pickup' ? '請輸入下車詳細地址' : '請輸入上車詳細地址';
    if (formMode === 'dropoff' && !form.time) errs.time = '請選擇上車時間';
    return errs;
  };

  const resetAll = () => {
    setDropoffForm({ ...EMPTY_FORM });
    setPickupForm({ ...EMPTY_FORM });
    setPaidStep('none');
    setBothStep(1);
    setCopied(false);
    setErrors({});
    setOrderRef('');
    setOrderCreatedAt(null);
  };

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText('12220000471580');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = '12220000471580';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGoToConfirm = () => {
    if (mode === 'both') {
      const dropErrs = validateForm(dropoffForm, 'dropoff');
      const pickErrs = validateForm(pickupForm, 'pickup');
      if (Object.keys(dropErrs).length > 0 || Object.keys(pickErrs).length > 0) {
        setErrors({ ...dropErrs, ...pickErrs });
        return;
      }
    } else {
      const form = mode === 'pickup' ? pickupForm : dropoffForm;
      const errs = validateForm(form, mode);
      if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    }
    navigateTo('confirm');
  };

  // ── 提交訂單 (方案B：統一新欄位名) ──
  const handleBooking = async () => {
    setIsSubmitting(true);
    const ref = generateOrderRef();
    const orders = [];

    if (mode === 'dropoff' || mode === 'both') {
      orders.push({
        order_ref: ref,
        service_mode: 'dropoff',
        car_type: carType,
        contact_name: dropoffForm.name.trim(),
        contact_phone: dropoffForm.phone.replace(/[-\s]/g, ''),
        pickup_address: dropoffForm.address.trim(),
        dropoff_address: '',
        service_date: dropoffForm.date,
        pickup_time: dropoffForm.time,
        flight_number: dropoffForm.flight.trim().toUpperCase(),
        amount: mode === 'both' ? dropoffBase : totalPrice,
        total_amount: totalPrice,
        status: 'pending',
        payment_method: '',
      });
    }

    if (mode === 'pickup' || mode === 'both') {
      orders.push({
        order_ref: ref,
        service_mode: 'pickup',
        car_type: carType,
        contact_name: pickupForm.name.trim(),
        contact_phone: pickupForm.phone.replace(/[-\s]/g, ''),
        pickup_address: '',
        dropoff_address: pickupForm.address.trim(),
        service_date: pickupForm.date,
        pickup_time: '',
        flight_number: pickupForm.flight.trim().toUpperCase(),
        amount: mode === 'both' ? pickupBase : totalPrice,
        total_amount: totalPrice,
        status: 'pending',
        payment_method: '',
      });
    }

    const { error } = await supabase.from('orders').insert(orders);
    if (!error) {
      setOrderRef(ref);
      setOrderCreatedAt(Date.now());
      setPaidStep('choice');
      navigateTo('payment');
    } else {
      alert('預約暫時無法提交，請稍後再試。');
      console.error('Supabase error:', error);
    }
    setIsSubmitting(false);
  };

  const handleDone = () => {
    const mainForm = mode === 'pickup' ? pickupForm : dropoffForm;
    const summary = [
      `【PickYouUP 付款回報】`,
      `訂單編號：${orderRef}`,
      `姓名：${mainForm.name}`,
      `電話：${mainForm.phone}`,
      `服務：${getModeLabel(mode)}`,
      `車型：${getCarLabel(carType)}`,
      `總計：$${totalPrice} 元`,
      ``,
      `您好，我已完成付款，請幫我確認。`,
    ].join('\n');

    if (liff.isInClient()) {
      liff.sendMessages([{ type: 'text', text: summary }])
        .then(() => liff.closeWindow())
        .catch(() => window.open(LINE_OA_URL + encodeURIComponent(summary), '_blank'));
    } else {
      window.open(LINE_OA_URL + encodeURIComponent(summary), '_blank');
    }
  };

  const getCreditCardLink = () => CREDIT_CARD_LINKS[totalPrice] || null;

  // ═══════════════════════════════════════════════════
  // 頁面：首頁
  // ═══════════════════════════════════════════════════
  if (page === 'home')
    return (
      <Layout>
        <nav className="w-full py-8 mb-12 flex justify-center border-b border-white/5">
          <h1 className="text-3xl font-black text-yellow-500 uppercase">PICKYOUUP.TW</h1>
        </nav>
        <div className="w-full text-center space-y-6 animate-in fade-in duration-1000 uppercase font-black italic">
          <h2 className="text-[11vw] md:text-6xl mb-16 tracking-tighter">
            快速預約<br /><span className="text-yellow-500">專業接送</span>
          </h2>
          <div className="space-y-4 px-2 not-italic">
            <button onClick={() => { setMode('dropoff'); navigateTo('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl transition-all shadow-xl">我要送機</button>
            <button onClick={() => { setMode('pickup'); navigateTo('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl transition-all shadow-xl">我要接機</button>
            <button onClick={() => { setMode('both'); navigateTo('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl shadow-xl transition-all">接送一併預訂</button>
          </div>
          <p className="text-[10px] text-yellow-500/40 tracking-[0.3em] mt-12 not-italic font-bold">PREMIUM SERVICE SINCE 2026</p>
        </div>
      </Layout>
    );

  // ═══════════════════════════════════════════════════
  // 頁面：選擇車型
  // ═══════════════════════════════════════════════════
  if (page === 'choice')
    return (
      <Layout>
        <div className="mt-8 mb-6">
          <h2 className="text-3xl font-black italic text-yellow-500 text-center uppercase">{getModeLabel(mode)}</h2>
          <p className="text-center text-zinc-400 mt-2">請選擇車型</p>
        </div>
        <div className="space-y-4">
          <button onClick={() => { setCarType('small'); navigateTo('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black transition-all group shadow-xl">
            <div className="text-xl font-black">小車直達 (5人座)</div>
            <div className="text-sm text-zinc-400 group-hover:text-black/70">乘客1-4人 / 行李1-3件 / 直達無加點</div>
          </button>
          <button onClick={() => { setCarType('large'); navigateTo('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black transition-all group shadow-xl">
            <div className="text-xl font-black">大車直達 (9人座)</div>
            <div className="text-sm text-zinc-400 group-hover:text-black/70">乘客1-8人 / 行李1-8件 / 直達無加點</div>
          </button>
          <a href={`https://line.me/ti/p/~${LINE_ID_ID}`} target="_blank" rel="noopener noreferrer" className="block w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[40px] text-center hover:bg-zinc-800 transition-all">
            <div className="text-zinc-400 text-sm">我真的不確定...</div>
            <div className="text-yellow-500 font-bold">需要人工報價 / 安全座椅 / 多點加停</div>
          </a>
        </div>
        <div className="flex justify-center w-full py-4">
          <button onClick={() => window.history.back()} className="px-10 py-3 rounded-full text-white font-black text-lg border border-white/10 bg-zinc-900/50 hover:bg-yellow-500 hover:text-black transition-all">回上一頁</button>
        </div>
      </Layout>
    );

  // ═══════════════════════════════════════════════════
  // 頁面：填寫表單
  // ═══════════════════════════════════════════════════
  if (page === 'form') {
    const isBoth = mode === 'both';
    const isPickupStep = (isBoth && bothStep === 2) || mode === 'pickup';
    const currentForm = isPickupStep ? pickupForm : dropoffForm;
    const setForm = isPickupStep ? setPickupForm : setDropoffForm;
    const currentMode = isPickupStep ? 'pickup' : 'dropoff';

    const handleNextStep = () => {
      const errs = validateForm(dropoffForm, 'dropoff');
      if (Object.keys(errs).length > 0) { setErrors(errs); return; }
      setErrors({});
      setPickupForm((prev) => ({
        ...prev,
        name: prev.name || dropoffForm.name,
        phone: prev.phone || dropoffForm.phone,
      }));
      setBothStep(2);
      window.scrollTo(0, 0);
    };

    return (
      <Layout>
        <div className="mt-4 space-y-6 pb-24 px-2">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl space-y-10 text-white">
            <h2 className="text-3xl font-black italic text-yellow-500 text-center uppercase underline underline-offset-8 decoration-zinc-800">
              {isBoth ? (bothStep === 1 ? '第一步：送機詳情' : '第二步：接機詳情') : (currentMode === 'pickup' ? '接機預約詳情' : '送機預約詳情')}
            </h2>

            <div className="space-y-6 text-left">
              <div>
                <input value={currentForm.name} onChange={(e) => { setForm({ ...currentForm, name: e.target.value }); setErrors((p) => ({ ...p, name: '' })); }} type="text" placeholder="聯絡人姓名" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
                <FieldError message={errors.name} />
              </div>

              <div>
                <input value={currentForm.phone} onChange={(e) => { const raw = e.target.value.replace(/[^\d]/g, '').slice(0, 10); setForm({ ...currentForm, phone: raw }); setErrors((p) => ({ ...p, phone: '' })); }} type="tel" inputMode="numeric" placeholder="聯絡電話（09 開頭）" maxLength={10} className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
                <FieldError message={errors.phone} />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-bold ml-5">{currentMode === 'pickup' ? '抵達日期' : '出發日期'}</p>
                <input value={currentForm.date} onChange={(e) => { setForm({ ...currentForm, date: e.target.value }); setErrors((p) => ({ ...p, date: '' })); }} type="date" min={getTodayString()} className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
                <FieldError message={errors.date} />
              </div>

              <div>
                <input value={currentForm.flight} onChange={(e) => { setForm({ ...currentForm, flight: e.target.value.toUpperCase() }); setErrors((p) => ({ ...p, flight: '' })); }} type="text" placeholder="航班編號（例如: BR001）" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500 uppercase" />
                <FieldError message={errors.flight} />
              </div>

              {currentMode === 'dropoff' && (
                <div className="space-y-1">
                  <p className="text-sm font-bold ml-5">上車時間</p>
                  <input value={currentForm.time} onChange={(e) => { setForm({ ...currentForm, time: e.target.value }); setErrors((p) => ({ ...p, time: '' })); }} type="time" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
                  <FieldError message={errors.time} />
                </div>
              )}

              <div>
                <input value={currentForm.address} onChange={(e) => { setForm({ ...currentForm, address: e.target.value }); setErrors((p) => ({ ...p, address: '' })); }} type="text" placeholder={currentMode === 'pickup' ? '下車詳細地址' : '上車詳細地址'} className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
                <FieldError message={errors.address} />
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
              {isBoth && bothStep === 1 ? (
                <button onClick={handleNextStep} className="w-full bg-yellow-500 text-black py-6 rounded-[24px] font-black text-xl hover:bg-yellow-400 active:scale-95 transition-all">下一步：填寫接機資訊</button>
              ) : (
                <button onClick={handleGoToConfirm} className="w-full bg-yellow-500 text-black py-6 rounded-[24px] font-black text-xl hover:bg-yellow-400 active:scale-95 transition-all">確認明細</button>
              )}
            </div>
          </div>

          <div className="flex justify-center w-full py-4">
            <button onClick={() => { if (isBoth && bothStep === 2) { setBothStep(1); setErrors({}); } else { window.history.back(); } }} className="px-10 py-3 rounded-full text-white font-black text-lg border border-white/10 bg-zinc-900/50 hover:bg-yellow-500 hover:text-black transition-all italic">回上一頁</button>
          </div>
        </div>
      </Layout>
    );
  }

  // ═══════════════════════════════════════════════════
  // 頁面：確認明細
  // ═══════════════════════════════════════════════════
  if (page === 'confirm') {
    const SummaryRow = ({ label, value }) => (
      <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
        <span className="text-zinc-400 text-sm">{label}</span>
        <span className="font-bold">{value}</span>
      </div>
    );

    return (
      <Layout>
        <div className="mt-4 space-y-4 pb-24 px-2">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl text-white">
            <h2 className="text-2xl font-black italic text-yellow-500 text-center uppercase mb-8">請確認預約明細</h2>

            {(mode === 'dropoff' || mode === 'both') && (
              <div className="mb-6">
                {mode === 'both' && <p className="text-yellow-500 font-black text-sm mb-3 uppercase">送機</p>}
                <SummaryRow label="聯絡人" value={dropoffForm.name} />
                <SummaryRow label="電話" value={dropoffForm.phone} />
                <SummaryRow label="日期" value={dropoffForm.date} />
                <SummaryRow label="航班" value={dropoffForm.flight} />
                <SummaryRow label="上車時間" value={dropoffForm.time} />
                <SummaryRow label="上車地址" value={dropoffForm.address} />
                <SummaryRow label="車型" value={getCarLabel(carType)} />
                <SummaryRow label="車資" value={`$${dropoffBase}`} />
              </div>
            )}

            {(mode === 'pickup' || mode === 'both') && (
              <div className="mb-6">
                {mode === 'both' && <p className="text-yellow-500 font-black text-sm mb-3 uppercase mt-6 pt-6 border-t border-zinc-700">接機</p>}
                <SummaryRow label="聯絡人" value={pickupForm.name} />
                <SummaryRow label="電話" value={pickupForm.phone} />
                <SummaryRow label="日期" value={pickupForm.date} />
                <SummaryRow label="航班" value={pickupForm.flight} />
                <SummaryRow label="下車地址" value={pickupForm.address} />
                <SummaryRow label="車型" value={getCarLabel(carType)} />
                <SummaryRow label="車資" value={`$${pickupBase}`} />
              </div>
            )}

            <div className="mt-8 pt-6 border-t-2 border-yellow-500/30 text-center">
              <p className="text-zinc-400 text-sm font-bold mb-2">合計金額</p>
              <p className="text-5xl font-black italic text-yellow-500">${totalPrice}</p>
              {mode === 'both' && <p className="text-xs text-zinc-500 mt-2">(送機 ${dropoffBase} + 接機 ${pickupBase})</p>}
            </div>

            <div className="mt-8">
              <button disabled={isSubmitting} onClick={handleBooking} className={`w-full py-6 rounded-[24px] font-black text-xl shadow-xl transition-all ${isSubmitting ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-yellow-500 text-black hover:bg-yellow-400 active:scale-95'}`}>
                {isSubmitting ? '處理中...' : '確認預約'}
              </button>
            </div>
          </div>
          <div className="flex justify-center w-full py-4">
            <button onClick={() => window.history.back()} className="px-10 py-3 rounded-full text-white font-black text-lg border border-white/10 bg-zinc-900/50 hover:bg-yellow-500 hover:text-black transition-all italic">回上一頁修改</button>
          </div>
        </div>
      </Layout>
    );
  }

  // ═══════════════════════════════════════════════════
  // 頁面：付款
  // ═══════════════════════════════════════════════════
  if (page === 'payment') {
    const ccLink = getCreditCardLink();
    return (
      <Layout>
        <div className="mt-4 space-y-4 pb-24 px-2">
          <div className="w-full bg-zinc-900 border-2 border-yellow-500 p-8 rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-500 space-y-8 text-center text-white">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                <span className="text-green-400 text-3xl font-black">V</span>
              </div>
              <h3 className="text-xl font-black italic uppercase mt-2 text-yellow-500">預約已完成</h3>
              <p className="text-3xl font-black italic mt-2">${totalPrice} TWD</p>
              <p className="text-xs text-zinc-500 mt-1">訂單編號：{orderRef}</p>
              {orderCreatedAt && <Countdown createdAt={orderCreatedAt} />}
              <p className="text-xs text-zinc-500 mt-1">請於 2 小時內完成付款，逾時訂單將自動取消</p>
            </div>
            <div className="space-y-4">
              <button onClick={() => setPaidStep('transfer')} className={`w-full py-6 rounded-3xl font-black transition-all ${paidStep === 'transfer' ? 'bg-yellow-500 text-black shadow-xl' : 'bg-black text-zinc-400'}`}>銀行轉帳</button>
              {paidStep === 'transfer' && (
                <div className="bg-black/40 p-6 rounded-3xl border border-yellow-500/20 space-y-4">
                  <div className="flex justify-between items-center"><span className="text-zinc-400 text-sm">銀行</span><span className="font-bold">渣打銀行</span></div>
                  <div className="flex justify-between items-center"><span className="text-zinc-400 text-sm">銀行代號</span><span className="font-bold">052</span></div>
                  <div className="flex justify-between items-center"><span className="text-zinc-400 text-sm">帳號</span><div className="flex items-center gap-2"><span className="font-bold text-sm">12220000471580</span><button onClick={copyAccount} className="p-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 text-xs font-bold">{copied ? '已複製' : '複製'}</button></div></div>
                  <div className="flex justify-between items-center"><span className="text-zinc-400 text-sm">金額</span><span className="font-black text-yellow-500">${totalPrice}</span></div>
                </div>
              )}
              {ccLink ? (
                <button onClick={() => window.open(ccLink, '_blank')} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all">信用卡付款 (須加 3% 手續費)</button>
              ) : (
                <a href={`https://line.me/ti/p/~${LINE_ID_ID}`} target="_blank" rel="noopener noreferrer" className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6 rounded-3xl font-black text-lg shadow-xl text-center">刷卡請聯繫客服安排</a>
              )}
              <button onClick={handleDone} className="w-full bg-green-600 text-white py-6 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all">已付款，通知官方對帳</button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return null;
}
