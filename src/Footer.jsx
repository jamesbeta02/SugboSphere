import { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mountain } from 'lucide-react';

function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;

      setIsVisible(innerHeight + scrollY >= scrollHeight - 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' }
  ];

  return (
    <footer
      className="text-white position-fixed bottom-0 w-100"
      style={{
        zIndex: 999,
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 50%, #1a365d 100%)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.4)',
        borderTop: '2px solid rgba(59, 130, 246, 0.3)'
      }}
    >
      <div className="container-fluid py-2 px-3">
        <div className="row align-items-center g-2">

          {/* Logo */}
          <div className="col-md-4 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
              <div className="position-relative" style={{ width: 24, height: 24 }}>
                <div
                  className="position-absolute inset-0 rounded-2 opacity-20"
                  style={{ background: 'linear-gradient(to bottom right, #3b82f6, #60a5fa)' }}
                />
                <div
                  
                  style={{
                    background: 'linear-gradient(to bottom right, #3b82f6, #60a5fa)',
                    boxShadow: '0 2px 8px rgba(59,130,246,0.4)'
                  }}
                >
                 
                </div>
              </div>

              <h6
                className="mb-0 fw-bold"
                style={{
                  background: 'linear-gradient(90deg, #fff, #93c5fd)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '0.85rem'
                }}
              >
                Maharlika
              </h6>
            </div>
          </div>

          {/* Links */}
          <div className="col-md-4 text-center">
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              {['About', 'Contact', 'Privacy'].map((label) => (
                <a
                  key={label}
                  href={`/${label.toLowerCase()}`}
                  className="text-decoration-none fw-medium"
                  style={{
                    color: '#93c5fd',
                    fontSize: '0.8rem',
                    transition: '0.3s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#93c5fd')}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div className="col-md-4 text-center text-md-end">
            <div className="d-flex gap-2 justify-content-center justify-content-md-end">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: 32,
                    height: 32,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    transition: '0.3s ease'
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="my-2"
          style={{
            height: 1,
            background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.3), transparent)'
          }}
        />

        <p className="text-center mb-0" style={{ fontSize: '0.75rem', color: '#93c5fd' }}>
          © {new Date().getFullYear()} Maharlika. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
