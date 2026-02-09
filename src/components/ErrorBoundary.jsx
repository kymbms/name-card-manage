import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'white', backgroundColor: '#ef4444', height: '100vh', overflow: 'auto' }}>
          <h2>앱에 오류가 발생했습니다.</h2>
          <p>새로고침을 해주세요.</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px', fontSize: '12px' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              marginTop: '20px', 
              padding: '10px 20px', 
              background: 'white', 
              color: '#ef4444', 
              border: 'none', 
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
          >
            새로고침
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
