import { BookOpen, Globe, Shield, Users, Code, Palette, Bug, Terminal } from 'lucide-react';

function About() {
  const teamMembers = [
    {
      name: 'James Ivan Jimenez',
      role: 'Lead Programmer',
      description: 'Oversees technical architecture, development workflow, and code quality standards',
      icon: <Code />,
      color: '#3b82f6'
    },
    {
      name: 'John Albert Tabasa',
      role: 'Assistant Programmer',
      description: 'Implements features, assists with debugging, and supports development tasks',
      icon: <Terminal />,
      color: '#8b5cf6'
    },
    {
      name: 'Timothy Largo',
      role: 'UI/UX Designer',
      description: 'Creates user interfaces, designs user experiences, and ensures visual consistency',
      icon: <Palette />,
      color: '#10b981'
    },
    {
      name: 'June Angelo Pogio',
      role: 'Tester',
      description: 'Conducts quality assurance, performs testing, and ensures application reliability',
      icon: <Bug />,
      color: '#f59e0b'
    }
  ];

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container py-5">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-4" style={{ 
            background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            About Maharlika
          </h1>
          <p className="lead text-muted mb-4">
            Preserving and Celebrating Philippine Cultural Heritage
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="row g-4 mb-5">
          <div className="col-lg-8 mx-auto">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
              <div className="card-body p-5">
                <h3 className="fw-bold mb-4" style={{ color: '#1e3a5f' }}>
                  Our Mission
                </h3>
                <p className="text-muted mb-4">
                  Maharlika is a digital platform dedicated to promoting awareness, appreciation, and preservation 
                  of the Philippines' rich cultural heritage and natural biodiversity. We serve as an educational 
                  resource for students, researchers, and cultural advocates.
                </p>
                
                <div className="row g-4 mt-4">
                  {[
                    { icon: <BookOpen />, title: 'Education', desc: 'Educational resource for students and researchers' },
                    { icon: <Globe />, title: 'Preservation', desc: 'Digital preservation of cultural heritage' },
                    { icon: <Shield />, title: 'Advocacy', desc: 'Promoting cultural and environmental awareness' },
                    { icon: <Users />, title: 'Community', desc: 'Engaging the public in cultural appreciation' }
                  ].map((item, index) => (
                    <div key={index} className="col-md-6">
                      <div className="d-flex gap-3">
                        <div style={{
                          width: '50px',
                          height: '50px',
                          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          {item.icon}
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1" style={{ color: '#1e3a5f' }}>
                            {item.title}
                          </h6>
                          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="row g-4 mb-5">
          <div className="col-12">
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-3" style={{ color: '#1e3a5f' }}>
                Meet Our Team
              </h2>
              <p className="text-muted">
                The passionate individuals behind Maharlika Heritage Platform
              </p>
            </div>
            
            <div className="row g-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="col-md-6 col-lg-3">
                  <div className="card h-100 border-0 shadow-sm hover-lift" 
                    style={{ 
                      borderRadius: '15px',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px)';
                      e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    <div className="card-body p-4 text-center">
                      {/* Icon/Initial */}
                      <div className="mb-4">
                        <div style={{
                          width: '80px',
                          height: '80px',
                          background: `linear-gradient(135deg, ${member.color}, ${member.color}dd)`,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '2rem',
                          margin: '0 auto',
                          boxShadow: `0 8px 20px ${member.color}40`
                        }}>
                          {member.icon}
                        </div>
                      </div>
                      
                      <h5 className="fw-bold mb-2" style={{ color: '#1e3a5f' }}>
                        {member.name}
                      </h5>
                      
                      <div className="mb-3">
                        <span style={{
                          display: 'inline-block',
                          padding: '5px 15px',
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

        {/* Features */}
        <div className="row g-4">
          {[
            {
              title: 'Interactive Heritage Map',
              description: 'Explore Philippine cultural sites through an interactive map with detailed information.',
              color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
            },
            {
              title: 'Cultural Documentation',
              description: 'Comprehensive information about historical landmarks, traditional practices, and indigenous cultures.',
              color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
            },
            {
              title: 'Educational Resources',
              description: 'Learning materials for students and educators about Philippine history and culture.',
              color: 'linear-gradient(135deg, #10b981, #059669)'
            },
            {
              title: 'Biodiversity Database',
              description: 'Information about native Philippine flora, fauna, and protected natural areas.',
              color: 'linear-gradient(135deg, #f59e0b, #d97706)'
            }
          ].map((feature, index) => (
            <div key={index} className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                <div className="card-body p-4">
                  <div className="mb-3">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: feature.color,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      {index + 1}
                    </div>
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#1e3a5f' }}>
                    {feature.title}
                  </h5>
                  <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Capstone Project Info */}
        <div className="row mt-5 pt-5">
          <div className="col-lg-8 mx-auto">
            <div className="card border-0" style={{ 
              background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.05) 0%, rgba(44, 82, 130, 0.05) 100%)',
              borderRadius: '20px'
            }}>
              <div className="card-body p-5 text-center">
                <h4 className="fw-bold mb-3" style={{ color: '#1e3a5f' }}>
                  Capstone Project
                </h4>
                <p className="text-muted mb-4">
                  Maharlika is developed as a capstone project, combining technical skills with cultural preservation 
                  to create a meaningful digital platform for Philippine heritage education and documentation.
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  {teamMembers.map((member, index) => (
                    <div key={index} style={{
                      padding: '8px 16px',
                      background: `${member.color}15`,
                      borderRadius: '20px',
                      color: member.color,
                      fontSize: '0.85rem',
                      fontWeight: '500'
                    }}>
                      {member.name.split(' ')[0]} • {member.role.split(' ')[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-5 pt-5">
          <p className="text-muted">
            Maharlika - A Capstone Project for Philippine Cultural Heritage Preservation
          </p>
          <p className="text-muted small mt-2">
            Developed with ❤️ by Team Maharlika
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;