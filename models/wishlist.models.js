const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
})

const Wishlist = mongoose.model('Wishlist', wishlistSchema)

module.exports = Wishlist