import mongoose from "mongoose"
import createError from "create-error"

const { model, Schema } = mongoose


const PostSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ticker: { type: String, required: true },
    stock: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: "https://www.nasdaq.com/sites/acquia.prod/files/image/29525db076bcc42505a356e55dbe94f38b28530b_getty-stock-market-data.jpg?2103543812" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }]
},
    { timestamps: true })


PostSchema.post("validate", (error, doc, next) => {
    if (error) {
        next(error)
    }
})

export default new model("Post", PostSchema)