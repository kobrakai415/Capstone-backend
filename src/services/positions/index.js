import express from 'express';
import PositionModel from '../../models/positions/schema.js'
import UserModel from '../../models/user/schema.js'
import { JwtAuthenticateToken } from '../../auth/JWT.js'
import mongoose from 'mongoose';
import createError from 'create-error';


const { isValidObjectId } = mongoose

const router = express.Router()

router.post("/buy", JwtAuthenticateToken, async (req, res, next) => {
    try {
        // if insufficient funds
        const transactionValue = req.body.purchasePrice * req.body.shares
        if (req.user.balance < transactionValue) (next(createError(400, "Insufficient funds!")))

        const entry = new PositionModel(req.body)
        const result = await entry.save()
        console.log(result)

        const user = await UserModel.findByIdAndUpdate(req.user._id,
            {
                $addToSet: { portfolio: result._id }, $set: { balance: req.user.balance - transactionValue }
            }).populate("portfolio")

        console.log(user)

        res.status(200).send(user)



    } catch (error) {

        next(error)
    }
})

router.post("/close", JwtAuthenticateToken, async (req, res, next) => {
    try {
        if (!isValidObjectId(req.body.id)) next(createError(404, `ID ${req.body.id} is invalid`))

        const position = await PositionModel.findByIdAndDelete(req.body.id)

        console.log(position)

        if (position) {

            const user = await UserModel.findByIdAndUpdate(req.user._id,
                {
                    $pull: { portfolio: req.body.id }, $set: { balance: req.user.balance + req.body.sell }
                }).populate("portfolio")
            
                console.log(user)
            user ? res.status(200).send(user) : next(createError(400, "Error updating user portfolio, try again!"))

        } else {
            next(createError(400, `Position with ${req.body.id} not found!`))
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})



export default router
