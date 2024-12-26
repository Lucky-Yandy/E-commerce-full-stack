import React from 'react'

import './Hero.css'
import arrow from '../Assets/right-arrow.png'
import heroimg from '../Assets/fashiongirl.png'
import newcollection from '../Assets/newcollection.png'
const Hero = () => {
  return (
    <div className='hero'> 
     <div  className="hero-left" >
              <h2>New Arrivals Only</h2>
              <div>
                <div className="hero-hand-icon">
                   <p>New</p>
                    <img src={newcollection} alt='newcollection' />
                </div>
                <p>collections</p>
                <p>for everyone</p>
              </div> 
              <div className='hero-latest-btn'>
               <div> latest collection</div>
               <img src={arrow} alt="" /> 
              </div>
     </div>

     <div className="hero-right" >
              <img src={heroimg}  alt="" />
     </div>
    </div>
  )
}

export default Hero
