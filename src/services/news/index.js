import express from 'express';
import axios from 'axios';


const newsRoute = express.Router()

newsRoute.get("/news/:symbol", async ( req, res, next) => {
    try {
        const response = await axios.get(`https://stocknewsapi.com/api/v1?tickers=${req.params.symbol}&items=20&token=${process.env.STOCKNEWS_KEY}`)

        if(response.status === 200){
            console.log(response.data.data)
            res.send(response.data.data)
        }
    } catch (error) {
        next(error)
    }
})

export default newsRoute 