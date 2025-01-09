
const base = require('../airtable');

const createOrder = async (orderItems, totalAmount, customerId) => {

    const orderTable = 'Orders';
    const cartItemTable = 'CartItems';

    try {
       
        const [latestOrder] = await base('Orders')
            .select({
                fields: ['OrderID'],
                sort: [{ field: 'OrderID', direction: 'desc' }],
                maxRecords: 1,
            })
            .firstPage();

        const nextOrderId = latestOrder
            ? `ORD${String(parseInt(latestOrder.get('OrderID').replace('ORD', ''), 10) + 1).padStart(3, '0')}`
            : 'ORD001';

        // Step 4: Create the order
        const newOrder = await base('Orders').create({
            OrderID: nextOrderId,
            CustomerID: customerId,
            TotalPrice: totalAmount,
           
        });
        const orderId = newOrder.fields.OrderID;

        // Step 5: Create cart items in bulk
        const cartItemData = orderItems.map((item) => ({
            fields: {
              // Uses timestamp and index
                Product: [item.productId],
                OrderId: orderId,
                Quantity: item.quantity,
                PricePerUnit: item.price,
                
            },
        }));
        await base('CartItems').create(cartItemData);

        return newOrder;
    } catch (error) {
        console.error('Error in createOrder:', error);
        throw error;
    }
};

module.exports = { createOrder };































/*const base = require('../airtable'); // Replace with actual Airtable setup

const createOrder = async (orderData) => {
    const { customerId, orderItems, totalAmount, shippingAddress } = orderData;

    const orderTable = 'Orders';
    const customerTable = 'Customers';
    const cartItemTable = 'CartItems';
    const addressTable = 'ShippingAddresses';

    // Step 1: Fetch the customer record ID
    const customerRecords = await base(customerTable).select({
        filterByFormula: `{CustomerID} = "${customerId}"`
    }).firstPage();

    if (customerRecords.length === 0) {
        throw new Error(`Customer with ID ${customerId} not found.`);
    }

    const customerRecordId = customerRecords[0].id;

    // Step 2: Create the shipping address
  /*  const addressRecord = await base(addressTable).create({
        AddressLine1: shippingAddress.address1,
        AddressLine2: shippingAddress.address2,
        City: shippingAddress.city,
        State: shippingAddress.state,
        PostalCode: shippingAddress.postalCode,
        Country: shippingAddress.country,
        Customer: [customerRecordId]
    });

    //const addressRecordId = addressRecord.id;

    // Step 3: Generate the next order ID
    const records = await base(orderTable).select({
        fields: ['OrderID'],
        sort: [{ field: 'OrderID', direction: 'desc' }],
        maxRecords: 1
    }).firstPage();

    let nextOrderId = 'ORD001';
    if (records.length > 0) {
        const highestId = records[0].get('OrderID');
        const numericPart = parseInt(highestId.replace('ORD', ''), 10);
        nextOrderId = `ORD${String(numericPart + 1).padStart(3, '0')}`;
    }

    // Step 4: Create the order
    const newOrder = await base(orderTable).create({
        OrderID: nextOrderId,
        Customer: [customerRecordId],
        TotalPrice: totalAmount,
        //ShippingAddress: [addressRecordId]
    });

    const orderId = newOrder.id;

    // Step 5: Create cart items
    const existingCartItems = await base(cartItemTable).select({
        fields: ['CartItemID'],
        sort: [{ field: 'CartItemID', direction: 'desc' }],
        maxRecords: 1
    }).firstPage();

    let currentCartItemCount = 1000;
    if (existingCartItems.length > 0) {
        const highestCartItemId = existingCartItems[0].get('CartItemID');
        const numericPart = parseInt(highestCartItemId.replace('CART', ''), 10);
        currentCartItemCount = numericPart;
    }

    const cartItemPromises = orderItems.map((item, index) => {
        const cartItemId = `CART${(currentCartItemCount + index + 1).toString()}`;
        const totalItemPrice = parseFloat(item.total);
        if (isNaN(totalItemPrice)) {
            throw new Error(`Invalid total for item: ${item.name}`);
        }

        return base(cartItemTable).create({
            CartItemID: cartItemId,
            Product: [item.productId],
            OrderId: [orderId],
            Quantity: item.quantity,
            PricePerUnit: item.price,
            TotalPrice: totalItemPrice
        });
    });

    await Promise.all(cartItemPromises);

    return newOrder;
};

 */   
   
    


