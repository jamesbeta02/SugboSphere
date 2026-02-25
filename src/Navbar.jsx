import { Home, Compass, Map, Globe, Menu, X, LogIn, LogOut, Shield, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import AuthModal from './AuthModal';
import AdminPanel from './AdminPanel';

// ── Admin emails ──
const ADMIN_EMAILS = ['admin123@gmail.com'];

function Navbar() {
  const [isOpen, setIsOpen]             = useState(false);
  const [showAuth, setShowAuth]         = useState(false);
  const [showAdmin, setShowAdmin]       = useState(false);
  const [user, setUser]                 = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [dropdownPos, setDropdownPos]   = useState({ top: 0, right: 0 });
  const avatarBtnRef                    = useRef(null);
  const dropdownRef                     = useRef(null);
  const location                        = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        avatarBtnRef.current && !avatarBtnRef.current.contains(e.target)
      ) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAvatarClick = () => {
    if (avatarBtnRef.current) {
      const rect = avatarBtnRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 10, right: window.innerWidth - rect.right });
    }
    setUserMenuOpen(p => !p);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUserMenuOpen(false);
  };

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  // Avatar color: gold for admin, blue for user
  const avatarGrad = isAdmin
    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
    : 'linear-gradient(135deg, #3b82f6, #1d4ed8)';

  const navItems = [
    { icon: Home,    label: 'Home',         to: '/' },
    { icon: Compass, label: 'Explore',      to: '/explore' },
    { icon: Map,     label: 'Destinations', to: '/destinations' },
    { icon: Globe,   label: 'About',        to: '/about' },
  ];

  return (
    <>
      <nav
        className="bg-dark text-white position-fixed w-100"
        style={{
          top: 0, left: 0, zIndex: 9000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 50%, #1a365d 100%)',
          animation: 'fadeIn 0.5s ease'
        }}
      >
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-center justify-content-md-between py-3 px-2">

            {/* ── Logo ── */}
            <div className="d-flex align-items-center">
              <Link to="/" className="text-white text-decoration-none">
                <div>
                  <h1 className="h4 mb-0 fw-bold" style={{
                    letterSpacing: '2px',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    background: 'linear-gradient(90deg, #fff 0%, #93c5fd 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    SUGBOSPHERE
                  </h1>
                  <small className="d-none d-md-block" style={{ fontSize: '0.65rem', letterSpacing: '1.5px', color: '#ffffff' }}>
                    CEBU HERITAGE EXPLORER
                  </small>
                </div>
              </Link>
            </div>

            {/* ── Desktop nav — centered ── */}
            <div className="d-none d-md-flex align-items-center gap-1 position-absolute start-50 translate-middle-x">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="d-flex align-items-center gap-2 px-3 py-2 text-white text-decoration-none rounded"
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                      animation: `slideDown 0.5s ease ${index * 0.1}s backwards`,
                      backgroundColor: isActive ? 'rgba(59,130,246,0.3)' : 'transparent',
                      boxShadow: isActive ? '0 4px 12px rgba(59,130,246,0.4)' : 'none'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.3)'; e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = isActive ? 'rgba(59,130,246,0.3)' : 'transparent'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = isActive ? '0 4px 12px rgba(59,130,246,0.4)' : 'none'; }}
                  >
                    <item.icon size={18} />
                    <span className="small fw-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* ── Right side ── */}
            <div className="d-none d-md-flex align-items-center gap-2">

              {/* Admin Panel shortcut — only visible to admin */}
              {isAdmin && (
                <button
                  onClick={() => setShowAdmin(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                    background: 'rgba(245,158,11,0.25)', color: '#fbbf24',
                    fontWeight: '600', fontSize: '0.82rem', transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.25)'}
                >
                  <Shield size={15} /> Admin Panel
                </button>
              )}

              {user ? (
                /* ── Logged-in: show avatar + name ── */
                <button
                  ref={avatarBtnRef}
                  onClick={handleAvatarClick}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '7px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                    background: userMenuOpen ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)',
                    color: 'white', fontSize: '0.85rem', fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                  onMouseLeave={e => { if (!userMenuOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                >
                  {/* Avatar circle */}
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: avatarGrad,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: '700', fontSize: '0.82rem', flexShrink: 0
                  }}>
                    {(user.displayName || user.email || '?')[0].toUpperCase()}
                  </div>
                  {/* Display name */}
                  <span style={{ color: 'white', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </button>
              ) : (
                /* ── Not logged in: single Sign In button ── */
                <button
                  onClick={() => setShowAuth(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white', fontWeight: '600', fontSize: '0.85rem',
                    boxShadow: '0 4px 14px rgba(59,130,246,0.4)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(59,130,246,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(59,130,246,0.4)'; }}
                >
                  <LogIn size={15} /> Sign In
                </button>
              )}
            </div>

            {/* ── Hamburger (mobile) ── */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="btn btn-dark p-2 d-md-none position-absolute end-0 me-3"
              style={{ border: 'none', transition: 'transform 0.3s ease' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0)'}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* ── Mobile menu ── */}
          {isOpen && (
            <div className="d-md-none border-top border-secondary" style={{ animation: 'slideDownMenu 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
              <div className="py-2">
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="d-flex align-items-center gap-3 px-3 py-3 text-white text-decoration-none"
                      style={{
                        transition: 'all 0.3s ease',
                        animation: `slideInLeft 0.4s ease ${index * 0.1}s backwards`,
                        borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                        backgroundColor: isActive ? 'rgba(59,130,246,0.2)' : 'transparent'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.2)'; e.currentTarget.style.borderLeftColor = '#3b82f6'; e.currentTarget.style.paddingLeft = '20px'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = isActive ? 'rgba(59,130,246,0.2)' : 'transparent'; e.currentTarget.style.borderLeftColor = isActive ? '#3b82f6' : 'transparent'; e.currentTarget.style.paddingLeft = '12px'; }}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon size={20} />
                      <span className="small fw-medium">{item.label}</span>
                    </Link>
                  );
                })}

                {/* Mobile auth section */}
                <div className="px-3 py-3 mt-2 border-top border-secondary" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {user ? (
                    <>
                      {/* Who's logged in */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: avatarGrad, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontWeight: '700', fontSize: '1rem'
                        }}>
                          {(user.displayName || user.email || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ color: 'white', fontWeight: '600', fontSize: '0.88rem' }}>
                            {user.displayName || user.email?.split('@')[0]}
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                            {isAdmin ? '⭐ Administrator' : 'User'}
                          </div>
                        </div>
                      </div>

                      {/* Admin panel button (admin only) */}
                      {isAdmin && (
                        <button onClick={() => { setIsOpen(false); setShowAdmin(true); }} style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          background: 'rgba(245,158,11,0.2)', border: 'none', borderRadius: '10px',
                          color: '#fbbf24', padding: '10px 14px', cursor: 'pointer',
                          fontWeight: '600', fontSize: '0.85rem'
                        }}>
                          <Shield size={16} /> Open Admin Panel
                        </button>
                      )}

                      {/* Sign out */}
                      <button onClick={handleSignOut} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(239,68,68,0.15)', border: 'none', borderRadius: '10px',
                        color: '#fca5a5', padding: '10px 14px', cursor: 'pointer',
                        fontWeight: '600', fontSize: '0.85rem'
                      }}>
                        <LogOut size={16} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <button onClick={() => { setIsOpen(false); setShowAuth(true); }} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      border: 'none', borderRadius: '10px',
                      color: 'white', padding: '12px 14px', cursor: 'pointer',
                      fontWeight: '600', fontSize: '0.9rem'
                    }}>
                      <LogIn size={16} /> Sign In
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes slideDown    { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
          @keyframes slideDownMenu{ from { opacity:0; max-height:0; } to { opacity:1; max-height:600px; } }
          @keyframes slideInLeft  { from { opacity:0; transform:translateX(-30px); } to { opacity:1; transform:translateX(0); } }
          @keyframes fadeIn       { from { opacity:0; } to { opacity:1; } }
          @keyframes dropdownFadeIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        `}</style>
      </nav>

      {/* ── Dropdown — rendered outside nav so it's never clipped ── */}
      {userMenuOpen && user && (
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: `${dropdownPos.top}px`,
            right: `${dropdownPos.right}px`,
            width: '220px',
            borderRadius: '16px',
            overflow: 'hidden',
            zIndex: 99999,
            boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            animation: 'dropdownFadeIn 0.18s ease'
          }}
        >
          {/* User info */}
          <div style={{ padding: '16px', background: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: avatarGrad, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: '700', fontSize: '1rem'
              }}>
                {(user.displayName || user.email || '?')[0].toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: '700', color: '#1e3a5f', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.displayName || user.email?.split('@')[0]}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.74rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </div>
              </div>
            </div>

            {/* Role badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '700',
              background: isAdmin ? 'rgba(245,158,11,0.12)' : 'rgba(59,130,246,0.1)',
              color: isAdmin ? '#d97706' : '#2563eb'
            }}>
              {isAdmin ? <><Shield size={10} /> Administrator</> : <><User size={10} /> User</>}
            </div>
          </div>

          {/* Admin panel link (admin only) */}
          {isAdmin && (
            <button
              onClick={() => { setUserMenuOpen(false); setShowAdmin(true); }}
              style={{
                width: '100%', padding: '13px 16px', border: 'none',
                background: 'white', display: 'flex', alignItems: 'center', gap: '10px',
                color: '#d97706', fontWeight: '600', fontSize: '0.88rem', cursor: 'pointer',
                textAlign: 'left', borderBottom: '1px solid #f3f4f6',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fffbeb'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              <Shield size={16} color="#d97706" /> Open Admin Panel
            </button>
          )}

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            style={{
              width: '100%', padding: '13px 16px', border: 'none',
              background: 'white', display: 'flex', alignItems: 'center', gap: '10px',
              color: '#dc2626', fontWeight: '600', fontSize: '0.88rem', cursor: 'pointer',
              textAlign: 'left', transition: 'background 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >
            <LogOut size={16} color="#dc2626" /> Sign Out
          </button>
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* Admin Panel */}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </>
  );
}

export default Navbar;