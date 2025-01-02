const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const base = require('../airtable');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();


const  registerUser = async (req, res) => {
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
          };

          module.exports = { registerUser };