import express from 'express';
import PositionModel from '../../models/positions/schema.js'
import UserModel from '../../models/user/schema.js'
import { JwtAuthenticateToken } from '../../auth/JWT.js'


const router = express.Router()

router.post("/buy", JwtAuthenticateToken, async (req, res, next) => {
    try {
        console.log(req)

        // const stock = await PositionModel.find({ "stock": req.body.stock })
        // console.log(stock)
        // if (stock) {
        //     const newPosition = new PositionModel(req.body)
        //     const savedPosition = await newPosition.save()
        //     res.send(savedPosition)
        //     console.log(savedPosition)
        // }
    } catch (error) {
        next(error)
    }
})

export default router