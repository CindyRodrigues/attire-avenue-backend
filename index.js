require('dotenv').config()

const express = require('express')

const app = express()

const cors = require('cors')

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions))

const { initializeDatabase } = require('./database/db.connect')
const Product = require('./models/products.models')
const Wishlist = require('./models/wishlist.models')
const Cart = require('./models/cart.models')

app.use(express.json())

initializeDatabase()

app.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body)
        const savedProduct = await product.save()
        if(savedProduct) {
            res.status(201).json({message: "Product added successfully.", product: savedProduct})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to add product."})
    }
})

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find()
        if(products.length != 0) {
            res.json(products)
        } else {
            res.status(404).json({error: "No products found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch products."})
    }
})

// app.get('/products/:productId', async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.productId)
//         if(product) {
//             res.json(product)
//         } else {
//             res.status(404).json({error: "No product found."})
//         }
//     } catch (error) {
//         res.status(500).json({error: "Failed to fetch products."})
//     }
// })

app.get('/wishlist', async (req, res) => {
    try {
        const wishlist = await Wishlist.find()
        if(wishlist.length != 0) {
            res.json(wishlist)
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch wishlist items."})
    }
})

app.post('/wishlist', async (req, res) => {
    try {
        const { productId } = req.body
        const wishlistItem = new Wishlist({productId})
        const savedWishlistItem = await wishlistItem.save()
        if(savedWishlistItem) {
            res.status(201).json({message: "Wishlist item added successfully.", wishlistItem: savedWishlistItem})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to add wishlist item."})
    }
})

app.delete('/wishlist/:productId', async (req, res) => {
    const productId = req.params.productId
    try {
        const deletedWishlistItem = await Wishlist.findOneAndDelete({ productId: productId })
        if(deletedWishlistItem) {
            res.status(200).json({message: "Wishlist item deleted successfully", wishlistItem: deletedWishlistItem})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to delete wishlist item."})
    }
})

app.get('/cart', async (req, res) => {
    try {
        const cart = await Cart.find()
        if(cart.length != 0) {
            res.status(200).json(cart)
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch cart items."})
    }
})

app.post('/cart', async (req, res) => {
    try {
        const { productId } = req.body
        const cartItem = new Cart({productId})
        const savedCartItem = await cartItem.save()
        if(savedCartItem) {
            res.status(201).json({message: "Cart item added successfully.", cartItem: savedCartItem})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to add cart item."})
    }
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})