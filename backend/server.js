const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const base = require('./airtable');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();


const corsOptions = {
    origin: 'http://localhost:3000',  // Allow requests only from this origin
    credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));

app.use(express.json());

app.get('/api/products', async (req, res) => {
    try {
        const products = [];
        // Use async/await with eachPage to ensure you fetch all pages of data
        await new Promise((resolve, reject) => {
            base('Products')
                .select()
                .eachPage(async (records, fetchNextPage) => {
                    try {
                        const promises = records.map(async (record) => {
                            
                          
                            products.push({
                                id: record.id,
                                ...record.fields, // Add the category name
                               
                                        // Add the image URLs
                            });
                        });
            
                        // Wait for all promises to resolve before fetching the next page
                        await Promise.all(promises);
                        fetchNextPage();
                    } catch (err) {
                        reject(err); // Reject if any error occurs in processing records
                    }
                }, (err) => {
                    if (err) {
                        reject(err); // Reject if an error occurs in fetching pages
                    } else {
                        resolve(); // Resolve when all pages are processed
                    }
                });
        });

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// post sign up
app.post('/api/register', async (req, res) => {
    const { user, email, pwd } = req.body;
  
 
    try {
        const tableName = 'Customers';
        // Check if the user or email already exists in Airtable
        const existingRecords = await base(tableName).select({
            filterByFormula: `OR(CustomerName = "${user}", Email = "${email}")`
        }).firstPage();

        if (existingRecords.length > 0) {
            return res.status(409).json({ message: 'Username or email already exists.' });
        }
         // generateid
        const records = await base(tableName).select({
            fields: ['CustomerID'], // Only fetch the customerId field
            sort: [{ field: 'CustomerID', direction: 'desc' }], // Sort in descending order
            maxRecords: 1 // Get the highest customerId
        }).firstPage();

        let nextCustomerId = 'CUST001'; // Default starting ID if no records exist

        if (records.length > 0) {
            const highestId = records[0].get('CustomerID'); // Get the highest customerId
            const numericPart = parseInt(highestId.replace('CUST', ''), 10); // Extract numeric part
            nextCustomerId = `CUST${String(numericPart + 1).padStart(3, '0')}`; // Increment and format
        }





        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(pwd, saltRounds);

        // Create a new record in Airtable with hashed password
        const newRecord = await base(tableName).create({
            CustomerID: nextCustomerId,
            CustomerName: user,
            Email: email,
            Password: hashedPassword // Store the hashed password
        });

        // Respond with the created record details
        return res.status(201).json({
            message: 'User registered successfully.',
            data: newRecord
        });
    } catch (error) {
        console.error('Error creating record:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});


// post login
app.post('/api/login', async (req, res) => {
    const { user, pwd } = req.body;
    console.log('Incoming login request:', { user, pwd });
    try {
        const tableName = 'Customers';

        // Find user by username or email
        const records = await base(tableName).select({
            filterByFormula: `OR(CustomerName = "${user}", Email = "${user}")`
        }).firstPage();

        if (records.length === 0) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found.' });
        }

        const foundUser = records[0].fields; // Get user details

        // Compare provided password with stored hashed password
        const isPasswordValid = await bcrypt.compare(pwd, foundUser.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Optionally: Generate a token (e.g., JWT) for authentication
        const token = jwt.sign({ userId: foundUser.CustomerID }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            message: 'Login successful.',
            token: token, // Return token to the frontend for subsequent requests
            user:  {
                id: foundUser.CustomerID,
                name: foundUser.CustomerName,
                email: foundUser.Email,
                address: foundUser.Address, // Include address
                phone: foundUser.PhoneNumber, // Include phone number
                shippingAddress:foundUser.ShippingAddress,
                orderHistory:foundUser.OrderHistory,
                PaymentMethod:foundUser.PaymentMethods,
                cartItems:foundUser.CartItems,
                reviews:foundUser.Reviews

            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});



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


});






const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
