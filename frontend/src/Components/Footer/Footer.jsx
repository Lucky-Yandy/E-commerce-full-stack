import React from 'react';
import './Footer.css';
import logo from '../Assets/shopping-bags_5821179.png';
import facebook from '../Assets/icons8-facebook-logo-24.png';
import ins from '../Assets/icons8-instagram-logo-94.png';
const Footer = () => {
  return (
    <div className='footer'>
      <div className='footer-logo'>
              <img src={logo} alt=""/> 
              <p>SHOPPER</p>
      </div>
      <ul className="footer-links">
              <li>Company</li>
              <li>Products</li>
              <li>Offices</li>
              <li>About</li>
              <li>Contact</li>

      </ul>
      <div className="footer-social-icon">
              <div className='footer-icons-container'>
              <img src={facebook} alt=""/> 
              </div>
              <div className='footer-icons-container'>
              <img src={ins} alt=""/> 
              </div>
            
      </div>
      <div className="footer-copyright">
              <hr/>
              <p>Copyright @ 2024 All Right Reserved.</p>
      </div> 
    </div>
  )
}

export default Footer
