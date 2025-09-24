const Footer = () => (
  <footer style={{
    marginTop: '4rem',
    background: 'var(--text-dark)',
    color: 'white',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Barra superior decorativa */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: 'var(--gradient)'
    }}></div>

    <div className="footer-content" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem 1.5rem',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        {/* Información principal */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{
            color: 'white',
            marginBottom: '0.5rem',
            fontSize: '1.2rem',
            fontWeight: '600'
          }}>
            Portfolio Vepeeme
          </h3>
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.9rem'
          }}>
            Catador de helados profesional
          </p>
        </div>

        {/* Tecnologías */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          justifyContent: 'center'
        }}>
          {['React', 'Node.js', 'PostgreSQL'].map(tech => (
            <span key={tech} style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.9)',
              padding: '0.3rem 0.8rem',
              borderRadius: '15px',
              fontSize: '0.8rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              {tech}
            </span>
          ))}
        </div>

        {/* Copyright */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.85rem',
            margin: 0
          }}>
            © {new Date().getFullYear()} Portfolio Vepeeme - Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;