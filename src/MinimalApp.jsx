import React from 'react';

export default function MinimalApp() {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    console.log('MinimalApp mounted');
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <div style={{ padding: '20px', color: '#d4af37', fontSize: '18px' }}>Loading...</div>;
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#faf9f6',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#d4af37', marginBottom: '10px' }}>
          The Heart of Our Father School Manager
        </h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Welcome! The app is loading...
        </p>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #d4af37',
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          margin: '0 auto',
          animation: 'spin 0.8s linear infinite'
        }}>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
