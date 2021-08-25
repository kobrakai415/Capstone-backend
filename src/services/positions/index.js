import express from 'express';
import PositionModel from '../../models/positions/schema.js'
import UserModel from '../../models/user/schema.js'
import { JwtAuthenticateToken } from '../../auth/JWT.js'


const router = express.Router()

router.post("/buy", JwtAuthenticateToken, async (req, res, next) => {
    try {
        // if insufficient funds
        const transactionValue = req.body.purchasePrice * req.body.shares
        if (req.user.balance < transactionValue) (next(createError(400, "Insufficient funds!")))

        // check if user has a position 
        // const existingPosition = await PositionModel.findOne({ owner: req.user._id, stock: req.body.stock })
        // console.log("existing", existingPosition)

        // // add to existing position 

        // if (existingPosition) {
        //     const averagePrice = (existingPosition.purchasePrice + req.body.purchasePrice) / 2
        //     const shares = existingPosition.shares + req.body.shares

        //     existingPosition.shares = shares 
        //     existingPosition.purchasePrice = averagePrice
        //     const saved = await existingPosition.save()
        //     console.log("saved", saved)
        // }
        if (true) {

            const entry = new PositionModel(req.body)
            const result = await entry.save()
            console.log(result)

            const res = await UserModel.findByIdAndUpdate(req.user._id, { $addToSet: { portfolio: result._id } })
            console.log(res)
        }

        
    } catch (error) {

        next(error)
    }
})



export default router
// const existingPosition = await UserModel.find({_id: req.user._id, positions: {"$in": }})
// const addPositionToUser = await req.user.portfolio.push(savedPosition._id).save()
// console.log("added", addPositionToUser)

// res.send(savedPosition)
// if (!existingPosition) {
//     const newPosition = new PositionModel(req.body)
//     const savedPosition = await newPosition.save()
//     res.send(savedPosition)
//     console.log(savedPosition)
// }