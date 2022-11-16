const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Customers = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    company_name: { type: String },
    tax_no: { type: String },
    company_adress: { type: String },
    note: { type: String }
});

module.exports = mongoose.model('Customers', Customers);
