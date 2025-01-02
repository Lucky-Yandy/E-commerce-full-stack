const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

//import from controller
const { getProducts } = require('./controller/productController');
const { registerUser } = require('./controller/registerController');
const { userLogin } = require('./controller/loginController');
const {payment} = require('./controller/stripController')



const corsOptions = {
    origin: 'http://localhost:3000',  // Allow requests only from this origin
    credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));

app.use(express.json());

app.get('/api/products', getProducts);

app.post('/api/register', registerUser);

app.post('/api/login',userLogin);

app.post('/api/create-checkout-session', payment)



/*
app.post('/api/orders',  async (req, res) => {
    const { customerId, orderItems, totalAmount,shippingAddress } = req.body; 
    console.log('Received Order Data:', { customerId, orderItems, totalAmount });
    console.log("shipping address",shippingAddress);
    try {
        const orderTable = 'Orders';
        const customerTable = 'Customers'; // Name of the linked table
        const cartItemTable = 'CartItems';
       
        // Step 1: Fetch the record ID for the customer
        const customerRecords = await base(customerTable).select({
        filterByFormula: `{CustomerID} = "${customerId}"` // Adjust field name as per your schema
        }).firstPage();

        if (customerRecords.length === 0) {
        return res.status(404).json({ message: `Customer with ID ${customerId} not found.` });
        }

        const customerRecordId = customerRecords[0].id; 
         // Get the linked record ID
         console.log('Linked Customer Record ID:', customerRecordId);
        
        
// create address
         const addressTable ='ShippingAddresses';
         const addressRecord = await base(addressTable).create({
           AddressLine1: shippingAddress.address1,
           AddressLine2: shippingAddress.address2,// assuming your address has a field called 'Street'
            City: shippingAddress.city,
            State: shippingAddress.state,
            PostalCode: shippingAddress.postalCode,
            Country: shippingAddress.country,
            Customer:[customerRecordId]
        });

        const addressRecordId = addressRecord.id;
        console.log('Created Shipping Address Record ID:', addressRecordId);


       
         // generateid
        const records = await base(orderTable).select({
            fields: ['OrderID'], // Only fetch the customerId field
            sort: [{ field: 'OrderID', direction: 'desc' }], // Sort in descending order
            maxRecords: 1 // Get the highest customerId
        }).firstPage();

        let nextOrderId = 'ORD001'; // Default starting ID if no records exist

        if (records.length > 0) {
            const highestId = records[0].get('OrderID'); // Get the highest customerId
            const numericPart = parseInt(highestId.replace('ORD', ''), 10); // Extract numeric part
            nextOrderId = `ORD${String(numericPart + 1).padStart(3, '0')}`; // Increment and format
        }

       

        // Create a new record in Airtable with hashed password
        const newRecord = await base(orderTable).create({
            OrderID:  nextOrderId,
            Customer: [customerRecordId],
            TotalPrice:totalAmount,
            ShippingAddress: [addressRecordId]
            // Store the hashed password
        });

      

        const orderId = newRecord.id; // Airtable's system-generated record ID
         console.log('Created System OrderID:', orderId);  
     //create cartitem records
    
    
    
    // Get the length of the cartItemsRecords array
   
    const existingCartItems = await base(cartItemTable).select({
        fields: ['CartItemID'], // Only fetch CartItemID field
        sort: [{ field: 'CartItemID', direction: 'desc' }], // Sort to get the highest ID first
        maxRecords: 1 // Only get the highest record
    }).firstPage();

    // Extract the highest CartItemID number
    let currentCartItemCount = 1000; // Default starting point if no records exist
    if (existingCartItems.length > 0) {
        const highestCartItemId = existingCartItems[0].get('CartItemID'); // Get the highest CartItemID
        const numericPart = parseInt(highestCartItemId.replace('CART', ''), 10); // Extract numeric part
        currentCartItemCount = numericPart; // Set the highest CartItemID number
}




     const cartItemPromises = orderItems.map((item,index) => {
          const cartItemId = `CART${(currentCartItemCount + index + 1).toString()}`;
        const totalItemPrice = parseFloat(item.total);
        if (isNaN(totalItemPrice)) {
            throw new Error(`Invalid total for item: ${item.name}`);
        }

        

        return base(cartItemTable).create({
          CartItemID:cartItemId,
       
          Product: [item.productId], // Linked record
          OrderId: [orderId],  // Linked record to the Order table
          Quantity: item.quantity,
          PricePerUnit: item.price,
          TotalPrice: totalItemPrice

        });
      });
  
      // Wait for all CartItem records to be created
      const cartItemRecords = await Promise.all(cartItemPromises);


        console.log("new order",newRecord);
        // Respond with the created record details
        return res.status(201).json({
            message: 'order created successfully.',
            data: newRecord
        });
    } catch (error) {
        console.error('Error creating record:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }


});*/






const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
