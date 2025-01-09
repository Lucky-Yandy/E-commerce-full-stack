const express = require('express');
const cors = require('cors');
const app = express();
const { createOrder } =require('./controller/orderRecordCreation');
require('dotenv').config();



//import from controller
const { getProducts } = require('./controller/productController');
const { registerUser } = require('./controller/registerController');
const { userLogin } = require('./controller/loginController');
const {payment} = require('./controller/stripController')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
//const STRIPE_WEBHOOK_SECRET =process.env.STRIPE_WEBHOOK_SECRET;

const corsOptions = {
    origin: 'http://localhost:3000',  // Allow requests only from this origin
    credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));

app.use(express.json());

app.get('/api/products', getProducts);

app.post('/api/register', registerUser);

app.post('/api/login',userLogin);

app.post('/api/create-checkout-session', payment);


app.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (req, res) => {
    let data;
    let eventType;

    // Check if webhook signing is configured.
    let webhookSecret;
    webhookSecret = process.env.STRIPE_WEB_HOOK;

    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed:  ${err}`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data.object;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the checkout.session.completed event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          try {
            console.log("this is data",data);
            console.log("this is customer",customer)
            // CREATE ORDER
            //createOrder(customer, data);
          } catch (err) {
            console.log(typeof createOrder);
            console.log(err);
          }
        })
        .catch((err) => console.log(err.message));
    }

    res.status(200).end();
  }
);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
