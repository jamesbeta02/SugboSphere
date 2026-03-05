import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, MessageSquare, Users, MapPin,
  X, Trash2, Eye, RefreshCw, LogOut, ChevronDown, ChevronUp,
  Save, Search, Download, CheckCircle, Clock, Megaphone,
  Star, Bell, UserX, UserCheck, AlertTriangle,
  Upload, Image as ImageIcon
} from 'lucide-react';
import {
  collection, getDocs, deleteDoc, doc,
  addDoc, updateDoc, serverTimestamp, orderBy, query, setDoc
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// ✅ NO Firebase Storage — images stored as base64 in Firestore (Spark plan compatible)

const TABS = [
  { id: 'dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'feedbacks',     label: 'Feedbacks',     icon: MessageSquare   },
  { id: 'users',         label: 'Users',         icon: Users           },
  { id: 'heritage',      label: 'Heritage',      icon: MapPin          },
  { id: 'announcements', label: 'Announcements', icon: Megaphone       },
];

const CATEGORY_COLORS = {
  'Bug Report':    { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  'Suggestion':    { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  'Content Issue': { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  'General':       { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  'Site Rating':   { bg: '#fefce8', color: '#ca8a04', border: '#fde68a' },
};

const ANN_TYPES = {
  info:    { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe', label: '🔵 Info'    },
  warning: { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa', label: '🟠 Warning' },
  success: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', label: '🟢 Success' },
  urgent:  { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', label: '🔴 Urgent'  },
};

const HERITAGE_CATEGORIES = ['Historical Heritage', 'Cultural Heritage', 'Natural Heritage'];

// ── Compress image then encode to base64 (no Firebase Storage needed) ──────
const processImageToBase64 = (file, maxWidth = 1000, quality = 0.78) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const blobUrl = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(blobUrl);
      canvas.toBlob(blob => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result); // "data:image/jpeg;base64,..."
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }, 'image/jpeg', quality);
    };
    img.onerror = reject;
    img.src = blobUrl;
  });

// ── Bar chart ────────────────────────────────────────────────────────────────
function BarChart({ data, color = '#3b82f6', height = 80 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '100%', borderRadius: '4px 4px 0 0', background: color, opacity: 0.85, height: `${(d.value / max) * height}px`, transition: 'height 0.4s ease', minHeight: d.value > 0 ? '4px' : '0' }} />
          <span style={{ fontSize: '0.65rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Donut chart ──────────────────────────────────────────────────────────────
function DonutChart({ segments, size = 100 }) {
  const r = 35, cx = 50, cy = 50, circ = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth="14" />
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const el = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth="14" strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset} style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />;
        offset += dash; return el;
      })}
      <text x="50" y="54" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e3a5f">{total}</text>
    </svg>
  );
}

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', flex: 1, minWidth: '140px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>{label}</span>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={17} color={color} />
        </div>
      </div>
      <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1e3a5f', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '4px' }}>{sub}</div>}
    </div>
  );
}

