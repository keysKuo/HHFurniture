const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = new Schema({
    name: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Category' },
    bottom: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    slug: { type: String, required: true},
});

module.exports = mongoose.model('Category', Category);