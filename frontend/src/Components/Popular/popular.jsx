import React from 'react'
import './Popular.css'
import data_product from '../Assets/data';
import Item from '../Item/Item'
const popular = () => {
  return (
    <div className='popular'>
      <h1>Popular in women</h1>
      <hr/>
      <div className="popular-item">
              {data_product.map((item,i)=>{
                return <Item key={i} 
                            id={item.id} 
                            name={item.name} 
                        image={item.image} 
                        newprice={item.new_price} 
                        oldprice={item.old_price}/>
              })}
      </div>
    </div>
  )
}


export default popular
