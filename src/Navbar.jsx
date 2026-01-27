import { Home, Compass, Map, Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', to: '/' },
    { icon: Compass, label: 'Explore', to: '/explore' },
    { icon: Map, label: 'Destinations', to: '/destinations' },
    { icon: Globe, label: 'About', to: '/about' },
  ];

  if (typeof window !== 'undefined') {
    window.navbarIsOpen = isOpen;
  }
  
  return (
    <nav 
      className="bg-dark text-white position-fixed w-100"
      style={{
        top: 0,
        left: 0,
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 50%, #1a365d 100%)',
        animation: 'fadeIn 0.5s ease'
      }}
    >
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between py-3 px-2">
          {/* Logo */}
          <div className="d-flex align-items-center">
            <Link to="/" className="text-white text-decoration-none">
              <div className="d-flex align-items-center gap-3">
                {/* Logo SVG */}
                <svg 
                  width="50" 
                  height="50" 
                  viewBox="0 0 100 100"
                  style={{
                    filter: 'drop-shadow(0 2px 8px rgba(59, 130, 246, 0.4))',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#93c5fd', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  
                  {/* Outer Circle */}
                  <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" opacity="0.2"/>
                  
                  {/* Sun */}
                  <circle cx="50" cy="30" r="12" fill="url(#sunGradient)"/>
                  
                  {/* Sun rays */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                    const radian = (angle * Math.PI) / 180;
                    const x1 = 50 + Math.cos(radian) * 16;
                    const y1 = 30 + Math.sin(radian) * 16;
                    const x2 = 50 + Math.cos(radian) * 20;
                    const y2 = 30 + Math.sin(radian) * 20;
                    return (
                      <line 
                        key={i}
                        x1={x1} 
                        y1={y1} 
                        x2={x2} 
                        y2={y2} 
                        stroke="#fbbf24" 
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    );
                  })}
                  
                  {/* Mountains - 3 peaks */}
                  <path 
                    d="M 15 80 L 35 50 L 50 65 L 35 65 Z" 
                    fill="url(#logoGradient)"
                  />
                  <path 
                    d="M 30 80 L 50 45 L 70 80 Z" 
                    fill="url(#logoGradient)"
                    opacity="0.9"
                  />
                  <path 
                    d="M 50 80 L 65 55 L 85 80 Z" 
                    fill="url(#logoGradient)"
                    opacity="0.7"
                  />
                  
                  {/* Snow caps */}
                  <path 
                    d="M 47 47 L 50 45 L 53 47 Z" 
                    fill="white"
                  />
                  <path 
                    d="M 62 57 L 65 55 L 68 57 Z" 
                    fill="white"
                  />
                  
                  {/* Ocean waves at bottom */}
                  <path 
                    d="M 0 85 Q 25 82 50 85 T 100 85 L 100 100 L 0 100 Z" 
                    fill="#3b82f6"
                    opacity="0.3"
                  />
                </svg>
                
                {/* Brand Name */}
                <div>
                  <h1 
                    className="h4 mb-0 fw-bold" 
                    style={{ 
                      letterSpacing: '2px',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                      background: 'linear-gradient(90deg, #fff 0%, #93c5fd 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    MAHARLIKA
                  </h1>
                  <small 
                    className="text-muted" 
                    style={{ 
                      fontSize: '0.65rem', 
                      letterSpacing: '1.5px', 
                      color: '#60a5fa' 
                    }}
                  >
                    PHILIPPINE HERITAGE EXPLORER
                  </small>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="d-none d-md-flex align-items-center gap-1 flex-grow-1 justify-content-center">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className="d-flex align-items-center gap-2 px-3 py-2 text-white text-decoration-none rounded"
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `slideDown 0.5s ease ${index * 0.1}s backwards`,
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                    boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isActive ? 'rgba(59, 130, 246, 0.3)' : 'transparent';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = isActive ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none';
                  }}
                >
                  <item.icon size={18} style={{ transition: 'transform 0.3s' }} />
                  <span className="small fw-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Empty div to maintain layout (replacing auth buttons) */}
          <div className="d-none d-md-flex align-items-center gap-2">
            <div style={{
              padding: '8px 16px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: '500',
              animation: 'fadeIn 0.6s ease'
            }}>
              🇵🇭 Philippine Heritage
            </div>
          </div>

          {/* Hamburger Menu Button - Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-dark p-2 d-md-none"
            style={{ 
              border: 'none',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0)'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div 
            className="d-md-none border-top border-secondary"
            style={{
              animation: 'slideDownMenu 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
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
                      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                      e.currentTarget.style.borderLeftColor = '#3b82f6';
                      e.currentTarget.style.paddingLeft = '20px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent';
                      e.currentTarget.style.borderLeftColor = isActive ? '#3b82f6' : 'transparent';
                      e.currentTarget.style.paddingLeft = '12px';
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon size={20} />
                    <span className="small fw-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Project Info - Mobile (replacing auth buttons) */}
              <div className="px-3 py-3 mt-2 border-top border-secondary" style={{ animation: 'fadeIn 0.6s ease' }}>
                <div className="text-center">
                  <div style={{
                    padding: '10px 15px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.85rem',
                    fontWeight: '500'
                  }}>
                    <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🇵🇭</span>
                    Philippine Cultural Heritage Explorer
                  </div>
                  <p className="text-white-50 small mt-2 mb-0">
                    A capstone project showcasing Philippine heritage
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDownMenu {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;