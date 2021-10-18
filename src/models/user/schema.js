import mongoose from "mongoose"
import bcrypt from "bcrypt"
import createError from "create-error"

const { model, Schema } = mongoose


const UserSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    startingBalance: { type: Number, required: true },
    balance: { type: Number, required: true },
    followers: {type: Schema.Types.ObjectId, ref: "User" },
    following: {type: Schema.Types.ObjectId, ref: "User" },
    portfolio: [{ type: Schema.Types.ObjectId, ref: "Position" }],
    progress: [{
        balance: { type: Number, required: true },
        date: { type: String, required: true }
    }],
    watchlists: [{ type: Schema.Types.ObjectId, ref: "Watchlist" }],
    refreshToken: { type: String }

})

UserSchema.post("validate", (error, doc, next) => {
    if (error) {
        console.log(error)
        next(error)
    }
})
UserSchema.pre("save", async function (next) {
    const newUser = this

    const plainPw = newUser.password

    if (newUser.isModified("password")) {
        newUser.password = await bcrypt.hash(plainPw, 10)
    }
    next()
})

UserSchema.statics.checkCredentials = async function (email, plainPw) {

    const user = await this.findOne({ email })

    if (user) {

        const hashedPw = user.password

        const match = await bcrypt.compare(plainPw, hashedPw)

        if (match) return user

        else return null

    } else {
        return null
    }
}

UserSchema.methods.toJSON = function () {

    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.__v
    delete userObject.email
    delete userObject.refreshToken
    return userObject
}

export default new model("User", UserSchema)