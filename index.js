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
        const wishlist = await Wishlist.find().populate('product')
        if(wishlist.length != 0) {
            res.json(wishlist)
        } else {
            res.status(404).json({error: "No wishlist products found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch wishlist."})
    }
})

app.post('/wishlist', async (req, res) => {
    try {
        const wishlistProduct = new Wishlist(req.body)
        const savedWishlistProduct = await wishlistProduct.save()
        if(savedWishlistProduct) {
            res.status(201).json({message: "Wishlist product added successfully.", wishlistProduct: savedWishlistProduct.populate('product')})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to add wishlist product."})
    }
})

app.delete('/wishlist/:productId', async (req, res) => {
    const productId = req.params.productId
    try {
        const deletedWishlistProduct = await Wishlist.findOneAndDelete({ product: productId })
        if(deletedWishlistProduct) {
            res.status(200).json({message: "Wishlist product deleted successfully", wishlistProduct: deletedWishlistProduct})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to delete wishlist product."})
    }
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})