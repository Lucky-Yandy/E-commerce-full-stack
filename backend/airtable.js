const Airtable = require('airtable');
require('dotenv').config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

const tableName = 'Products'; // Replace with the name of a table in your Airtable base

/*base(tableName)
    .select({ maxRecords: 1 }) // Retrieve just one record to test
    .firstPage((err, records) => {
        if (err) {
            console.error('Error connecting to Airtable:', err);
            return;
        }
        console.log('Connection successful! Retrieved record:', records[0].fields);
    });

*/


module.exports = base;
