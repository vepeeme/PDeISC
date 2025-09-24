import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cerrar menú cuando cambie la ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <header>
      <div className="header-content">
        <Link to="/" className="logo" onClick={closeMenu}>
          Portfolio Vepeeme
        </Link>
        
        {/* Botón hamburguesa para móvil */}
        {isMobile && (
          <button 
            className={`hamburger-btn ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.75rem',
              borderRadius: '8px',
              position: 'relative',
              width: '44px',
              height: '44px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              zIndex: 1001
            }}
          >
            <div style={{
              position: 'relative',
              width: '24px',
              height: '24px'
            }}>
              <span style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '20px',
                height: '2px',
                backgroundColor: 'white',
                borderRadius: '1px',
                transformOrigin: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isMenuOpen 
                  ? 'translate(-50%, -50%) rotate(45deg)' 
                  : 'translate(-50%, -50%) rotate(0deg) translateY(-6px)'
              }}></span>
              
              <span style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '20px',
                height: '2px',
                backgroundColor: 'white',
                borderRadius: '1px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'translate(-50%, -50%)',
                opacity: isMenuOpen ? 0 : 1,
                scaleX: isMenuOpen ? 0 : 1
              }}></span>
              
              <span style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '20px',
                height: '2px',
                backgroundColor: 'white',
                borderRadius: '1px',
                transformOrigin: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isMenuOpen 
                  ? 'translate(-50%, -50%) rotate(-45deg)' 
                  : 'translate(-50%, -50%) rotate(0deg) translateY(6px)'
              }}></span>
            </div>
          </button>
        )}
        
        {/* Navegación */}
        <nav 
          className={`nav ${isMobile ? 'nav-mobile' : 'nav-desktop'} ${isMenuOpen ? 'nav-open' : ''}`}
          style={{
            ...(isMobile ? {
              position: 'fixed',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              width: '100vw',
              height: '100vh',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              padding: '2rem',
              opacity: isMenuOpen ? 1 : 0,
              visibility: isMenuOpen ? 'visible' : 'hidden',
              transform: isMenuOpen ? 'scale(1)' : 'scale(1.05)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              gap: '1.5rem',
              boxShadow: 'inset 0 0 100px rgba(255, 255, 255, 0.1)'
            } : {
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1
            })
          }}
          onClick={isMobile ? closeMenu : undefined}
        >
          <div 
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '1.5rem' : '0.5rem',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => isMobile && e.stopPropagation()}
          >
            <NavLink to="/" active={location.pathname === '/'} isMobile={isMobile}>
               Inicio
            </NavLink>
            <NavLink to="/projects" active={location.pathname === '/projects'} isMobile={isMobile}>
               Proyectos
            </NavLink>
            <NavLink to="/skills" active={location.pathname === '/skills'} isMobile={isMobile}>
               Habilidades
            </NavLink>
            <NavLink to="/experiences" active={location.pathname === '/experiences'} isMobile={isMobile}>
               Experiencias
            </NavLink>
            
            {user ? (
              <>
                <NavLink to="/admin" active={location.pathname === '/admin'} isMobile={isMobile}>
                   Admin
                </NavLink>
                <button 
                  onClick={handleLogout}
                  style={{
                    background: isMobile ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    border: isMobile ? '2px solid rgba(255,255,255,0.3)' : 'none',
                    color: 'white',
                    cursor: 'pointer',
                    padding: isMobile ? '1rem 2rem' : '0.5rem 1rem',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    fontSize: isMobile ? '1.2rem' : '0.9rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    minWidth: isMobile ? '200px' : 'auto',
                    backdropFilter: isMobile ? 'blur(10px)' : 'none',
                    WebkitBackdropFilter: isMobile ? 'blur(10px)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = isMobile 
                      ? 'rgba(255, 255, 255, 0.25)' 
                      : 'rgba(255, 255, 255, 0.15)';
                    if (isMobile) {
                      e.target.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = isMobile 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'transparent';
                    if (isMobile) {
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                   Cerrar Sesión
                </button>
              </>
            ) : (
              <NavLink to="/login" active={location.pathname === '/login'} isMobile={isMobile}>
                 Acceder
              </NavLink>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

// Componente para enlaces de navegación mejorado
const NavLink = ({ to, active, children, isMobile }) => {
  return (
    <Link 
      to={to} 
      style={{
        color: 'white',
        textDecoration: 'none',
        padding: isMobile ? '1.2rem 2rem' : '0.5rem 1rem',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        fontSize: isMobile ? '1.3rem' : '0.9rem',
        fontWeight: isMobile ? '600' : '500',
        position: 'relative',
        display: 'block',
        background: active 
          ? (isMobile ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.15)') 
          : (isMobile ? 'rgba(255, 255, 255, 0.2)' : 'transparent'),
        border: isMobile 
          ? (active ? '2px solid rgba(255, 255, 255, 0.6)' : '2px solid rgba(255, 255, 255, 0.4)')
          : 'none',
        textAlign: 'center',
        minWidth: isMobile ? '200px' : 'auto',
        backdropFilter: isMobile ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: isMobile ? 'blur(10px)' : 'none',
        transform: isMobile ? 'translateY(0)' : 'translateY(0)',
        boxShadow: active && !isMobile ? 'inset 0 -2px 0 rgba(255,255,255,0.8)' : 'none'
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.target.style.background = isMobile 
            ? 'rgba(255, 255, 255, 0.35)' 
            : 'rgba(255, 255, 255, 0.1)';
          e.target.style.transform = isMobile ? 'translateY(-3px) scale(1.02)' : 'translateY(0)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.target.style.background = isMobile 
            ? 'rgba(255, 255, 255, 0.2)' 
            : 'transparent';
          e.target.style.transform = isMobile ? 'translateY(0) scale(1)' : 'translateY(0)';
        }
      }}
    >
      {children}
    </Link>
  );
};

export default Header;