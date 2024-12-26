import React from 'react'
import './NewCollections.css'
import new_collections from '../Assets/newCollections'
import Item from '../Item/Item'
const NewCollections = () => {
  console.log(new_collections) ;
  return (
    <div className='new-collections'>
      <h1>New Collections</h1>
      <hr/>
      <div className='collections'>
              {new_collections.map((item,i)=>{
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

export default NewCollections
