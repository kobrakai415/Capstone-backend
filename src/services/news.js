import express from 'express';
import axios from 'axios'

const newsRoute = express.Router()


newsRoute.get("/news/:symbol", async ( req, res, next) => {
    try {
        const response = await fetch(`https://stocknewsapi.com/api/v1?tickers=${req.params.symbol}&items=50&token=${process.env.STOCKNEWS_KEY}`)
        
        if(response.ok){
            const json = await res.json()
            res.status(200).send(json)
        }
        
    } catch (error) {
        next(error)
    }
})