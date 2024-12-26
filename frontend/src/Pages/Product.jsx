import React, { useContext } from 'react'
import { useParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import Breadcrums from '../Components/Breadcrums/Breadcrums';
import Productdisplay from '../Components/Productdisplay/Productdisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
const Product = () => {
  
  const{productId} =useParams();
 
 
  console.log("hahaha",productId);


  const {products} =useContext(ShopContext);
  console.log(products);
  const product = products.find((e)=>e.id===productId);
  
  console.log("single product",product)


  return (
    <div>
      <Breadcrums theproduct ={product} />
      < Productdisplay product ={product}/>
      <DescriptionBox />
      <RelatedProducts />
    </div>
  )
}

export default Product