// ── Map coordinate preview ───────────────────────────────────────────────────
function CoordinatePreview({ lat, lng }) {
  if (!lat || !lng || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) return null;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(lng) - 0.01},${parseFloat(lat) - 0.01},${parseFloat(lng) + 0.01},${parseFloat(lat) + 0.01}&layer=mapnik&marker=${lat},${lng}`;
  return (
    <div style={{ marginBottom: '12px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #d1d5db' }}>
      <div style={{ padding: '6px 10px', background: '#f0fdf4', borderBottom: '1px solid #d1d5db', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <MapPin size={13} color="#16a34a" />
        <span style={{ fontSize: '0.76rem', color: '#166534', fontWeight: '600' }}>Map Preview — {parseFloat(lat).toFixed(5)}, {parseFloat(lng).toFixed(5)}</span>
      </div>
      <iframe src={mapUrl} title="Location Preview" style={{ width: '100%', height: '160px', border: 'none', display: 'block' }} loading="lazy" />
    </div>
  );
}

// ── Image uploader (base64 — no Firebase Storage) ───────────────────────────
function ImageUploader({ currentImageUrl, onImageChange, label = 'Site Image', processing }) {
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = file => {
    if (!file || !file.type.startsWith('image/')) { alert('Please select a valid image file (JPG, PNG, WebP).'); return; }
    if (file.size > 10 * 1024 * 1024) { alert('Image must be smaller than 10 MB.'); return; }
    onImageChange(file, URL.createObjectURL(file));
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>{label}</label>
      {currentImageUrl ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src={currentImageUrl} alt="Preview" style={{ width: '180px', height: '120px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #e5e7eb', display: 'block', opacity: processing ? 0.5 : 1 }} />
          {processing && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.7)', borderRadius: '10px' }}>
              <RefreshCw size={22} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          )}
          {!processing && <>
            <button type="button" onClick={() => { onImageChange(null, ''); if (fileRef.current) fileRef.current.value = ''; }} style={{ position: 'absolute', top: '-8px', right: '-8px', width: '22px', height: '22px', borderRadius: '50%', background: '#ef4444', border: '2px solid white', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
              <X size={11} />
            </button>
            <button type="button" onClick={() => fileRef.current?.click()} style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '7px', padding: '5px 10px', fontSize: '0.76rem', color: '#374151', cursor: 'pointer' }}>
              <Upload size={12} /> Change Image
            </button>
          </>}
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          style={{ border: `2px dashed ${dragging ? '#3b82f6' : '#d1d5db'}`, borderRadius: '12px', padding: '28px 20px', textAlign: 'center', cursor: 'pointer', background: dragging ? '#eff6ff' : '#fafafa', transition: 'all 0.2s ease' }}
        >
          <ImageIcon size={28} color={dragging ? '#3b82f6' : '#9ca3af'} style={{ marginBottom: '8px' }} />
          <p style={{ margin: '0 0 4px', fontSize: '0.85rem', fontWeight: '600', color: dragging ? '#3b82f6' : '#374151' }}>{dragging ? 'Drop image here' : 'Click or drag & drop image'}</p>
          <p style={{ margin: 0, fontSize: '0.73rem', color: '#9ca3af' }}>JPG, PNG, WebP — max 10MB · Auto-compressed ✓</p>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
    </div>
  );
}

// ── Main AdminPanel ──────────────────────────────────────────────────────────
function AdminPanel({ onClose }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab]             = useState('dashboard');
  const [feedbacks, setFeedbacks]             = useState([]);
  const [users, setUsers]                     = useState([]);
  const [heritage, setHeritage]               = useState([]);
  const [announcements, setAnnouncements]     = useState([]);
  const [siteRatings, setSiteRatings]         = useState([]); // from siteRatings collection
  const [loading, setLoading]                 = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [fbSearch, setFbSearch]               = useState('');
  const [fbCategory, setFbCategory]           = useState('All');
  const [fbStatus, setFbStatus]               = useState('All');
  const [fbView, setFbView]                   = useState('list'); // 'list' | 'bySite'
  const [userSearch, setUserSearch]           = useState('');

  const EMPTY_FORM = {
    name: '', category: '', location: '', description: '',
    imageUrl: '', imageFile: null,
    lat: '', lng: '',
    heritageStatus: '', era: '', region: '', established: '', builtBy: '',
    overview: '', culturalSignificance: '', architectureOrBio: '', currentStatus: '',
    visitorInfo: '', transportationFee: '',
    culturalPractices: '', nativeFloraFauna: '', preservation: '', highlights: '',
  };

  const [heritageForm, setHeritageForm]       = useState(EMPTY_FORM);
  const [editingId, setEditingId]             = useState(null);
  const [savingHeritage, setSavingHeritage]   = useState(false);
  const [processingImg, setProcessingImg]     = useState(false);
  const [showAdvanced, setShowAdvanced]       = useState(false);
  const [annForm, setAnnForm]                 = useState({ title: '', body: '', type: 'info' });
  const [savingAnn, setSavingAnn]             = useState(false);

  // ── Fetch all data ──
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [fbSnap, uSnap, hSnap, aSnap, srSnap] = await Promise.all([
        getDocs(query(collection(db, 'feedbacks'),     orderBy('createdAt', 'desc'))),
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'heritage')),
        getDocs(query(collection(db, 'announcements'), orderBy('createdAt', 'desc'))),
        getDocs(collection(db, 'siteRatings')),
      ]);
      setFeedbacks(fbSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setUsers(uSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setHeritage(hSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setAnnouncements(aSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setSiteRatings(srSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error('Fetch error:', e); }
    setLoading(false);
  };
  useEffect(() => { fetchAll(); }, []);

  // ── Sign out handler ──
  const handleSignOut = async () => {
    await signOut(auth);
    onClose();
    navigate('/');
  };

  // ── Feedbacks ──
  const deleteFeedback = async id => {
    if (!window.confirm('Delete this feedback?')) return;
    await deleteDoc(doc(db, 'feedbacks', id));
    setFeedbacks(p => p.filter(f => f.id !== id));
  };
  const toggleResolved = async fb => {
    const next = fb.status === 'resolved' ? 'pending' : 'resolved';
    await updateDoc(doc(db, 'feedbacks', fb.id), { status: next });
    setFeedbacks(p => p.map(f => f.id === fb.id ? { ...f, status: next } : f));
  };
  const exportCSV = () => {
    const h = ['Name', 'Email', 'Category', 'Rating', 'Message', 'Status', 'Date'];
    const r = feedbacks.map(f => [`"${f.name || ''}"`, `"${f.email || ''}"`, `"${f.category || ''}"`, f.rating || 0, `"${(f.message || '').replace(/"/g, '""')}"`, f.status || 'pending', f.createdAt?.toDate ? f.createdAt.toDate().toLocaleDateString() : '']);
    const csv = [h, ...r].map(x => x.join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'feedbacks.csv'; a.click();
  };

  // ── Users ──
  const toggleBan = async u => {
    const b = !u.banned;
    if (!window.confirm(`${b ? 'Ban' : 'Unban'} ${u.name || u.email}?`)) return;
    try { await setDoc(doc(db, 'users', u.id), { ...u, banned: b }, { merge: true }); setUsers(p => p.map(x => x.id === u.id ? { ...x, banned: b } : x)); }
    catch (e) { alert('Failed. Check Firestore rules.'); }
  };
  const deleteUser = async u => {
    if (!window.confirm(`Remove ${u.name || u.email}'s record?`)) return;
    await deleteDoc(doc(db, 'users', u.id)); setUsers(p => p.filter(x => x.id !== u.id));
  };

  // ── Heritage helpers ──
  const setForm = (k, v) => setHeritageForm(p => ({ ...p, [k]: v }));
  const resetForm = () => { setHeritageForm(EMPTY_FORM); setShowAdvanced(false); };

  const buildPayload = (form, imgUrl) => {
    const toArr = s => s ? s.split('\n').map(x => x.trim()).filter(Boolean) : [];
    return {
      name: form.name.trim(), category: form.category, location: form.location.trim(),
      description: form.description.trim(), imageUrl: imgUrl,
      lat: parseFloat(form.lat) || null, lng: parseFloat(form.lng) || null,
      heritageStatus: form.heritageStatus.trim(), era: form.era.trim(),
      region: form.region.trim(), established: form.established.trim(), builtBy: form.builtBy.trim(),
      detailedInfo: {
        overview: form.overview.trim(), culturalSignificance: form.culturalSignificance.trim(),
        architectureOrBio: form.architectureOrBio.trim(), currentStatus: form.currentStatus.trim(),
        visitorInfo: form.visitorInfo.trim(), transportationFee: form.transportationFee.trim(),
      },
      culturalPractices: toArr(form.culturalPractices), nativeFloraFauna: toArr(form.nativeFloraFauna),
      preservation: form.preservation.trim(), highlights: toArr(form.highlights),
      source: 'admin',
    };
  };

  // ── Save heritage — base64 image goes directly into Firestore ──
  const saveHeritage = async () => {
    const { name, category, location, lat, lng } = heritageForm;
    if (!name || !category || !location) { alert('Name, category, and location are required.'); return; }
    if (!lat || !lng || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) { alert('Valid latitude and longitude are required so the site appears on the map.'); return; }

    setSavingHeritage(true);
    try {
      // Convert image to base64 if a new file was chosen
      let finalImageUrl = heritageForm.imageUrl;
      if (heritageForm.imageFile) {
        setProcessingImg(true);
        finalImageUrl = await processImageToBase64(heritageForm.imageFile);
        setProcessingImg(false);
      }

      const payload = buildPayload(heritageForm, finalImageUrl);

      if (editingId) {
        await updateDoc(doc(db, 'heritage', editingId), { ...payload, updatedAt: serverTimestamp() });
        setHeritage(p => p.map(h => h.id === editingId ? { id: editingId, ...payload } : h));
        setEditingId(null);
      } else {
        const ref = await addDoc(collection(db, 'heritage'), { ...payload, createdAt: serverTimestamp() });
        setHeritage(p => [...p, { id: ref.id, ...payload }]);
      }
      resetForm();
    } catch (e) {
      console.error(e);
      setProcessingImg(false);
      alert('Failed to save: ' + e.message);
    }
    setSavingHeritage(false);
  };

  const deleteHeritage = async id => {
    if (!window.confirm('Delete this heritage entry?')) return;
    await deleteDoc(doc(db, 'heritage', id)); setHeritage(p => p.filter(h => h.id !== id));
  };

  const startEdit = h => {
    const fromArr = a => Array.isArray(a) ? a.join('\n') : (a || '');
    setEditingId(h.id);
    setHeritageForm({
      name: h.name || '', category: h.category || '', location: h.location || '',
      description: h.description || '', imageUrl: h.imageUrl || '', imageFile: null,
      lat: h.lat != null ? String(h.lat) : '', lng: h.lng != null ? String(h.lng) : '',
      heritageStatus: h.heritageStatus || '', era: h.era || '', region: h.region || '',
      established: h.established || '', builtBy: h.builtBy || '',
      overview: h.detailedInfo?.overview || '', culturalSignificance: h.detailedInfo?.culturalSignificance || '',
      architectureOrBio: h.detailedInfo?.architectureOrBio || '', currentStatus: h.detailedInfo?.currentStatus || '',
      visitorInfo: h.detailedInfo?.visitorInfo || '', transportationFee: h.detailedInfo?.transportationFee || '',
      culturalPractices: fromArr(h.culturalPractices), nativeFloraFauna: fromArr(h.nativeFloraFauna),
      preservation: h.preservation || '', highlights: fromArr(h.highlights),
    });
    setShowAdvanced(true);
    setTimeout(() => document.getElementById('heritage-form-top')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  // ── Announcements ──
  const saveAnnouncement = async () => {
    if (!annForm.title || !annForm.body) { alert('Title and message are required.'); return; }
    setSavingAnn(true);
    try {
      const ref = await addDoc(collection(db, 'announcements'), { ...annForm, createdAt: serverTimestamp() });
      setAnnouncements(p => [{ id: ref.id, ...annForm }, ...p]);
      setAnnForm({ title: '', body: '', type: 'info' });
    } catch (e) { alert('Failed. Check Firestore rules.'); }
    setSavingAnn(false);
  };
  const deleteAnnouncement = async id => {
    if (!window.confirm('Delete this announcement?')) return;
    await deleteDoc(doc(db, 'announcements', id)); setAnnouncements(p => p.filter(a => a.id !== id));
  };

  // ── Derived stats ──
  const avgRating   = feedbacks.length ? (feedbacks.reduce((s, f) => s + (f.rating || 0), 0) / feedbacks.length).toFixed(1) : '—';
  const resolved    = feedbacks.filter(f => f.status === 'resolved').length;
  const pending     = feedbacks.length - resolved;
  const bannedCount = users.filter(u => u.banned).length;
  const ratingDist  = [1, 2, 3, 4, 5].map(r => ({ label: `${r}★`, value: feedbacks.filter(f => f.rating === r).length }));
  const catDist     = Object.keys(CATEGORY_COLORS).map(c => ({ label: c, value: feedbacks.filter(f => f.category === c).length, color: CATEGORY_COLORS[c].color }));

  // ── Per-site rating aggregation from siteRatings collection ──
  const siteRatingMap = {};
  siteRatings.forEach(r => {
    const n = r.siteName;
    if (!n) return;
    if (!siteRatingMap[n]) siteRatingMap[n] = { total: 0, count: 0, category: r.category || '' };
    siteRatingMap[n].total += r.rating || 0;
    siteRatingMap[n].count += 1;
  });
  const siteStats = Object.entries(siteRatingMap)
    .map(([name, { total, count, category }]) => ({
      name, count, category,
      avg: parseFloat((total / count).toFixed(2)),
    }))
    .sort((a, b) => b.avg - a.avg);

  const topSites    = siteStats.slice(0, 5);
  const bottomSites = [...siteStats].sort((a, b) => a.avg - b.avg).slice(0, 5);
  const totalSiteRatings = siteRatings.length;

  // health colour helper: green ≥4, yellow ≥3, red <3
  const healthColor = avg => avg >= 4 ? '#10b981' : avg >= 3 ? '#f59e0b' : '#ef4444';
  const healthLabel = avg => avg >= 4 ? '😊 Good'  : avg >= 3 ? '😐 Okay' : '😟 Poor';
  const healthBg    = avg => avg >= 4 ? '#d1fae5'  : avg >= 3 ? '#fef3c7' : '#fef2f2';
  const healthBorder= avg => avg >= 4 ? '#6ee7b7'  : avg >= 3 ? '#fde68a' : '#fecaca';

  const filteredFeedbacks = feedbacks.filter(f => {
    const s = fbSearch.toLowerCase();
    return (!s || [f.name, f.email, f.message, f.category].some(v => v?.toLowerCase().includes(s)))
      && (fbCategory === 'All' || f.category === fbCategory)
      && (fbStatus === 'All' || (f.status || 'pending') === fbStatus);
  });
  const filteredUsers = users.filter(u => { const s = userSearch.toLowerCase(); return !s || [u.name, u.email].some(v => v?.toLowerCase().includes(s)); });

  const isBusy = savingHeritage || processingImg;

  // ── Shared styles ──
  const inp = { width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem', outline: 'none', color: '#111827', background: 'white', boxSizing: 'border-box', fontFamily: 'inherit' };
  const ta  = { ...inp, resize: 'vertical', lineHeight: '1.5', minHeight: '72px' };
  const secL = txt => (
    <div style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#9ca3af', margin: '16px 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />{txt}<div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 99998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
      <div style={{ background: '#f8fafc', borderRadius: '18px', width: '100%', maxWidth: '100%', height: 'calc(100vh - 20px)', display: 'flex', flexDirection: 'column', boxShadow: '0 40px 80px rgba(0,0,0,0.4)', overflow: 'hidden', animation: 'authSlideIn 0.3s ease' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#2c5282)', padding: '18px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h4 style={{ color: 'white', fontWeight: '700', margin: 0, fontSize: '1.05rem' }}>⚙️ Admin Panel</h4>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', margin: 0 }}>SugboSphere Management</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={fetchAll} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '10px', color: 'white', padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}><RefreshCw size={14} /> Refresh</button>
            <button onClick={handleSignOut} style={{ background: 'rgba(239,68,68,0.25)', border: 'none', borderRadius: '10px', color: 'white', padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}><LogOut size={14} /> Sign Out</button>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '10px', color: 'white', padding: '7px 10px', cursor: 'pointer' }}><X size={16} /></button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Sidebar */}
          <div style={{ width: '210px', background: '#1e2d4a', display: 'flex', flexDirection: 'column', padding: '20px 12px', gap: '4px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 10px 4px' }}>Navigation</p>
            {TABS.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: active ? '600' : '400', fontSize: '0.88rem', background: active ? 'rgba(255,255,255,0.13)' : 'transparent', color: active ? 'white' : 'rgba(255,255,255,0.5)', transition: 'all 0.18s ease', whiteSpace: 'nowrap', textAlign: 'left', borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent' }}>
                  <tab.icon size={16} /><span style={{ flex: 1 }}>{tab.label}</span>
                  {tab.id === 'feedbacks' && pending > 0 && <span style={{ background: '#ef4444', color: 'white', borderRadius: '20px', fontSize: '0.62rem', fontWeight: '700', padding: '1px 7px' }}>{pending}</span>}
                  {tab.id === 'users' && bannedCount > 0 && <span style={{ background: '#f59e0b', color: 'white', borderRadius: '20px', fontSize: '0.62rem', fontWeight: '700', padding: '1px 7px' }}>{bannedCount}</span>}
                </button>
              );
            })}
          </div>

          {/* Main content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '30px 40px', background: '#f8fafc' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite' }} /><p style={{ marginTop: '12px' }}>Loading data...</p>
              </div>
            ) : (<>

              {/* ══ DASHBOARD ══ */}
              {activeTab === 'dashboard' && (
                <div>
                  <h5 style={{ color: '#1e3a5f', fontWeight: '700', marginBottom: '18px' }}>Overview</h5>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '22px' }}>
                    <StatCard label="Total Feedbacks" value={feedbacks.length} icon={MessageSquare} color="#3b82f6" sub="all time" />
                    <StatCard label="Avg. Rating"     value={avgRating}        icon={Star}          color="#f59e0b" sub="out of 5" />
                    <StatCard label="Pending"         value={pending}          icon={Clock}         color="#ef4444" sub="unresolved" />
                    <StatCard label="Resolved"        value={resolved}         icon={CheckCircle}   color="#10b981" sub="done" />
                    <StatCard label="Heritage Sites"  value={heritage.length}  icon={MapPin}        color="#8b5cf6" sub="in database" />
                    <StatCard label="Site Ratings"    value={totalSiteRatings} icon={Star}          color="#f97316" sub={`${siteStats.length} sites rated`} />
                    <StatCard label="Users"           value={users.length}     icon={Users}         color="#06b6d4" sub={`${bannedCount} banned`} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                      <h6 style={{ color: '#1e3a5f', fontWeight: '600', marginBottom: '16px', fontSize: '0.86rem' }}>⭐ Rating Distribution</h6>
                      <BarChart data={ratingDist} color="#f59e0b" height={80} />
                    </div>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                      <h6 style={{ color: '#1e3a5f', fontWeight: '600', marginBottom: '12px', fontSize: '0.86rem' }}>📊 Category Breakdown</h6>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <DonutChart segments={catDist} size={90} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {catDist.map(c => (
                            <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                              <div style={{ width: '9px', height: '9px', borderRadius: '3px', background: c.color, flexShrink: 0 }} />
                              <span style={{ fontSize: '0.76rem', color: '#374151' }}>{c.label}</span>
                              <span style={{ fontSize: '0.76rem', color: '#9ca3af', marginLeft: 'auto', paddingLeft: '8px' }}>{c.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <h6 style={{ color: '#374151', fontWeight: '600', marginBottom: '10px', fontSize: '0.86rem' }}>🕐 Recent Feedbacks</h6>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {feedbacks.slice(0, 5).map(f => {
                      const cat = CATEGORY_COLORS[f.category] || { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' };
                      const isR = f.status === 'resolved';
                      return (
                        <div key={f.id} style={{ background: 'white', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', opacity: isR ? 0.7 : 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontWeight: '600', color: '#1e3a5f', fontSize: '0.86rem' }}>{f.siteName || f.name}</span>
                            <span style={{ fontSize: '0.74rem', padding: '2px 8px', borderRadius: '20px', background: cat.bg, color: cat.color, border: `1px solid ${cat.border}` }}>{f.category}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>{'★'.repeat(f.rating || 0)}</span>
                            {isR ? <CheckCircle size={13} color="#10b981" /> : <Clock size={13} color="#f59e0b" />}
                          </div>
                        </div>
                      );
                    })}
                    {feedbacks.length === 0 && <p style={{ color: '#9ca3af', fontSize: '0.86rem' }}>No feedbacks yet.</p>}
                  </div>

                  {/* ── Site Health Summary ── */}
                  {siteStats.length > 0 && (
                    <div style={{ marginTop: '24px' }}>
                      <h6 style={{ color: '#374151', fontWeight: '600', marginBottom: '12px', fontSize: '0.86rem' }}>🏆 Site Ratings Health</h6>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        {/* Top rated */}
                        <div style={{ background: 'white', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                          <p style={{ margin: '0 0 10px', fontWeight: '700', fontSize: '0.82rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>🥇</span> Top Rated Sites
                          </p>
                          {topSites.map((s, i) => (
                            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: i < topSites.length - 1 ? '8px' : 0 }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#9ca3af', width: '16px' }}>{i + 1}.</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#1e3a5f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                                <div style={{ height: '4px', background: '#f3f4f6', borderRadius: '4px', marginTop: '3px', overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${(s.avg / 5) * 100}%`, background: healthColor(s.avg), borderRadius: '4px', transition: 'width 0.6s ease' }} />
                                </div>
                              </div>
                              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: healthColor(s.avg), background: healthBg(s.avg), padding: '2px 7px', borderRadius: '10px', border: `1px solid ${healthBorder(s.avg)}`, flexShrink: 0 }}>
                                {s.avg}★
                              </span>
                            </div>
                          ))}
                        </div>
                        {/* Needs attention */}
                        <div style={{ background: 'white', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                          <p style={{ margin: '0 0 10px', fontWeight: '700', fontSize: '0.82rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>⚠️</span> Needs Attention
                          </p>
                          {bottomSites.map((s, i) => (
                            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: i < bottomSites.length - 1 ? '8px' : 0 }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#9ca3af', width: '16px' }}>{i + 1}.</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#1e3a5f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                                <div style={{ height: '4px', background: '#f3f4f6', borderRadius: '4px', marginTop: '3px', overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${(s.avg / 5) * 100}%`, background: healthColor(s.avg), borderRadius: '4px' }} />
                                </div>
                              </div>
                              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: healthColor(s.avg), background: healthBg(s.avg), padding: '2px 7px', borderRadius: '10px', border: `1px solid ${healthBorder(s.avg)}`, flexShrink: 0 }}>
                                {s.avg}★
                              </span>
                            </div>
                          ))}
                          {bottomSites.length === 0 && <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: 0 }}>No ratings yet.</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'feedbacks' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <h5 style={{ color: '#1e3a5f', fontWeight: '700', margin: 0 }}>
                      Feedbacks <span style={{ fontSize: '0.8rem', fontWeight: '400', color: '#9ca3af' }}>({filteredFeedbacks.length}/{feedbacks.length})</span>
                    </h5>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {/* View toggle */}
                      <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '10px', padding: '3px', gap: '2px' }}>
                        {[['list','📋 List'], ['bySite','📍 By Site']].map(([v, label]) => (
                          <button key={v} onClick={() => setFbView(v)} style={{ padding: '5px 12px', borderRadius: '8px', border: 'none', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', background: fbView === v ? 'white' : 'transparent', color: fbView === v ? '#1e3a5f' : '#6b7280', boxShadow: fbView === v ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}>{label}</button>
                        ))}
                      </div>
                      <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', fontWeight: '600', fontSize: '0.82rem' }}><Download size={13} /> Export CSV</button>
                    </div>
                  </div>

                  {/* ── BY SITE VIEW ── */}
                  {fbView === 'bySite' && (
                    <div>
                      {/* Summary stat strip */}
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '10px', padding: '10px 16px', flex: 1, minWidth: '120px' }}>
                          <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '700', color: '#065f46', letterSpacing: '0.5px' }}>EXCELLENT (4–5★)</p>
                          <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#065f46' }}>{siteStats.filter(s => s.avg >= 4).length}</p>
                        </div>
                        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '10px', padding: '10px 16px', flex: 1, minWidth: '120px' }}>
                          <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '700', color: '#92400e', letterSpacing: '0.5px' }}>OKAY (3–4★)</p>
                          <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#92400e' }}>{siteStats.filter(s => s.avg >= 3 && s.avg < 4).length}</p>
                        </div>
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 16px', flex: 1, minWidth: '120px' }}>
                          <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '700', color: '#dc2626', letterSpacing: '0.5px' }}>POOR (&lt;3★)</p>
                          <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#dc2626' }}>{siteStats.filter(s => s.avg < 3).length}</p>
                        </div>
                        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '10px 16px', flex: 1, minWidth: '120px' }}>
                          <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '700', color: '#1e40af', letterSpacing: '0.5px' }}>TOTAL RATINGS</p>
                          <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#1e40af' }}>{totalSiteRatings}</p>
                        </div>
                      </div>

                      {/* Per-site cards */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {siteStats.length === 0 && (
                          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                            <Star size={28} style={{ marginBottom: '8px', opacity: 0.3 }} />
                            <p style={{ margin: 0, fontSize: '0.88rem' }}>No site ratings yet. Users can rate sites from the Destinations page.</p>
                          </div>
                        )}
                        {siteStats.map(site => {
                          const hc  = healthColor(site.avg);
                          const hbg = healthBg(site.avg);
                          const hbd = healthBorder(site.avg);
                          const hl  = healthLabel(site.avg);
                          const pct = Math.round((site.avg / 5) * 100);
                          return (
                            <div key={site.name} style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', border: `1.5px solid ${hbd}`, display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                              {/* Health pill */}
                              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: hbg, border: `2px solid ${hbd}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{site.avg >= 4 ? '😊' : site.avg >= 3 ? '😐' : '😟'}</span>
                                <span style={{ fontSize: '0.58rem', fontWeight: '700', color: hc, marginTop: '2px' }}>{hl.split(' ')[1]}</span>
                              </div>
                              {/* Name + bar */}
                              <div style={{ flex: 1, minWidth: '160px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                  <span style={{ fontWeight: '700', color: '#1e3a5f', fontSize: '0.9rem' }}>{site.name}</span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{site.count} rating{site.count !== 1 ? 's' : ''}</span>
                                    <span style={{ fontWeight: '800', fontSize: '0.95rem', color: hc }}>{site.avg}★</span>
                                  </div>
                                </div>
                                {/* Progress bar */}
                                <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '8px', overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${hc}, ${hc}aa)`, borderRadius: '8px', transition: 'width 0.6s ease' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                  <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>{site.category}</span>
                                  <span style={{ fontSize: '0.68rem', color: hc, fontWeight: '600' }}>{pct}% positive</span>
                                </div>
                              </div>
                              {/* Stars visual */}
                              <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                                {[1,2,3,4,5].map(s => (
                                  <span key={s} style={{ fontSize: '1.1rem', color: s <= Math.round(site.avg) ? '#f59e0b' : '#e5e7eb' }}>★</span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── LIST VIEW ── */}
                  {fbView === 'list' && (<>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
                      <Search size={13} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input value={fbSearch} onChange={e => setFbSearch(e.target.value)} placeholder="Search..." style={{ ...inp, paddingLeft: '30px' }} />
                    </div>
                    <select value={fbCategory} onChange={e => setFbCategory(e.target.value)} style={{ ...inp, width: 'auto', minWidth: '130px' }}>
                      <option value="All">All Categories</option>{Object.keys(CATEGORY_COLORS).map(c => <option key={c}>{c}</option>)}
                    </select>
                    <select value={fbStatus} onChange={e => setFbStatus(e.target.value)} style={{ ...inp, width: 'auto', minWidth: '110px' }}>
                      <option value="All">All Status</option><option value="pending">Pending</option><option value="resolved">Resolved</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredFeedbacks.map(f => {
                      const cat = CATEGORY_COLORS[f.category] || { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' };
                      const exp = expandedFeedback === f.id; const isR = f.status === 'resolved';
                      return (
                        <div key={f.id} style={{ background: 'white', borderRadius: '14px', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', overflow: 'hidden', opacity: isR ? 0.8 : 1, border: isR ? '1px solid #d1fae5' : '1px solid transparent' }}>
                          <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flex: 1, minWidth: 0, flexWrap: 'wrap' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isR ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '0.9rem', flexShrink: 0 }}>{(f.name || '?')[0].toUpperCase()}</div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: '600', color: '#1e3a5f', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  {f.name}
                                  {f.name === 'Guest' && <span style={{ fontSize: '0.65rem', background: '#f3f4f6', color: '#9ca3af', padding: '1px 5px', borderRadius: '6px' }}>not logged in</span>}
                                </div>
                                <div style={{ color: '#9ca3af', fontSize: '0.74rem' }}>
                                  {f.siteName ? `📍 ${f.siteName}` : f.email || '—'}
                                </div>
                              </div>
                              <span style={{ padding: '2px 9px', borderRadius: '20px', fontSize: '0.73rem', fontWeight: '500', background: cat.bg, color: cat.color, border: `1px solid ${cat.border}` }}>{f.category}</span>
                              <div style={{ display: 'flex', gap: '1px' }}>{[1, 2, 3, 4, 5].map(s => <span key={s} style={{ color: s <= (f.rating || 0) ? '#f59e0b' : '#e5e7eb', fontSize: '0.82rem' }}>★</span>)}</div>
                              <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600', background: isR ? '#d1fae5' : '#fef3c7', color: isR ? '#065f46' : '#92400e' }}>{isR ? '✓ Resolved' : '⏳ Pending'}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '5px', marginLeft: '8px' }}>
                              <button onClick={() => toggleResolved(f)} style={{ background: isR ? '#d1fae5' : '#f0fdf4', border: 'none', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: '#10b981', display: 'flex', alignItems: 'center' }}><CheckCircle size={13} /></button>
                              <button onClick={() => setExpandedFeedback(exp ? null : f.id)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }}>{exp ? <ChevronUp size={13} /> : <ChevronDown size={13} />}</button>
                              <button onClick={() => deleteFeedback(f.id)} style={{ background: '#fef2f2', border: 'none', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}><Trash2 size={13} /></button>
                            </div>
                          </div>
                          {exp && (
                            <div style={{ padding: '0 16px 13px', borderTop: '1px solid #f3f4f6' }}>
                              {f.email && <p style={{ color: '#6b7280', fontSize: '0.78rem', margin: '8px 0 4px' }}>✉️ {f.email}</p>}
                              <p style={{ color: '#374151', fontSize: '0.86rem', margin: '6px 0 5px', lineHeight: '1.6' }}>{f.message}</p>
                              {f.createdAt?.toDate && <p style={{ color: '#9ca3af', fontSize: '0.72rem', margin: 0 }}>Submitted: {f.createdAt.toDate().toLocaleString()}</p>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {filteredFeedbacks.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}><Search size={28} style={{ marginBottom: '8px', opacity: 0.3 }} /><p style={{ margin: 0, fontSize: '0.88rem' }}>No feedbacks match your filters.</p></div>}
                  </div>
                  </>)}
                </div>
              )}

              {/* ══ USERS ══ */}
              {activeTab === 'users' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                    <h5 style={{ color: '#1e3a5f', fontWeight: '700', margin: 0 }}>Users <span style={{ fontSize: '0.8rem', fontWeight: '400', color: '#9ca3af' }}>({filteredUsers.length})</span></h5>
                    {bannedCount > 0 && <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '20px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: '600' }}>⚠️ {bannedCount} banned</span>}
                  </div>
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '1px' }} />
                    <div style={{ fontSize: '0.8rem', color: '#92400e', lineHeight: '1.5' }}><strong>How banning works:</strong> Sets <code>banned: true</code> in Firestore. Add a ban check in <code>AuthModal.jsx</code> after login.</div>
                  </div>
                  <div style={{ position: 'relative', marginBottom: '14px' }}>
                    <Search size={13} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search by name or email..." style={{ ...inp, paddingLeft: '30px' }} />
                  </div>
                  {users.length === 0
                    ? <div style={{ background: 'white', borderRadius: '14px', padding: '40px', textAlign: 'center', color: '#9ca3af' }}><Users size={32} style={{ marginBottom: '10px', opacity: 0.3 }} /><p style={{ margin: 0 }}>No user records yet.</p></div>
                    : <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {filteredUsers.map((u, i) => {
                        const isBanned = u.banned === true;
                        return (
                          <div key={u.id} style={{ background: 'white', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', border: isBanned ? '1.5px solid #fecaca' : '1.5px solid transparent', opacity: isBanned ? 0.85 : 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                              <div style={{ width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0, background: isBanned ? '#fecaca' : `hsl(${i * 47 % 360},55%,58%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isBanned ? '#dc2626' : 'white', fontWeight: '700', fontSize: '1rem' }}>{isBanned ? <UserX size={18} /> : (u.name || u.email || '?')[0].toUpperCase()}</div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontWeight: '600', color: isBanned ? '#dc2626' : '#1e3a5f', fontSize: '0.88rem' }}>{u.name || '—'}</span>{isBanned && <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '20px', fontSize: '0.68rem', fontWeight: '700', padding: '1px 8px' }}>🚫 BANNED</span>}</div>
                                <div style={{ color: '#9ca3af', fontSize: '0.76rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email || u.id}</div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                              <button onClick={() => toggleBan(u)} style={{ background: isBanned ? '#f0fdf4' : '#fef2f2', border: 'none', borderRadius: '8px', padding: '7px 10px', cursor: 'pointer', color: isBanned ? '#16a34a' : '#dc2626', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: '600' }}>{isBanned ? <><UserCheck size={14} /> Unban</> : <><UserX size={14} /> Ban</>}</button>
                              <button onClick={() => deleteUser(u)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '7px 10px', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }}><Trash2 size={14} /></button>
                            </div>
                          </div>
                        );
                      })}
                      {filteredUsers.length === 0 && <div style={{ textAlign: 'center', padding: '30px', color: '#9ca3af', fontSize: '0.88rem' }}>No users match your search.</div>}
                    </div>
                  }
                </div>
              )}

              {/* ══ HERITAGE ══ */}
              {activeTab === 'heritage' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <h5 id="heritage-form-top" style={{ color: '#1e3a5f', fontWeight: '700', margin: 0 }}>Heritage Content <span style={{ fontSize: '0.82rem', fontWeight: '400', color: '#9ca3af' }}>({heritage.length})</span></h5>
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '6px 12px', fontSize: '0.76rem', color: '#1d4ed8', fontWeight: '600' }}>🗺️ Sites with coordinates appear on Explore & Destinations map</div>
                  </div>

                  {/* Form */}
                  <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                    <h6 style={{ color: '#1e3a5f', fontWeight: '600', marginBottom: '14px', fontSize: '0.9rem' }}>{editingId ? '✏️ Edit Heritage Site' : '➕ Add New Heritage Site'}</h6>

                    {secL('Required Info')}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                      <div><label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Site Name *</label><input value={heritageForm.name} onChange={e => setForm('name', e.target.value)} placeholder="e.g. Magellan's Cross" style={inp} /></div>
                      <div><label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Location *</label><input value={heritageForm.location} onChange={e => setForm('location', e.target.value)} placeholder="e.g. Cebu City, Cebu" style={inp} /></div>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Category *</label>
                      <select value={heritageForm.category} onChange={e => setForm('category', e.target.value)} style={{ ...inp, width: '50%' }}>
                        <option value="">Select category</option>{HERITAGE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Short Description</label>
                      <textarea value={heritageForm.description} onChange={e => setForm('description', e.target.value)} placeholder="Brief description shown on map popup..." rows={2} style={ta} />
                    </div>

                    {secL('Site Photo')}
                    <ImageUploader
                      currentImageUrl={heritageForm.imageUrl}
                      processing={processingImg}
                      onImageChange={(file, preview) => setHeritageForm(p => ({ ...p, imageFile: file, imageUrl: preview || '' }))}
                      label="Upload Site Image"
                    />

                    {secL('Map Coordinates (Required for map display)')}
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                        <div><label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#166534', marginBottom: '4px' }}>📍 Latitude *</label><input value={heritageForm.lat} onChange={e => setForm('lat', e.target.value)} placeholder="e.g. 10.2935" type="number" step="0.0001" style={{ ...inp, border: '1px solid #86efac' }} /></div>
                        <div><label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#166534', marginBottom: '4px' }}>📍 Longitude *</label><input value={heritageForm.lng} onChange={e => setForm('lng', e.target.value)} placeholder="e.g. 123.9019" type="number" step="0.0001" style={{ ...inp, border: '1px solid #86efac' }} /></div>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#166534', margin: 0 }}>💡 <strong>Tip:</strong> Find at <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" style={{ color: '#15803d' }}>Google Maps</a> — right-click any spot → copy coordinates.</p>
                    </div>
                    <CoordinatePreview lat={heritageForm.lat} lng={heritageForm.lng} />

                    <button onClick={() => setShowAdvanced(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid #d1d5db', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontSize: '0.82rem', color: '#374151', marginBottom: '12px' }}>
                      {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />} {showAdvanced ? 'Hide' : 'Show'} Full Site Details
                    </button>

                    {showAdvanced && (<>
                      {secL('Quick Facts')}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                        {[{ key: 'heritageStatus', label: 'Heritage Status', ph: 'e.g. National Historical Landmark' }, { key: 'era', label: 'Historical Era', ph: 'e.g. Spanish Colonial (1521)' }, { key: 'region', label: 'Region', ph: 'e.g. Central Visayas' }, { key: 'established', label: 'Established', ph: 'e.g. March 15, 1521' }, { key: 'builtBy', label: 'Built By', ph: 'e.g. Ferdinand Magellan' }].map(f => (
                          <div key={f.key}><label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>{f.label}</label><input value={heritageForm[f.key]} onChange={e => setForm(f.key, e.target.value)} placeholder={f.ph} style={inp} /></div>
                        ))}
                      </div>

                      {secL('Detailed Sections')}
                      {[{ key: 'overview', label: 'Overview', ph: 'Full overview of the site...' }, { key: 'culturalSignificance', label: 'Cultural Significance', ph: 'Why this site matters culturally...' }, { key: 'architectureOrBio', label: 'Architecture / Biodiversity', ph: 'Architectural details or natural features...' }, { key: 'currentStatus', label: 'Current Status', ph: 'Operational status, visiting conditions...' }].map(f => (
                        <div key={f.key} style={{ marginBottom: '10px' }}><label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>{f.label}</label><textarea value={heritageForm[f.key]} onChange={e => setForm(f.key, e.target.value)} placeholder={f.ph} rows={3} style={ta} /></div>
                      ))}

                      {secL('Visitor Info & Transportation')}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>🏠 Visitor Information</label>
                          <textarea value={heritageForm.visitorInfo} onChange={e => setForm('visitorInfo', e.target.value)} placeholder="Opening hours, entrance fees, tips..." rows={4} style={ta} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>🚌 Transportation & Getting There</label>
                          <textarea value={heritageForm.transportationFee} onChange={e => setForm('transportationFee', e.target.value)} placeholder={`e.g.\nJeepney from Carbon Market: ₱12\nTaxi from Cebu City: ₱150–200\nHabal-habal: ₱50 per person`} rows={4} style={{ ...ta, border: '1px solid #fbbf24', background: '#fffbeb' }} />
                          <p style={{ fontSize: '0.72rem', color: '#92400e', marginTop: '4px' }}>Include fares, modes of transport, and estimated travel time.</p>
                        </div>
                      </div>

                      {secL('Lists (one item per line)')}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                        {[{ key: 'culturalPractices', label: 'Cultural Practices', ph: 'Candle lighting\nPrayer offerings\n...' }, { key: 'nativeFloraFauna', label: 'Native Flora & Fauna', ph: 'Palm trees\nMaya sparrows\n...' }, { key: 'highlights', label: 'Highlights', ph: 'National Landmark\nFree Admission\n...' }].map(f => (
                          <div key={f.key}><label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>{f.label}</label><textarea value={heritageForm[f.key]} onChange={e => setForm(f.key, e.target.value)} placeholder={f.ph} rows={4} style={ta} /></div>
                        ))}
                      </div>
                      <div style={{ marginBottom: '12px' }}><label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>🏛️ Preservation</label><textarea value={heritageForm.preservation} onChange={e => setForm('preservation', e.target.value)} placeholder="Who manages and preserves this site..." rows={2} style={ta} /></div>
                    </>)}

                    {/* Save button */}
                    <div style={{ display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid #f0f0f0', alignItems: 'center' }}>
                      <button onClick={saveHeritage} disabled={isBusy} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: isBusy ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg,#1e3a5f,#2c5282)', color: 'white', fontWeight: '600', fontSize: '0.86rem', opacity: isBusy ? 0.7 : 1 }}>
                        {isBusy
                          ? <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> {processingImg ? 'Compressing image...' : 'Saving to Firestore...'}</>
                          : <><Save size={14} /> {editingId ? 'Update Site' : 'Save Site'}</>
                        }
                      </button>
                      {editingId && <button onClick={() => { setEditingId(null); resetForm(); }} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db', background: 'white', color: '#6b7280', cursor: 'pointer', fontSize: '0.86rem' }}>Cancel</button>}
                    </div>
                  </div>

                  {/* Heritage list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {heritage.map(h => {
                      const hasCoords = h.lat != null && h.lng != null;
                      return (
                        <div key={h.id} style={{ background: 'white', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', gap: '12px', border: hasCoords ? '1.5px solid #bbf7d0' : '1.5px solid #fde68a' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                            {h.imageUrl
                              ? <img src={h.imageUrl} alt={h.name} onError={e => e.target.style.display = 'none'} style={{ width: '60px', height: '46px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                              : <div style={{ width: '60px', height: '46px', borderRadius: '8px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ImageIcon size={18} color="#9ca3af" /></div>
                            }
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: '600', color: '#1e3a5f', fontSize: '0.88rem' }}>{h.name}</div>
                              <div style={{ color: '#6b7280', fontSize: '0.76rem', marginTop: '1px' }}>{h.category} · {h.location}</div>
                              {hasCoords ? <div style={{ color: '#16a34a', fontSize: '0.7rem', marginTop: '1px' }}>📍 {h.lat}, {h.lng} — <strong>on map</strong></div> : <div style={{ color: '#d97706', fontSize: '0.7rem', marginTop: '1px' }}>⚠️ No coordinates — not on map</div>}
                              {h.detailedInfo?.transportationFee && <div style={{ color: '#92400e', fontSize: '0.7rem', marginTop: '1px' }}>🚌 Transportation info added</div>}
                              {/* Per-site rating from siteRatings */}
                              {siteRatingMap[h.name] && (() => {
                                const sr = siteRatingMap[h.name];
                                const avg = parseFloat((sr.total / sr.count).toFixed(1));
                                return (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                                    <span style={{ fontSize: '0.68rem', fontWeight: '700', color: healthColor(avg), background: healthBg(avg), padding: '1px 7px', borderRadius: '8px', border: `1px solid ${healthBorder(avg)}` }}>
                                      {avg}★ · {sr.count} rating{sr.count !== 1 ? 's' : ''} · {healthLabel(avg)}
                                    </span>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                            <button onClick={() => startEdit(h)} style={{ background: '#eff6ff', border: 'none', borderRadius: '8px', padding: '7px 10px', cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}><Eye size={14} /> Edit</button>
                            <button onClick={() => deleteHeritage(h.id)} style={{ background: '#fef2f2', border: 'none', borderRadius: '8px', padding: '7px 10px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}><Trash2 size={14} /></button>
                          </div>
                        </div>
                      );
                    })}
                    {heritage.length === 0 && <p style={{ color: '#9ca3af', fontSize: '0.88rem' }}>No heritage entries yet. Add one above!</p>}
                  </div>
                </div>
              )}

              {/* ══ ANNOUNCEMENTS ══ */}
              {activeTab === 'announcements' && (
                <div>
                  <h5 style={{ color: '#1e3a5f', fontWeight: '700', marginBottom: '18px' }}>Announcements <span style={{ fontSize: '0.82rem', fontWeight: '400', color: '#9ca3af' }}>({announcements.length})</span></h5>
                  <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                    <h6 style={{ color: '#1e3a5f', fontWeight: '600', marginBottom: '14px', fontSize: '0.9rem' }}>📢 Post New Announcement</h6>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', marginBottom: '10px' }}>
                      <div><label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Title *</label><input value={annForm.title} onChange={e => setAnnForm(p => ({ ...p, title: e.target.value }))} placeholder="Announcement title..." style={inp} /></div>
                      <div><label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Type</label><select value={annForm.type} onChange={e => setAnnForm(p => ({ ...p, type: e.target.value }))} style={{ ...inp, width: '130px' }}>{Object.entries(ANN_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                    </div>
                    <div style={{ marginBottom: '12px' }}><label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Message *</label><textarea value={annForm.body} onChange={e => setAnnForm(p => ({ ...p, body: e.target.value }))} placeholder="Write your announcement here..." rows={3} style={{ ...inp, resize: 'vertical', lineHeight: '1.5' }} /></div>
                    <button onClick={saveAnnouncement} disabled={savingAnn} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: 'white', fontWeight: '600', fontSize: '0.86rem', opacity: savingAnn ? 0.7 : 1 }}><Bell size={14} /> Post Announcement</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {announcements.map(a => {
                      const tc = ANN_TYPES[a.type] || ANN_TYPES.info;
                      return (
                        <div key={a.id} style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', borderLeft: `4px solid ${tc.color}` }}>
                          <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}><span style={{ fontWeight: '700', color: '#1e3a5f', fontSize: '0.9rem' }}>{a.title}</span><span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600', background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>{tc.label}</span></div>
                              <p style={{ color: '#374151', fontSize: '0.85rem', margin: '0 0 6px', lineHeight: '1.5' }}>{a.body}</p>
                              {a.createdAt?.toDate && <span style={{ color: '#9ca3af', fontSize: '0.72rem' }}>{a.createdAt.toDate().toLocaleString()}</span>}
                            </div>
                            <button onClick={() => deleteAnnouncement(a.id)} style={{ background: '#fef2f2', border: 'none', borderRadius: '8px', padding: '7px 10px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', flexShrink: 0 }}><Trash2 size={14} /></button>
                          </div>
                        </div>
                      );
                    })}
                    {announcements.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}><Megaphone size={28} style={{ marginBottom: '8px', opacity: 0.3 }} /><p style={{ margin: 0, fontSize: '0.88rem' }}>No announcements yet.</p></div>}
                  </div>
                </div>
              )}

            </>)}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes authSlideIn { from { opacity:0; transform:translateY(30px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default AdminPanel;