import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/variables.css'
import './styles/global.css'
import './styles/animations.css'



const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML = "<h1>FATAL ERROR: Root element not found</h1>";
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
