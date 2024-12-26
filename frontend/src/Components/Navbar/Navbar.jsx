import React, { useContext, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/shopping-bags_5821179.png'
import profileicon from '../Assets/profile-picture.png';
import cart_icon from '../Assets/shopping-cart.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import  AuthContext  from '../../Context/LoginAuthProvider'

const Navbar = () => {

              const[menu, setMenu]=useState("shop");
              const{getTotalCartItems} = useContext(ShopContext);
              const { auth } = useContext(AuthContext); 
              console.log("navpage auth:",auth.name);
             
  return (
    <div className="navbar">
      <div className="nav-logo"> 
        <img src={logo} alt=""></img>
        <p>Second Story</p>
      </div>
      <ul className="nav-menu"> 
              <li onClick={()=>{setMenu("shop")}}><Link style={{textDecoration:'none', color:'black'}} to='/'>Shop</Link>{menu==="shop"?<hr/> :<></>}</li>
              <li onClick={()=>{setMenu("mens")}}><Link style={{textDecoration:'none',color:'black'}} to='/mens'>Men</Link>{menu==="mens"?<hr/> :<></>}</li>{}
              <li onClick={()=>{setMenu("women")}}><Link style={{textDecoration:'none',color:'black'}} to='women'>Women</Link>{menu==="women"?<hr/> :<></>}</li>
              <li onClick={()=>{setMenu("kids")}}><Link style={{textDecoration:'none',color:'black'}} to='kids'>Kids</Link>{menu==="kids"?<hr/> :<></>}</li>
      </ul>
      <div className="nav-login-cart">
                
            {!auth.name ? (
                <Link to='/login'>
                  <button>Login</button>
                </Link>
              ) : (
                <div className="user-profile">
                  <img
                    src={profileicon} // Display user image or a default image
                    alt="User"
                    style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                  />
                  <span>{auth.name}</span> {/* Display the user's name */}
                </div>
              )}
           
             <Link to='/cart'> <img src={cart_icon} alt=""></img></Link>
              <div className='nav-cart-count'>{getTotalCartItems()}</div>

      </div>
    </div>
  )
}

export default Navbar
