import React from 'react'
import './NewsLetter.css'
const NewsLetter = () => {
  return (
    <div className='newsletter'>
              <h1>Get Exclusive offers on you email</h1>
              <p>Subscribe to our newletter and stay updated</p>
              <div>
                <input type="email" placeholder='your email address'/> 
                <button>Subscribe</button>
              </div>
             
    </div>
  )
}

export default NewsLetter
