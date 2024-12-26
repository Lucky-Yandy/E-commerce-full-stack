import React, { useContext,useState } from 'react'
import './Productdisplay.css'
import star_icon from "../Assets/star.png"
import { ShopContext } from '../../Context/ShopContext';
const Productdisplay = (props) => {
              const {product} =props;
              const {addToCart} =useContext(ShopContext);
             // console.log("the product on display page",product)
           
            // State to store the clicked image URL
            const [selectedImage, setSelectedImage] = useState(null);

            // Handle click event to update the selected image
            const handleImageClick = (imageUrl) => {
                 setSelectedImage(imageUrl); // Update state with clicked image URL
            };     

           // Set the default image if no image is clicked
           const mainImage = selectedImage || (product.ProductImage && product.ProductImage[0]?.url);


           const availableSizes = ["S", "M", "L", "XL"];
           const productsize = product.Size;
           //console.log(productsize);

  return (
    <div className='productdisplay'>
      <div className='productdisplay-left'>
              <div className='productdisplay-img-list'>
              {product.ProductImage && product.ProductImage.length > 0 ? (
            product.ProductImage.map((image, index) => (
              <img key={index} src={image.url} alt=''
                    onClick={() => handleImageClick(image.url)} // Attach click event
                    style={{ cursor: 'pointer' }}
                    />
            ))
          ) : (
            <p>No images available</p> // Handle case where there are no images
          )}
              </div>
              <div className="productdisplay-img">
                            <img className='productdisplay-main-img' src={mainImage} alt="" />
              </div>
      </div>
      <div className='productdisplay-right'>
              <h1>{product.name}</h1>
              <div className="productdisplay-right-star">
                            <img src={star_icon} alt=""></img>
                            <img src={star_icon} alt=""></img>
                            <img src={star_icon} alt=""></img>
                            <img src={star_icon} alt=""></img>
                            <img src={star_icon} alt=""></img>
                            <p>(122)</p>
              </div>
              <div className="productdisplay-right-prices">
                      <div className="productdisplay-right-priced-old">${product.OldPrice}</div>
                      <div className="product-right-price-new">${product.ProductPrice}</div>
              </div>
              <div className="productdisplay-right-description">
                {product.ProductDescription}
              </div>
              <div className="productdisplay-right-size">
                <h1>Select Size</h1>
                <div className="productdisplay-right-sizes">
                {availableSizes.map((size, index) => (
                            <div
                                key={index}
                                style={{
                                  backgroundColor: productsize === size ? '#ffdd57' : '#fbfbfb', // Set background to yellow if size matches
                                
                              }}
                            >
                                {size}
                            </div>
                        ))}
                </div>
              </div>
              <button onClick={()=>{addToCart(product.id)}}>Add to Cart</button>
              <p className="productdisplay-right-category"><span> Category:</span> {product.Category}</p>
             <p className="productdisplay-right-category"><span> Tags:</span> Mordern , latest</p>

      </div>
    </div>
  )
}

export default Productdisplay
