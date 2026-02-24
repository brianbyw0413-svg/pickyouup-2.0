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

const generateOrderRef = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;\n  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
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
    <div className=\"absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none\"></div>
    <div className=\"w-full max-w-[480px] relative z-10\">{children}</div>
  </div>
);

const FieldError = ({ message }) =>
  message ? <div className=\"mt-1 text-red-400 text-sm font-bold\">{message}</div> : null;

const Countdown = ({ createdAt }) => {
  const [remaining, setRemaining] = useState('');
  useEffect(() => {\n    const deadline = createdAt + 2 * 60 * 60 * 1000;
    const tick = () => {\n      const diff = deadline - Date.now();
      if (diff <= 0) { setRemaining('已逾時'); return; }\n      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [createdAt]);
  return (\n    <p className={`text-sm font-bold ${remaining === '已逾時' ? 'text-red-400' : 'text-zinc-400'}`}>\n      付款時限：{remaining}\n    </p>\n  );
};

// ═══════════════════════════════════════════════════
// 主元件
// ═══════════════════════════════════════════════════

export default function App() {\n  const [page, setPage] = useState('home');
  const [carType, setCarType] = useState('');
  const [mode, setMode] = useState('');
  const [paidStep, setPaidStep] = useState('none');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bothStep, setBothStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderRef, setOrderRef] = useState('');
  const [orderCreatedAt, setOrderCreatedAt] = useState(null);\n\n  const [dropoffForm, setDropoffForm] = useState({ ...EMPTY_FORM });
  const [pickupForm, setPickupForm] = useState({ ...EMPTY_FORM });

  // ── LIFF 初始化 ──
  useEffect(() => {\n    liff.init({ liffId: LIFF_ID })\n      .then(() => {\n        if (liff.isLoggedIn()) {\n          liff.getProfile().then(profile => {\n            setDropoffForm(prev => ({ ...prev, name: profile.displayName }));\n            setPickupForm(prev => ({ ...prev, name: profile.displayName }));\n          });\n        }\n      })\n      .catch(err => console.error('LIFF Init error', err));\n  }, []);

  // ── 導覽 ──\n  useEffect(() => {\n    const handlePopState = (e) => setPage(e.state?.page || 'home');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);\n  }, []);

  const navigateTo = (nextPage) => {\n    window.history.pushState({ page: nextPage }, '', '');
    setPage(nextPage);
    setErrors({});
    window.scrollTo(0, 0);\n  };

  // ── 價格計算 ──\n  const dropoffBase = BASE_PRICING[`${carType}-dropoff`] || 0;
  const pickupBase = BASE_PRICING[`${carType}-pickup`] || 0;

  const calcTotal = () => {\n    if (mode === 'dropoff') return dropoffBase;\n    if (mode === 'pickup') return pickupBase;\n    if (mode === 'both') return dropoffBase + pickupBase;\n    return 0;\n  };\n\n  const totalPrice = calcTotal();

  // ── 表單驗證 ──\n  const validateForm = (form, formMode) => {\n    const errs = {};
    if (!form.name.trim()) errs.name = '請輸入聯絡人姓名';\n    if (!form.phone.trim()) errs.phone = '請輸入聯絡電話';\n    else if (!isValidPhone(form.phone)) errs.phone = '請輸入正確的手機號碼（09 開頭，共 10 碼）';
    if (!form.date) errs.date = '請選擇日期';\n    else if (form.date < getTodayString()) errs.date = '日期不可選擇過去的日期';\n    if (!form.flight.trim()) errs.flight = '請輸入航班編號';\n    if (!form.address.trim()) errs.address = formMode === 'pickup' ? '請輸入下車詳細地址' : '請輸入上車詳細地址';
    if (formMode === 'dropoff' && !form.time) errs.time = '請選擇上車時間';\n    return errs;\n  };\n\n  const resetAll = () => {\n    setDropoffForm({ ...EMPTY_FORM });\n    setPickupForm({ ...EMPTY_FORM });\n    setPaidStep('none');\n    setBothStep(1);\n    setCopied(false);\n    setErrors({});\n    setOrderRef('');\n    setOrderCreatedAt(null);\n  };\n\n  const copyAccount = async () => {\n    try {\n      await navigator.clipboard.writeText('12220000471580');
      setCopied(true);\n      setTimeout(() => setCopied(false), 2000);\n    } catch {\n      const ta = document.createElement('textarea');
      ta.value = '12220000471580';\n      document.body.appendChild(ta);\n      ta.select();\n      document.execCommand('copy');\n      document.body.removeChild(ta);\n      setCopied(true);\n      setTimeout(() => setCopied(false), 2000);\n    }\n  };\n\n  const handleGoToConfirm = () => {\n    if (mode === 'both') {\n      const dropErrs = validateForm(dropoffForm, 'dropoff');\n      const pickErrs = validateForm(pickupForm, 'pickup');
      if (Object.keys(dropErrs).length > 0 || Object.keys(pickErrs).length > 0) {\n        setErrors({ ...dropErrs, ...pickErrs });\n        return;\n      }\n    } else {\n      const form = mode === 'pickup' ? pickupForm : dropoffForm;\n      const errs = validateForm(form, mode);\n      if (Object.keys(errs).length > 0) { setErrors(errs); return; }\n    }\n    navigateTo('confirm');\n  };\n\n  // ── 提交訂單 (方案B：統一新欄位名) ──\n  const handleBooking = async () => {\n    setIsSubmitting(true);\n    const ref = generateOrderRef();\n    const orders = [];\n\n    if (mode === 'dropoff' || mode === 'both') {\n      orders.push({\n        order_ref: ref,\n        service_mode: 'dropoff',\n        car_type: carType,\n        contact_name: dropoffForm.name.trim(),\n        contact_phone: dropoffForm.phone.replace(/[-\s]/g, ''),\n        pickup_address: dropoffForm.address.trim(),\n        dropoff_address: '',\n        service_date: dropoffForm.date,\n        pickup_time: dropoffForm.time,\n        flight_number: dropoffForm.flight.trim().toUpperCase(),\n        amount: mode === 'both' ? dropoffBase : totalPrice,\n        total_amount: totalPrice,\n        status: 'pending',\n        payment_method: '',\n      });\n    }\n\n    if (mode === 'pickup' || mode === 'both') {\n      orders.push({\n        order_ref: ref,\n        service_mode: 'pickup',\n        car_type: carType,\n        contact_name: pickupForm.name.trim(),\n        contact_phone: pickupForm.phone.replace(/[-\s]/g, ''),\n        pickup_address: '',\n        dropoff_address: pickupForm.address.trim(),\n        service_date: pickupForm.date,\n        pickup_time: '',\n        flight_number: pickupForm.flight.trim().toUpperCase(),\n        amount: mode === 'both' ? pickupBase : totalPrice,\n        total_amount: totalPrice,\n        status: 'pending',\n        payment_method: '',\n      });\n    }\n\n    const { error } = await supabase.from('orders').insert(orders);\n    if (!error) {\n      setOrderRef(ref);\n      setOrderCreatedAt(Date.now());\n      setPaidStep('choice');\n      navigateTo('payment');\n    } else {\n      alert('預約暫時無法提交，請稍後再試。');\n      console.error('Supabase error:', error);\n    }\n    setIsSubmitting(false);\n  };\n\n  const handleDone = () => {\n    const mainForm = mode === 'pickup' ? pickupForm : dropoffForm;
    const summary = [\n      `【PickYouUP 付款回報】`,\n      `訂單編號：${orderRef}`,\n      `姓名：${mainForm.name}`,\n      `電話：${mainForm.phone}`,\n      `服務：${getModeLabel(mode)}`,\n      `車型：${getCarLabel(carType)}`,\n      `總計：$${totalPrice} 元`,\n      ``,\n      `您好，我已完成付款，請幫我確認。`,\n    ].join('\\n');\n\n    if (liff.isInClient()) {\n      liff.sendMessages([{ type: 'text', text: summary }])\n        .then(() => liff.closeWindow())\n        .catch(() => window.open(LINE_OA_URL + encodeURIComponent(summary), '_blank'));\n    } else {\n      window.open(LINE_OA_URL + encodeURIComponent(summary), '_blank');\n    }\n  };\n\n  const getCreditCardLink = () => CREDIT_CARD_LINKS[totalPrice] || null;\n\n  // ═══════════════════════════════════════════════════\n  // 頁面：首頁\n  // ═══════════════════════════════════════════════════\n  if (page === 'home')\n    return (\n      <Layout>\n        <nav className=\"w-full py-8 mb-12 flex justify-center border-b border-white/5\">\n          <h1 className=\"text-3xl font-black text-yellow-500 uppercase\">PICKYOUUP.TW</h1>\n        </nav>\n        <div className=\"w-full text-center space-y-6 animate-in fade-in duration-1000 uppercase font-black italic\">\n          <h2 className=\"text-[11vw] md:text-6xl mb-16 tracking-tighter\">\n            快速預約<br /><span className=\"text-yellow-500\">專業接送</span>\n          </h2>\n          <div className=\"space-y-4 px-2 not-italic\">\n            <button onClick={() => { setMode('dropoff'); navigateTo('choice'); }} className=\"w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl transition-all shadow-xl\">我要送機</button>\n            <button onClick={() => { setMode('pickup'); navigateTo('choice'); }} className=\"w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl transition-all shadow-xl\">我要接機</button>\n            <button onClick={() => { setMode('both'); navigateTo('choice'); }} className=\"w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl shadow-xl transition-all\">接送一併預訂</button>\n          </div>\n          <p className=\"text-[10px] text-yellow-500/40 tracking-[0.3em] mt-12 not-italic font-bold\">PREMIUM SERVICE SINCE 2026</p>\n        </div>\n      </Layout>\n    );\n\n  // ═══════════════════════════════════════════════════\n  // 頁面：選擇車型\n  // ═══════════════════════════════════════════════════\n  if (page === 'choice')\n    return (\n      <Layout>\n        <div className=\"mt-8 mb-6\">\n          <h2 className=\"text-3xl font-black italic text-yellow-500 text-center uppercase\">{getModeLabel(mode)}</h2>\n          <p className=\"text-center text-zinc-400 mt-2\">請選擇車型</p>\n        </div>\n        <div className=\"space-y-4\">\n          <button onClick={() => { setCarType('small'); navigateTo('form'); }} className=\"w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black transition-all group shadow-xl\">\n            <div className=\"text-xl font-black\">小車直達 (5人座)</div>\n            <div className=\"text-sm text-zinc-400 group-hover:text-black/70\">乘客1-4人 / 行利1-3件 / 直達無加點</div>\n          </button>\n          <button onClick={() => { setCarType('large'); navigateTo('form'); }} className=\"w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black transition-all group shadow-xl\">\n            <div className=\"text-xl font-black\">大車直達 (9人座)</div>\n            <div className=\"text-sm text-zinc-400 group-hover:text-black/70\">乘客1-8人 / 行利1-8件 / 直達無加點</div>\n          </button>\n          <a href={`https://line.me/ti/p/~${LINE_ID_ID}`} target=\"_blank\" rel=\"noopener noreferrer\" className=\"block w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[40px] text-center hover:bg-zinc-800 transition-all\">\n            <div className=\"text-zinc-400 text-sm\">我真的不確定...</div>\n            <div className=\"text-yellow-500 font-bold\">需要人工報價 / 安全座椅 / 多點加停</div>\n          </a>\n        </div>\n        <div className=\"flex justify-center w-full py-4\">\n          <button onClick={() => window.history.back()} className=\"px-10 py-3 rounded-full text-white font-black text-lg border border-white/10 bg-zinc-900/50 hover:bg-yellow-500 hover:text-black transition-all\">回上一頁</button>\n        </div>\n      </Layout>\n    );\n\n  // ═══════════════════════════════════════════════════\n  // 頁面：填寫表單\n  // ═══════════════════════════════════════════════════\n  if (page === 'form') {\n    const isBoth = mode === 'both';\n    const isPickupStep = (isBoth && bothStep === 2) || mode === 'pickup';\n    const currentForm = isPickupStep ? pickupForm : dropoffForm;\n    const setForm = isPickupStep ? setPickupForm : setDropoffForm;\n    const currentMode = isPickupStep ? 'pickup' : 'dropoff';\n\n    const handleNextStep = () => {\n      const errs = validateForm(dropoffForm, 'dropoff');\n      if (Object.keys(errs).length > 0) { setErrors(errs); return; }\n      setErrors({});\n      setPickupForm((prev) => ({\n        ...prev,\n        name: prev.name || dropoffForm.name,\n        phone: prev.phone || dropoffForm.phone,\n      }));\n      setBothStep(2);\n      window.scrollTo(0, 0);\n    };\n\n    return (\n      <Layout>\n        <div className=\"mt-4 space-y-6 pb-24 px-2\">\n          <div className=\"bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl space-y-10 text-white\">\n            <h2 className=\"text-3xl font-black italic text-yellow-500 text-center uppercase underline underline-offset-8 decoration-zinc-800\">\n              {isBoth ? (bothStep === 1 ? '第一步：送機詳情' : '第二步：接機詳情') : (currentMode === 'pickup' ? '接機預約詳情' : '送機預約詳情')}\n            </h2>\n\n            <div className=\"space-y-6 text-left\">\n              <div>\n                <input value={currentForm.name} onChange={(e) => { setForm({ ...currentForm, name: e.target.value }); setErrors((p) => ({ ...p, name: '' })); }} type=\"text\" placeholder=\"聯絡人姓名\" className=\"w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500\" />\n                <FieldError message={errors.name} />\n              </div>\n\n              <div>\n                <input value={currentForm.phone} onChange={(e) => { const raw = e.target.value.replace(/[^\\d]/g, '').slice(0, 10); setForm({ ...currentForm, phone: raw }); setErrors((p) => ({ ...p, phone: '' })); }} type=\"tel\" inputMode=\"numeric\" placeholder=\"聯絡電話（09 開頭）\" maxLength={10} className=\"w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500\" />\n                <FieldError message={errors.phone} />\n              </div>\n\n              <div className=\"space-y-1\">\n                <p className=\"text-sm font-bold ml-5\">{currentMode === 'pickup' ? '抵達日期' : '出發日期'}</p>\n                <input value={currentForm.date} onChange={(e) => { setForm({ ...currentForm, date: e.target.value }); setErrors((p) => ({ ...p, date: '' })); }} type=\"date\" min={getTodayString()} className=\"w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500\" />\n                <FieldError message={errors.date} />\n              </div>\n\n              <div>\n                <input value={currentForm.flight} onChange={(e) => { setForm({ ...currentForm, flight: e.target.value.toUpperCase() }); setErrors((p) => ({ ...p, flight: '' })); }} type=\"text\" placeholder=\"航班編號（例如: BR001）\" className=\"w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500 uppercase\" />\n                <FieldError message={errors.flight} />\n              </div>\n\n              {currentMode === 'dropoff' && (\n                <div className=\"space-y-1\">\n                  <p className=\"text-sm font-bold ml-5\">上車時間</p>\n                  <input value={currentForm.time} onChange={(e) => { setForm({ ...currentForm, time: e.target.value }); setErrors((p) => ({ ...p, time: '' })); }} type=\"time\" className=\"w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500\" />\n                  <FieldError message={errors.time} />\n                </div>\n              )}\n\n              <div>\n                <input value={currentForm.address} onChange={(e) => { setForm({ ...currentForm, address: e.target.value }); setErrors((p) => ({ ...p, address: '' })); }} type=\"text\" placeholder={currentMode === 'pickup' ? '下車詳細地址' : '上車詳細地址'} className=\"w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500\" />\n                <FieldError message={errors.address} />\n              </div>\n            </div>\n\n            <div className=\"mt-8 pt-8 border-t border-zinc-800 text-center\">\n              {isBoth && bothStep === 1 ? (\n                <button onClick={handleNextStep} className=\"w-full bg-yellow-500 text-black py-6 rounded-[24px] font-black text-xl hover:bg-yellow-400 active:scale-95 transition-all\">下一步：填寫接機資訊</button>\n              ) : (\n                <button onClick={handleGoToConfirm} className=\"w-full bg-yellow-500 text-black py-6 rounded-[24px] font-black text-xl hover:bg-yellow-400 active:scale-95 transition-all\">確認明細</button>\n              )}\n            </div>\n          </div>\n\n          <div className=\"flex justify-center w-full py-4\">\n            <button onClick={() => { if (isBoth && bothStep === 2) { setBothStep(1); setErrors({}); } else { window.history.back(); } }} className=\"px-10 py-3 rounded-full text-white font-black text-lg border border-white/10 bg-zinc-900/50 hover:bg-yellow-500 hover:text-black transition-all italic\">回上一頁</button>\n          </div>\n        </div>\n      </Layout>\n    );\n  }\n\n  // ═══════════════════════════════════════════════════\n  // 頁面：確認明細\n  // ═══════════════════════════════════════════════════\n  if (page === 'confirm') {\n    const SummaryRow = ({ label, value }) => (\n      <div className=\"flex justify-between items-center py-2 border-b border-zinc-800/50\">\n        <span className=\"text-zinc-400 text-sm\">{label}</span>\n        <span className=\"font-bold\">{value}</span>\n      </div>\n    );\n\n    return (\n      <Layout>\n        <div className=\"mt-4 space-y-4 pb-24 px-2\">\n          <div className=\"bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl text-white\">\n            <h2 className=\"text-2xl font-black italic text-yellow-500 text-center uppercase mb-8\">請確認預約明細</h2>\n\n            {(mode === 'dropoff' || mode === 'both') && (\n              <div className=\"mb-6\">\n                {mode === 'both' && <p className=\"text-yellow-500 font-black text-sm mb-3 uppercase\">送機</p>}\n                <SummaryRow label=\"聯絡人\" value={dropoffForm.name} />\n                <SummaryRow label=\"電話\" value={dropoffForm.phone} />\n                <SummaryRow label=\"日期\" value={dropoffForm.date} />\n                <SummaryRow label=\"航班\" value={dropoffForm.flight} />\n                <SummaryRow label=\"上車時間\" value={dropoffForm.time} />\n                <SummaryRow label=\"上車地址\" value={dropoffForm.address} />\n                <SummaryRow label=\"車型\" value={getCarLabel(carType)} />\n                <SummaryRow label=\"車資\" value={`$${dropoffBase}`} />\n              </div>\n            )}\n\n            {(mode === 'pickup' || mode === 'both') && (\n              <div className=\"mb-6\">\n                {mode === 'both' && <p className=\"text-yellow-500 font-black text-sm mb-3 uppercase mt-6 pt-6 border-t border-zinc-700\">接機</p>}\n                <SummaryRow label=\"聯絡人\" value={pickupForm.name} />\n                <SummaryRow label=\"電話\" value={pickupForm.phone} />\n                <SummaryRow label=\"日期\" value={pickupForm.date} />\n                <SummaryRow label=\"航班\" value={pickupForm.flight} />\n                <SummaryRow label=\"下車地址\" value={pickupForm.address} />\n                <SummaryRow label=\"車型\" value={getCarLabel(carType)} />\n                <SummaryRow label=\"車資\" value={`$${pickupBase}`} />\n              </div>\n            )}\n\n            <div className=\"mt-8 pt-6 border-t-2 border-yellow-500/30 text-center\">\n              <p className=\"text-zinc-400 text-sm font-bold mb-2\">合計金額</p>\n              <p className=\"text-5xl font-black italic text-yellow-500\">${totalPrice}</p>\n              {mode === 'both' && <p className=\"text-xs text-zinc-500 mt-2\">(送機 ${dropoffBase} + 接機 ${pickupBase})</p>}\n            </div>\n\n            <div className=\"mt-8\">\n              <button disabled={isSubmitting} onClick={handleBooking} className={`w-full py-6 rounded-[24px] font-black text-xl shadow-xl transition-all ${isSubmitting ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-yellow-500 text-black hover:bg-yellow-400 active:scale-95'}`}>\n                {isSubmitting ? '處理中...' : '確認預約'}\n              </button>\n            </div>\n          </div>\n          <div className=\"flex justify-center w-full py-4\">\n            <button onClick={() => window.history.back()} className=\"px-10 py-3 rounded-full text-white font-black text-lg border border-white/10 bg-zinc-900/50 hover:bg-yellow-500 hover:text-black transition-all italic\">回上一頁修改</button>\n          </div>\n        </div>\n      </Layout>\n    );\n  }\n\n  // ═══════════════════════════════════════════════════\n  // 頁面：付款\n  // ═══════════════════════════════════════════════════\n  if (page === 'payment') {\n    const ccLink = getCreditCardLink();\n    return (\n      <Layout>\n        <div className=\"mt-4 space-y-4 pb-24 px-2\">\n          <div className=\"w-full bg-zinc-900 border-2 border-yellow-500 p-8 rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-500 space-y-8 text-center text-white\">\n            <div className=\"flex flex-col items-center\">\n              <div className=\"w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-2\">\n                <span className=\"text-green-400 text-3xl font-black\">V</span>\n              </div>\n              <h3 className=\"text-xl font-black italic uppercase mt-2 text-yellow-500\">預約已完成</h3>\n              <p className=\"text-3xl font-black italic mt-2\">${totalPrice} TWD</p>\n              <p className=\"text-xs text-zinc-500 mt-1\">訂單編號：{orderRef}</p>\n              {orderCreatedAt && <Countdown createdAt={orderCreatedAt} />}\n              <p className=\"text-xs text-zinc-500 mt-1\">請於 2 小時內完成付款，逾時訂單將自動取消</p>\n            </div>\n            <div className=\"space-y-4\">\n              <button onClick={() => setPaidStep('transfer')} className={`w-full py-6 rounded-3xl font-black transition-all ${paidStep === 'transfer' ? 'bg-yellow-500 text-black shadow-xl' : 'bg-black text-zinc-400'}`}>銀行轉帳</button>\n              {paidStep === 'transfer' && (\n                <div className=\"bg-black/40 p-6 rounded-3xl border border-yellow-500/20 space-y-4\">\n                  <div className=\"flex justify-between items-center\"><span className=\"text-zinc-400 text-sm\">銀行</span><span className=\"font-bold\">渣打銀行</span></div>\n                  <div className=\"flex justify-between items-center\"><span className=\"text-zinc-400 text-sm\">銀行代號</span><span className=\"font-bold\">052</span></div>\n                  <div className=\"flex justify-between items-center\"><span className=\"text-zinc-400 text-sm\">帳號</span><div className=\"flex items-center gap-2\"><span className=\"font-bold text-sm\">12220000471580</span><button onClick={copyAccount} className=\"p-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 text-xs font-bold\">{copied ? '已複製' : '複製'}</button></div></div>\n                  <div className=\"flex justify-between items-center\"><span className=\"text-zinc-400 text-sm\">金額</span><span className=\"font-black text-yellow-500\">${totalPrice}</span></div>\n                </div>\n              )}\n              {ccLink ? (\n                <button onClick={() => window.open(ccLink, '_blank')} className=\"w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all\">信用卡付款 (須加 3% 手續費)</button>\n              ) : (\n                <a href={`https://line.me/ti/p/~${LINE_ID_ID}`} target=\"_blank\" rel=\"noopener noreferrer\" className=\"block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6 rounded-3xl font-black text-lg shadow-xl text-center\">刷卡請聯繫客服安排</a>\n              )}\n              <button onClick={handleDone} className=\"w-full bg-green-600 text-white py-6 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all\">已付款，通知官方對帳</button>\n            </div>\n          </div>\n        </div>\n      </Layout>\n    );\n  }\n\n  return null;\n}\n