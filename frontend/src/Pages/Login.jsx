 import React,{useRef, useState, useEffect,useContext} from 'react';
 import AuthContext from '../Context/LoginAuthProvider'
 import { Link } from "react-router-dom";

 import './CSS/LoginSignup.css';
 const Login = () => {
              const { setAuth } = useContext(AuthContext);
              const userRef = useRef();
              const errRef = useRef();
          
              const [user, setUser] = useState('');
              const [pwd, setPwd] = useState('');
              const [errMsg, setErrMsg] = useState('');
              const [success, setSuccess] = useState(false);
          
              useEffect(() => {
                  userRef.current.focus();
              }, [])
          
              useEffect(() => {
                  setErrMsg('');
              }, [user, pwd])
          
              const handleSubmit = async (e) => {
                  e.preventDefault();
          
                  try {
                    const response = await fetch('http://localhost:5000/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user, pwd }),
                        credentials: 'include', // Send cookies with the request if needed (e.g., for session management)
                    });

                    if (!response.ok) {
                        throw new Error('Login failed');
                    }
                    
                   

                      const data = await response.json(); // Parse the response as JSON
                      localStorage.setItem('authToken', data.token);
                      console.log(data.token);
                     
          
                      // Set authentication context
                      setAuth({ 
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email,
                        phone: data.user.phone,
                        shippingAddress: data.user.shippingAddress,
                        orderHistory: data.user.orderHistory,
                        PaymentMethod: data.user.PaymentMethod,
                        cartItems: data.user.cartItems,
                        reviews: data.user.reviews
                    });
          
                      setUser('');
                      setPwd('');
                      setSuccess(true);
                  } catch (err) {
                        console.error(err);
                        if (!err?.response) {
                            setErrMsg('No Server Response');
                        } else if (err.response?.status === 400) {
                            setErrMsg('Missing Username or Password');
                        } else if (err.response?.status === 401) {
                            setErrMsg('Unauthorized');
                        } else {
                            setErrMsg('Login Failed');
                        }
                        errRef.current.focus();
                  }
                      
              }

   return (
<>
{success ? (
              <section>
              <h1>You are logged in!</h1>
              <br />
              <p>
              <Link to="/">Go to Home</Link>
              </p>
              </section>
) : (

      <div className="loginsignup">
          <div className='loginsignup-container'>
        
              <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
              
              <h1>Sign In</h1>
              <form className='loginsignup-fields' onSubmit={handleSubmit}>
                <label htmlFor="username">
                    Username:
                   
                </label>
                <input type='text' 
                       placeholder='Your Name'
                       id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                       
                  />
        
        
                <label htmlFor="password">
                    Password:
                  
                </label>
                <input type='password' placeholder='Your Password'
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                       
                />
               
                  <button >Sign In</button>
                  
              </form>
        
             
              <p className='loginsignup-login'> Need an account?
               <span > <Link to="/signup">Sign Up</Link></span>
               
               </p>
              <div className='loginsignup-agree'>
                <input type='checkbox' name='' id=''></input>
                <p>By continuing, I agree to the terms of use & privacy policy.</p>
              </div>
                
              </div>
            
            </div>
   )
 }
 </>
    )
}

 export default Login
 