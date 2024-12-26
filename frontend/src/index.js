import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {LoginAuthProvider} from './Context/LoginAuthProvider';
import ShopContextProvider from './Context/ShopContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <LoginAuthProvider>
    <ShopContextProvider >
        <App />
    </ShopContextProvider>
  </LoginAuthProvider>
   
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

