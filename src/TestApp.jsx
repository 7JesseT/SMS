import React from 'react';

export default function TestApp() {
  React.useEffect(() => {
    console.log('TestApp mounted');
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff', minHeight: '100vh' }}>
      <h1 style={{ color: '#d4af37' }}>TEST APP - REACT IS WORKING!</h1>
      <p style={{ color: 'green', fontSize: '18px', fontWeight: 'bold' }}>If you can read this text, React has rendered successfully!</p>
      <p>The app is running and React is functional.</p>
      <p>Browser console should show: "TestApp mounted"</p>
    </div>
  );
}
