import express from 'express';
import PositionModel from '../../models/positions/schema'

const router = express.Router()

router.post("/stock/buy", async (req, res, next) => {
try {
    const stock = await PositionModel.find({"stock": req.body.stock })

    if(!stock){
        const newPosition = new PositionModel(req.body)
        const savedPosition = await newPosition.save()
        console.log(savedPosition)
    }   
} catch (error) {
    next(error)
}
})