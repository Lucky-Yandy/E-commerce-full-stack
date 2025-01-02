const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const base = require('../airtable');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userLogin = async (req, res) => {
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
          }
 module.exports = { userLogin };