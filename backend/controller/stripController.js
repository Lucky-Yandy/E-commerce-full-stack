const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const base = require('../airtable');
const app = express();
const jwt = require('jsonwebtoken');



require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace with your secret key
console.log(stripe);



const payment= async (req, res) => {
            
        const { orderItems,customerId, customerName,shippingAddress} = req.body; 

        console.log("this is the order items",orderItems);
        
        if (!orderItems || !orderItems.length) {
          return res.status(400).json({ message: "No order items provided." });
        }



        const lineItems = orderItems.map((item) => ({
          price_data: {
              currency: 'usd',
              product_data: {
                  name: item.name,
                  images: item.image ? [item.image] : [],
                  description:item.description,
                  metadata:{
                    id:item.id,
                  }
                  
              },
              unit_amount: Math.round(item.price * 100), // Convert dollars to cents
          },
          quantity: item.quantity,
      }));



        const session = await stripe.checkout.sessions.create({
               // you can map the items to strip too
               line_items:lineItems,
                mode: 'payment',
                success_url: `${process.env.CLIENT_URL}/checkout-success`,
                cancel_url: `${process.env.CLIENT_URL}/cart`,
                metadata: {
                  customerId,
                  customerName,
                  
                },
              });
            
              res.send({url:session.url});
            };
            
  module.exports = {payment};          