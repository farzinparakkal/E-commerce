import mongoose from "mongoose"
const productSchema = new mongoose.Schema({
    sellerID: { type: String },
    name: { type: String },
    category: { type: String },
    price: { type: Number },
    description: { type: String },
    quantity: { type: Number },
    thumbnail: { type: String },
    images: { type: Array },
})

export default mongoose.model.products||mongoose.model('products',productSchema)