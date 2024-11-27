const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    images: {
        type: [String],
        required: true
    },
    category: {
        type: String,
        enum: ['Men', 'Women', 'Kids', 'Infants'],
        required: true
    },
    size: {
        type: [String],
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    stockCount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    reviews: [
        {
            name: {
                type: String,
            },
            review: {
                type: String,
            }
        }
    ]
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)

module.exports = Product