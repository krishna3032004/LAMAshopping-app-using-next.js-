import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    message: { type: String },
    amount: { type: Number, required: true },
    review: [
        {
            name: { type: String, required: true },
            message: { type: String, required: true },
            starmess: { type: String, required: true },
            star: { type: Number, required: true, min: 1 ,max:5},
        },
    ],
    old_amount: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    featured: { type: Boolean, default: false }
})

export default mongoose.models.Product || model("Product", ProductSchema)