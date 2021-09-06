import mongoose from "mongoose"

const { model, Schema } = mongoose


const CommentSchema = new Schema({
    comment: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true }
},
    { timestamps: true })


CommentSchema.post("validate", (error, doc, next) => {
    if (error) {
        next(error)
    }
})

export default new model("Comment", CommentSchema)