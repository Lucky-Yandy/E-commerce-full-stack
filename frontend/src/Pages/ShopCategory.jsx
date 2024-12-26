import React, { useContext } from 'react'
import './CSS/ShopCategory.css'
import { ShopContext } from '../Context/ShopContext'
import dropdown from '../Components/Assets/dropdown.png'
import Item from '../Components/Item/Item';

const ShopCategory = (props) => {
   
  
   const {products} =useContext(ShopContext);

  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt=""/>
      <div className='shopcategory-indexSort'> 
      <p>
        <span>Showing 1-12</span>out of 36 products
      </p>
      <div className="shopcategory-sort">
          Sort by<img src={dropdown} alt=""/>
      </div>
      </div>
      <div className ="shopcategory-products">
              {products.map((item,i)=>{
                if(props.category ===item.Category){
                  console.log("hello",props.category);
                  console.log("airtable",item.Category);
                 
                  return (
                    <Item key={i} 
                        id={item.id} 
                       
                        name={item.ProductName} 

                    image={item.ProductImage} 
                    newprice={item.ProductPrice} 
                    oldprice={item.Oldprice}/>  
                  )
                }else{
                  return null;
                }
              
              })}
      </div>
    </div>
  )
}

export default ShopCategory
