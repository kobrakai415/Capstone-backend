import mongoose from "mongoose"
import createError from "create-error"

const { model, Schema } = mongoose


const PositionSchema = new Schema({
    stock: { type: String, required: true },
    ticker: { type: String, required: true },
    purchasePrice: { type: Number, required: true},
    shares: { type: Number, required: true },
    purchaseDate: {type: Date, required: true}
})

PositionSchema.post("validate", (error, doc, next) => {
    if (error) {
        const err = createError(400, error)
        next(err)
    } else {
        next(error)
    }
})


export default new model("Position", PositionSchema)