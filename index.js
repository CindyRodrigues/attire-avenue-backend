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

app.use(express.json())

initializeDatabase()

const createProduct = async (newProduct) => {
    try {
        const product = new Product(newProduct)
        const savedProduct = await product.save()
        return savedProduct
    } catch (error) {
        console.log('Error adding product:', error)
    }
}

app.post('/products', async (req, res) => {
    try {
        const savedProduct = await createProduct(req.body)
        if(savedProduct) {
            res.status(201).json({message: "Product added successfully.", product: savedProduct})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to add product."})
    }
})

const getProducts = async () => {
    try {
        const products = await Product.find()
        return products
    } catch (error) {
        console.log('Error getting products:', error)
    }
}

app.get('/products', async (req, res) => {
    try {
        const products = await getProducts()
        if(products.length != 0) {
            res.json(products)
        } else {
            res.status(404).json({error: "No products found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch products."})
    }
})

const getProductById = async (productId) => {
    try {
        const product = await Product.findById(productId)
        return product
    } catch (error) {
        console.log('Error getting product by id:', error)
    }
}

app.get('/products/:productId', async (req, res) => {
    try {
        const product = await getProductById(req.params.productId)
        if(product) {
            res.json(product)
        } else {
            res.status(404).json({error: "Product not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch products."})
    }
})

const getProductsByCategory = async (categoryType) => {
    try {
        const products = await Product.find({category: categoryType})
        return products
    } catch (error) {
        console.log("Error getting products by category:", error)
    }
}

app.get('/products/categories/:category', async (req, res) => {
    try {
        const products = await getProductsByCategory(req.params.category)
        if(products.length != 0) {
            res.json(products)
        } else {
            res.status(404).json({error: "Products not found."})
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch products.'})
    }
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})