/*const createOrder = async (customerId, orderItems, totalAmount, shippingAddress) => {
    try {
        const customerTable = "Customers";
        const orderTable = "Orders";
        const cartItemTable = "CartItems";
        const addressTable = "ShippingAddresses";
        //const productTable = "Products";

        // Step 1: Fetch the customer record ID
        const customerRecords = await base(customerTable).select({
            filterByFormula: `{CustomerID} = "${customerId}"`
        }).firstPage();

        if (customerRecords.length === 0) {
            throw new Error(`Customer with ID ${customerId} not found.`);
        }
        const customerRecordId = customerRecords[0].id;

        console.log("Customer Record ID:", customerRecordId);
        if (!customerRecordId) {
            throw new Error(`Customer with ID ${customerId} not found.`);
        }
        

        // Step 2: Create the shipping address
        const addressRecord = await base(addressTable).create({
            AddressLine1: shippingAddress.address1 || "",
            AddressLine2: shippingAddress.address2 || "",
            City: shippingAddress.city || "",
            State: shippingAddress.state || "",
            PostalCode: shippingAddress.postalCode || "",
            Country: shippingAddress.country || "",
            Phone: shippingAddress.phone || "",
            Customer: [customerRecordId]
        });
        
        let addressRecordId;
            addressRecordId=addressRecord.id;
            console.log("addressrecordid is",addressRecordId);

        if (!addressRecord.id) {
            throw new Error("Shipping address creation failed. ID is null.");
        }
        
        // Step 3: Generate the next order ID
        const records = await base(orderTable).select({
            fields: ['OrderID'],
            sort: [{ field: 'OrderID', direction: 'desc' }],
            maxRecords: 1
        }).firstPage();

        let nextOrderId = 'ORD001';
        if (records.length > 0) {
            const highestId = records[0].get('OrderID');
            const numericPart = parseInt(highestId.replace('ORD', ''), 10);
            nextOrderId = `ORD${String(numericPart + 1).padStart(3, '0')}`;
        }

        // Step 4: Create the order
        const newOrder = await base(orderTable).create({
            OrderID: nextOrderId,
            Customer: [customerRecordId],
            TotalPrice: totalAmount,
            ShippingAddress: [addressRecordId]
        });
        
        const orderId = newOrder.id;

        // Step 5: Create cart items
        const existingCartItems = await base(cartItemTable).select({
            fields: ['CartItemID'],
            sort: [{ field: 'CartItemID', direction: 'desc' }],
            maxRecords: 1
        }).firstPage();
    
        let currentCartItemCount = 1000;
        if (existingCartItems.length > 0) {
            const highestCartItemId = existingCartItems[0].get('CartItemID');
            const numericPart = parseInt(highestCartItemId.replace('CART', ''), 10);
            currentCartItemCount = numericPart;
        }
    
        const cartItemPromises = orderItems.map((item, index) => {
            const cartItemId = `CART${(currentCartItemCount + index + 1).toString()}`;
           
    
            return base(cartItemTable).create({
                CartItemID: cartItemId,
                Product: [item.productId],
                OrderId: [orderId],
                Quantity: item.quantity,
                
            });
        });
    
        await Promise.all(cartItemPromises);
    
        return newOrder;
    } catch (error) {
        console.error("Error in createOrder:", error.message || error);
        throw error;
    }
};*/

//module.exports = { createOrder };
