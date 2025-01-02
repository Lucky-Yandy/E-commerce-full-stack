// productController.js
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const base = require('../airtable');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();


const getProducts = async (req, res) => {
    try {
        const products = [];
        await new Promise((resolve, reject) => {
            base('Products')
                .select()
                .eachPage(async (records, fetchNextPage) => {
                    try {
                        const promises = records.map(async (record) => {
                            products.push({
                                id: record.id,
                                ...record.fields, // Add the category name
                            });
                        });

                        await Promise.all(promises);
                        fetchNextPage();
                    } catch (err) {
                        reject(err);
                    }
                }, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
        });

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getProducts };
