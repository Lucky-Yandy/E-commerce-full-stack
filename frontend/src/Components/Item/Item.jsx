import React from 'react'
import { Link } from 'react-router-dom'
import './Item.css'
const Item = (props) => {
  console.log(props.image);
  return (
    <div className='item'>
     <Link to={`/product/${props.id}`}><img onClick={window.scrollTo(0,0)} src={props.image[0].url} alt=''/></Link> 
      <p >{props.name}</p>
      <div className='item-prices'>
          <div  className='item-new-price' >
              ${props.newprice}
          </div>
          <div className='item-old-price'>
              {props.oldprice}
          </div>
      </div>  
     
    </div>
  )
}

export default Item
