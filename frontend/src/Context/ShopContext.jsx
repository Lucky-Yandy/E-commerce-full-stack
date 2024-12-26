import React, { createContext, useState,useEffect } from "react";
//import all_Product from "../Components/Assets/allProducts"

export const ShopContext =createContext(null);

/*const getDefaultCart =()=>{
  let cart={};
  for(let index =0; index < products.length+1; index++){
    cart[index]=0;
  }
  return cart;

}*/

const ShopContextProvider =(props)=>{
              const [products, setProducts] = useState([]);
              const [loading, setLoading] = useState(true);
              const [cartItems, setCartItems]=useState({});
             
              const getDefaultCart = (products) => {
                let cart = {};
                products.forEach((product) => {
                  cart[product.id] = 0; // Initialize each product in the cart with 0 quantity
                });
                return cart;
              };
              
		useEffect(() => {
		    const fetchProducts = async () => {
		      try {
			const response = await fetch('http://localhost:5000/api/products'); 
			// Your backend API endpoint
			const data = await response.json();
			setProducts(data); 	// Set the fetched products in state
		
      setCartItems(getDefaultCart(data));
      //console.log("this is the data before set to product",data);
			//console.log("this is the data i set to product", products);
			setLoading(false);
		      } catch (error) {
			      console.error("Error fetching products:", error);
			      setLoading(false);
		      }
		    };

		    fetchProducts();
		  }, []);

      useEffect(() => {
        console.log("Updated products:", products);
      }, [products]);

      
              const addToCart =(itemId)=>{
                setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
                console.log("Cart after adding item:",cartItems);

              }
              const removeFromCart =(itemId)=>{
                setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
              }


              const getTotalCartAmount =()=>{
                let totalAmount =0;
                for(const item in cartItems){
                  if(cartItems[item]>0){
                    let itemInfo =products.find((product)=>product.id===item);
                    totalAmount += itemInfo.ProductPrice * cartItems[item];
                  }
                }
                return  totalAmount;
              }


              const getTotalCartItems=()=>{
                let totalItems=0;
                for(const item in cartItems){
                  if(cartItems[item]>0){
                    
                    totalItems += cartItems[item];
                  }
                }
                return totalItems;
              }


             
              const contextValue ={ products,
    loading,cartItems, addToCart,removeFromCart,getTotalCartAmount,getTotalCartItems};

              return (
                          <ShopContext.Provider value={contextValue}  >
                            {props.children}
                          </ShopContext.Provider>
              )

}
export default ShopContextProvider;
