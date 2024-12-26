import React from 'react'
import "./RelatedProducts.css"
import data_product from "../Assets/allProducts"
import Item from '../Item/Item'
const RelatedProducts = () => {
  return (
    <div className="relatedProducts">
      <h1>Related products</h1>
      <hr/>
      <div className="relatedProducts-item">
              {data_product.map((item, i)=>{
                            return<Item key={i} 
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

export default RelatedProducts
