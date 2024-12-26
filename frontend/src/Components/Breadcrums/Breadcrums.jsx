import React from 'react'
import './Breadcruns.css'
import arrow from '../Assets/arrownext.png'
const Breadcrums = ({ theproduct }) => {
             //const {product} =props;
             console.log("breadcrums",theproduct);
  return (
    <div className ='breadcrum'>
      Home <img src={arrow} alt=''/> Shop<img src={arrow} alt=''/> {theproduct.Category} <img src={arrow} alt=''/>{theproduct.ProductName} 

      
    </div>
  )
}

export default Breadcrums
