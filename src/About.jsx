import { Map, Compass, Award, Users, BookOpen, Globe, Shield, Leaf, Camera, School, Search, Download, Share2, Heart, Target, Zap, Layers, Filter } from 'lucide-react';

function About() {
  const teamMembers = [
    {
      name: 'James Ivan Jimenez',
      role: 'Lead Developer',
      description: 'Architects the interactive map system and backend infrastructure',
      icon: <Zap />,
      color: '#3b82f6',
      image: 'src/image/ivan.jpg'
    },
    {
      name: 'John Albert Tabasa',
      role: 'Frontend Developer',
      description: 'Creates responsive interfaces and implements user experience features',
      icon: <Layers />,
      color: '#8b5cf6',
      image: 'src/image/tabasa.jpg'
    },
    {
      name: 'Timothy Largo',
      role: 'UI/UX Designer',
      description: 'Designs intuitive navigation and visual storytelling elements',
      icon: <Filter />,
      color: '#10b981',
      image: 'src/image/largo.jpg'
    },
    {
      name: 'June Angelo Pogio',
      role: 'Content Strategist',
      description: 'Curates heritage content and ensures cultural accuracy',
      icon: <BookOpen />,
      color: '#f59e0b',
      image: 'src/image/pogio.jpg'
    }
  ];

  const projectFeatures = [
    {
      icon: <Map />,
      title: 'Interactive Heritage Map',
      description: 'Explore Cebu\'s cities, landmarks, and biodiversity hotspots through an interactive digital map',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
    },
    {
      icon: <Camera />,
      title: 'Multimedia Content',
      description: 'Rich visual documentation with images, cultural narratives, and historical context',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
    },
    {
      icon: <Compass />,
      title: 'Organized Exploration',
      description: 'Browse by categories: Culture, History, Traditions, and Natural Resources',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      icon: <School />,
      title: 'Educational Platform',
      description: 'Designed for students, researchers, and tourists to learn about Cebu\'s heritage',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    }
  ];

  const projectStats = [
    { value: '30+', label: 'Heritage Sites', icon: <Target />, color: '#3b82f6' },
    { value: '3', label: 'Main Categories', icon: <Filter />, color: '#8b5cf6' },
    { value: '15+', label: 'Cities & Municipalities', icon: <Globe />, color: '#10b981' },
    { value: '50+', label: 'Cultural Practices', icon: <Users />, color: '#f59e0b' }
  ];

  return (
    <div style={{ 
      paddingTop: '80px', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Elements */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0) 70%)',
        borderRadius: '50%',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, rgba(139, 92, 246, 0) 70%)',
        borderRadius: '50%',
        zIndex: 0
      }} />

      <div className="container py-5 position-relative" style={{ zIndex: 1 }}>
        {/* Hero Section */}
        <div className="text-center mb-5" style={{ animation: 'fadeInUp 0.8s ease' }}>
          <div className="mb-4">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: '20px',
              marginBottom: '20px',
              boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
            }}>
              <Globe size={32} color="white" />
            </div>
          </div>
          <h1 className="display-4 fw-bold mb-3" style={{ 
            background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>
            SugboSphere
          </h1>
          <p className="lead text-muted mb-4" style={{ 
            maxWidth: '600px', 
            margin: '0 auto',
            fontSize: '1.25rem',
            lineHeight: '1.6'
          }}>
            A Map-Driven Web Platform for Exploring Cebu's Cultural Heritages and Iconic Places
          </p>
        </div>

        {/* Project Description */}
        <div className="row g-4 mb-5">
          <div className="col-lg-10 mx-auto" style={{ animation: 'fadeInUp 0.8s ease 0.2s backwards' }}>
            <div className="card border-0 shadow-lg overflow-hidden" style={{ 
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div className="card-body p-5">
                <div className="row align-items-center">
                  <div className="col-lg-12">
                    <h3 className="fw-bold mb-4" style={{ color: '#1e3a5f' }}>
                      About SugboSphere
                    </h3>
                    <p className="text-muted mb-4" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
                      SugboSphere is an interactive, map-driven web platform dedicated to promoting awareness and 
                      appreciation of Cebu's rich cultural heritage, historical landmarks, and natural biodiversity. 
                      Our curated platform serves as a digital gateway for students, educators, tourists, and cultural 
                      enthusiasts to explore and learn about the Queen City of the South.
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                      <span className="badge px-3 py-2" style={{ 
                        background: 'rgba(59, 130, 246, 0.1)', 
                        color: '#3b82f6',
                        fontWeight: '600',
                        borderRadius: '10px'
                      }}>
                        <Map size={14} className="me-2" />
                        Interactive Maps
                      </span>
                      <span className="badge px-3 py-2" style={{ 
                        background: 'rgba(139, 92, 246, 0.1)', 
                        color: '#8b5cf6',
                        fontWeight: '600',
                        borderRadius: '10px'
                      }}>
                        <BookOpen size={14} className="me-2" />
                        Educational Resource
                      </span>
                      <span className="badge px-3 py-2" style={{ 
                        background: 'rgba(16, 185, 129, 0.1)', 
                        color: '#10b981',
                        fontWeight: '600',
                        borderRadius: '10px'
                      }}>
                        <Leaf size={14} className="me-2" />
                        Cultural Preservation
                      </span>
                      <span className="badge px-3 py-2" style={{ 
                        background: 'rgba(245, 158, 11, 0.1)', 
                        color: '#f59e0b',
                        fontWeight: '600',
                        borderRadius: '10px'
                      }}>
                        <Users size={14} className="me-2" />
                        Community Engagement
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Stats */}
        <div className="row g-4 mb-5" style={{ animation: 'fadeInUp 0.8s ease 0.4s backwards' }}>
          <div className="col-12">
            <div className="text-center mb-5">
              <h4 className="fw-bold mb-3" style={{ color: '#1e3a5f' }}>
                Exploring Cebu's Heritage
              </h4>
              <p className="text-muted mb-0">
                A comprehensive digital repository of Cebu's cultural and natural treasures
              </p>
            </div>
            
            <div className="row g-4">
              {projectStats.map((stat, index) => (
                <div key={index} className="col-md-3 col-6">
                  <div className="card border-0 h-100" style={{ 
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)'
                  }}>
                    <div className="card-body p-4 text-center">
                      <div className="mb-3">
                        <div style={{
                          width: '60px',
                          height: '60px',
                          background: `${stat.color}15`,
                          borderRadius: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: stat.color,
                          margin: '0 auto',
                          fontSize: '1.5rem'
                        }}>
                          {stat.icon}
                        </div>
                      </div>
                      <h2 className="fw-bold mb-2" style={{ color: '#1e3a5f' }}>
                        {stat.value}
                      </h2>
                      <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="row g-4 mb-5" style={{ animation: 'fadeInUp 0.8s ease 0.6s backwards' }}>
          <div className="col-12">
            <div className="text-center mb-5">
              <h4 className="fw-bold mb-3" style={{ color: '#1e3a5f' }}>
                Platform Features
              </h4>
              <p className="text-muted mb-0">
                Designed for immersive exploration and educational engagement
              </p>
            </div>
            
            <div className="row g-4">
              {projectFeatures.map((feature, index) => (
                <div key={index} className="col-md-6 col-lg-3">
                  <div className="card h-100 border-0 hover-lift" 
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px)';
                      e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    <div className="card-body p-4 text-center">
                      <div className="mb-4">
                        <div style={{
                          width: '70px',
                          height: '70px',
                          background: feature.gradient,
                          borderRadius: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          margin: '0 auto',
                          boxShadow: `0 8px 20px ${feature.color}40`
                        }}>
                          {feature.icon}
                        </div>
                      </div>
                      <h5 className="fw-bold mb-3" style={{ color: '#1e3a5f' }}>
                        {feature.title}
                      </h5>
                      <p className="text-muted mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="row g-4 mb-5" style={{ animation: 'fadeInUp 0.8s ease 0.8s backwards' }}>
          <div className="col-12">
            <div className="text-center mb-5">
              <h4 className="fw-bold mb-3" style={{ color: '#1e3a5f' }}>
                Development Team
              </h4>
              <p className="text-muted mb-0">
                The passionate creators behind SugboSphere
              </p>
            </div>
            
            <div className="row g-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="col-md-6 col-lg-3">
                  <div className="card h-100 border-0" 
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = `0 12px 30px ${member.color}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    <div className="card-body p-4 text-center">
                      <div className="mb-4">
                        <div style={{
                          width: '100px',
                          height: '100px',
                          background: member.image ? 'transparent' : `linear-gradient(135deg, ${member.color}, ${member.color}dd)`,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          margin: '0 auto',
                          border: `3px solid ${member.color}30`,
                          boxShadow: member.image ? '0 8px 20px rgba(0, 0, 0, 0.1)' : `0 8px 20px ${member.color}40`
                        }}>
                          {member.image ? (
                            <img 
                              src={member.image} 
                              alt={member.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '2rem'
                            }}>
                              {member.icon}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <h5 className="fw-bold mb-2" style={{ color: '#1e3a5f' }}>
                        {member.name}
                      </h5>
                      
                      <div className="mb-3">
                        <span style={{
                          display: 'inline-block',
                          padding: '6px 16px',
                          background: `${member.color}15`,
                          color: member.color,
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}>
                          {member.role}
                        </span>
                      </div>
                      
                      <p className="text-muted mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                        {member.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="row mt-5 pt-5" style={{ animation: 'fadeInUp 0.8s ease 1s backwards' }}>
          <div className="col-lg-8 mx-auto">
            <div className="card border-0 overflow-hidden" style={{ 
              background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)',
              borderRadius: '20px',
              color: 'white'
            }}>
              <div className="card-body p-5 text-center">
                <div className="mb-4">
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '60px',
                    height: '60px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '15px',
                    marginBottom: '20px'
                  }}>
                    <Compass size={28} />
                  </div>
                  <h4 className="fw-bold mb-3">
                    Start Exploring Cebu's Heritage Today
                  </h4>
                  <p className="mb-4 opacity-90" style={{ fontSize: '1.05rem' }}>
                    Join thousands of students, educators, and cultural enthusiasts in discovering 
                    the rich heritage of the Queen City of the South.
                  </p>
                </div>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <button className="btn px-4 py-3 d-flex align-items-center gap-2" 
                    style={{
                      background: 'white',
                      border: 'none',
                      color: '#1e3a5f',
                      borderRadius: '12px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Search size={18} />
                    Explore Interactive Map
                  </button>
                  <button className="btn px-4 py-3 d-flex align-items-center gap-2" 
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      borderRadius: '12px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                  >
                    <BookOpen size={18} />
                    View Educational Resources
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-5 pt-5">
          <p className="text-muted mb-2">
            SugboSphere — A Map-Driven Platform for Cebu's Cultural Heritage
          </p>
          <p className="text-muted small">
            Developed with ❤️ for Cebuano heritage preservation
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
}

export default About;