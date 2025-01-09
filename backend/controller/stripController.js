const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const base = require('../airtable');
const app = express();
const jwt = require('jsonwebtoken');
const { createOrder }  = require('./orderRecordCreation')



require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace with your secret key
//console.log(stripe);



const payment= async (req, res) => {
            
        const { orderItems, auth} = req.body; 
      
       
  
        const customer = await stripe.customers.create({
          metadata: {
            cart: JSON.stringify(orderItems.map(item => ({
              productId: item.productId,
              quantity:item.quantity
          }))),
          auth_id: auth.id, 
          },
        });
        

      //  console.log("this is the order items",orderItems);
        //console.log("auth",auth);
       

        if (!orderItems || !orderItems.length) {
          return res.status(400).json({ message: "No order items provided." });
        }



        const lineItems = orderItems.map((item) => ({
          price_data: {
              currency: 'usd',
              product_data: {
                  name: item.name,
                  images: item.image ? [item.image] : [],
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
               payment_method_types: ["card"],
               shipping_address_collection: {
                allowed_countries: ["US", "CA"],
              },
              shipping_options: [
                {
                  shipping_rate_data: {
                    type: "fixed_amount",
                    fixed_amount: {
                      amount: 0,
                      currency: "usd",
                    },
                    display_name: "Free shipping",
                    // Delivers between 5-7 business days
                    delivery_estimate: {
                      minimum: {
                        unit: "business_day",
                        value: 5,
                      },
                      maximum: {
                        unit: "business_day",
                        value: 7,
                      },
                    },
                  },
                },
                {
                  shipping_rate_data: {
                    type: "fixed_amount",
                    fixed_amount: {
                      amount: 1500,
                      currency: "usd",
                    },
                    display_name: "Next day air",
                    // Delivers in exactly 1 business day
                    delivery_estimate: {
                      minimum: {
                        unit: "business_day",
                        value: 1,
                      },
                      maximum: {
                        unit: "business_day",
                        value: 1,
                      },
                    },
                  },
                },
              ],
              phone_number_collection: {
                enabled: true,
              },

               line_items:lineItems,
                mode: 'payment',
                customer: customer.id,
                success_url: `${process.env.CLIENT_URL}/checkout-success`,
                cancel_url: `${process.env.CLIENT_URL}/cart`,
                
              });
            
              res.send({url:session.url});

             

 };


            
  module.exports = {payment};     



  
  /* const customerId=auth.id;
  const newOrder=await createOrder(orderItems, totalAmount, customerId);
  const OrderID = newOrder.fields.OrderID;
  console.log("newOrder.fields.OrderID",OrderID)*/