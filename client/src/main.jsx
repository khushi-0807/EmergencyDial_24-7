import React from 'react';
import ReactDOM from 'react-dom/client';  
import App from './App.jsx';
import './index.css';


const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
script.async = true;
script.defer = true; //ensures that the script is executed only after the HTML parsing is complete
document.head.appendChild(script);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
