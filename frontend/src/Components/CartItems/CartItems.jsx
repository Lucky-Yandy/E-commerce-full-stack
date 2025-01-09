import React, { useContext,useState,useEffect } from 'react'
import './CartItem.css'
import { ShopContext } from '../../Context/ShopContext'
import cross from '../Assets/cross.png'
import  AuthContext  from '../../Context/LoginAuthProvider'
//import AddressForm from '../AddressForm/AddressForm'
const CartItems = () => {
       const {getTotalCartAmount, products,cartItems,removeFromCart} =useContext(ShopContext);
       const { auth } = useContext(AuthContext); 
       const [errorMessage, setErrorMessage] = useState('');
       console.log("this is cartitems:",cartItems);
      
  //address
   /*   const [address, setAddress] = useState({
        address1:'',
        address2: '',
        city: '',
        state: '',
        country:'',
        postalCode: '',
    });
    const [showAddressForm, setShowAddressForm] = useState(false);


    const closeAddressForm = () => {
      setShowAddressForm(false); // Hide the Address form
    };
  
    const validateAddress = () => {
      const { address1, city, state, country, postalCode } = address;
      return address1.trim() && city.trim() && state.trim() && country.trim() && postalCode.trim();
    };


    const handleAddressSubmit = (e) => {
      e.preventDefault();
      if (!validateAddress()) {
        setErrorMessage('Please fill in all required address fields.');
        return;
      }
      setShowAddressForm(false); // Close the form
      setErrorMessage('');
      alert('Address saved successfully!');
    };
  
  console.log(address);

     */  //const token = localStorage.getItem('authToken');
      

       //submit order
       const SubmitOrder = async (e) => {
        e.preventDefault();
        
        //const token = localStorage.getItem("authToken"); // Get token from localStorage for authentication
        if (!auth.id) {
          alert("You must be logged in to submit an order.");
          return;
        }

        //check if the auth.address is false 
        /*if(!auth.shippingAddress &&!validateAddress()){
          setShowAddressForm(true);
          setErrorMessage('Please provide a valid address.');
          return;
        }*/
    
        // Prepare order data (including product details from cart)
        const orderItems = products
          .filter((product) => cartItems[product.id] > 0) // Only include products that are in the cart
          .map((product) => ({
            productId: product.id,
            name: product.ProductName,
            price: product.ProductPrice, 
            image: product.ProductImage[0]?.url,
            quantity: cartItems[product.id],
            description:product.ProductDescription,
            total: (product.ProductPrice * cartItems[product.id]).toFixed(2),
          }));
    
       
        const orderData = {
         
          orderItems,
          totalAmount: getTotalCartAmount(),
          //shippingAddress: address,
          auth,
         // status: 'Pending', // Default order status
        };
        console.log("the data will be submited",orderData);
    
        try {
          const response = await fetch('http://localhost:5000/api/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
          });
    
          const result = await response.json();
    
          if (result.url) {
            // Redirect user to Stripe Checkout
            window.location.href = result.url;
            // Optionally: clear the cart (if desired)
            // clearCart();
          } else {
            // Handle error from server
            setErrorMessage(result.message || "An error occurred while placing the order.");
          }
        } catch (error) {
          console.error("Error submitting order:", error);
          setErrorMessage("An error occurred while placing the order. Please try again later.");
        }
      };
     
  return (
    <div className='cartitems'>
      <table className='cart-table'>
    <thead>
      <tr className='cart-table-header'>
        <th>Product</th>
        <th>Title</th>
        <th>Size</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Total</th>
        <th>Remove</th>
      </tr>
    </thead>
    <tbody>
      {products.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <tr key={e.id} className='cart-table-row'>
              <td>
                <img src={e.ProductImage[0].url} alt={e.ProductName} className='carticon-product-icon' />
              </td>
              <td>{e.ProductName}</td>
              <td>{e.Size}</td>
              <td>${e.ProductPrice.toFixed(2)}</td>
              <td>
                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
              </td>
              <td>${(e.ProductPrice * cartItems[e.id]).toFixed(2)}</td>
              <td>
                <img
                  className='cartitems-remove-icon'
                  src={cross}
                  alt='Remove'
                  onClick={() => removeFromCart(e.id)}
                />
              </td>
            </tr>
          );
        }
        return null;
      })}
    </tbody>
  </table>
    <div className="cartitems-down">
      <div className="cartitems-total">
              <h2>cart Totals</h2>
              <div>
                  <div className="cartitems-total-item">
                            <p>Subtatal</p>
                            <p>${getTotalCartAmount()}</p>
                  </div> 
                  <hr/>
                  <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p> Free</p>
                  </div>  
                  <hr/>
                  <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>${getTotalCartAmount()}</h3>
                  </div>    
              </div>
              <button onClick={SubmitOrder}>Proceed to checkout</button>
      </div>
      
    </div>
    {/*showAddressForm && (
        <AddressForm
          address={address}
          setAddress={setAddress}
          closeAddressForm={closeAddressForm} 
          onSubmit={handleAddressSubmit}
        />
      )*/}
      {errorMessage && <p className="error-message">{errorMessage}</p>}


    </div>
  )
}

export default CartItems;
