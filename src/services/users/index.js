import express from "express"
import UserModel from "../../models/user/schema.js"
import createError from "http-errors"
import { LoginValidator } from "../../helpers/validators.js"
import { JwtAuthenticateUser, JwtAuthenticateToken, verifyAccessToken } from "../../auth/JWT.js"
import { validationResult } from "express-validator"


const router = express.Router()

router.post("/register", async (req, res, next) => {
    try {

        const newUser = new UserModel(req.body)
        const user = await newUser.save()
        console.log(user)

        if (user) {

            const { accessToken, refreshToken } = await JwtAuthenticateUser(user)
            res.cookie("accessToken", accessToken, {})
            res.cookie("refreshToken", refreshToken, { httpOnly: true })

            res.status(201).send(user)
            console.log(res)
        } else {
            next(createError(400, "Error creating new user, please try again!"))
        }

    } catch (error) {
        next(error)
    }
})

router.post("/login", LoginValidator, async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) next(createError(400, errors.mapped()))

        const { email, password } = req.body
        const user = await UserModel.checkCredentials(email, password)

        if (user) {

            const { accessToken, refreshToken } = await JwtAuthenticateUser(user)
            res.cookie("accessToken", accessToken)
            res.cookie("refreshToken", refreshToken)

            res.send(user)
        } else {
            next(createError(404, "User not found, check credentials!"))
        }
    } catch (error) {
        next(error)
    }
})

router.post("/refreshToken", async (req, res, next) => {
    try {
        if (!req.cookies.refreshToken) next(createError(400, "Refresh Token not provided"))
        else {
            const { newAccessToken, newRefreshToken } = await refreshTokens(req.cookies.refreshToken)
            res.cookie("accessToken", newAccessToken,)
            res.cookie("refreshToken", newRefreshToken, { path: "/users/refreshToken" })
            res.send("OK")
        }
    } catch (error) {
        next(error)
    }


})

router.post("/checkAccessToken", async (req, res, next) => {
    try {
        if (!req.cookies.accessToken) next(createError(400, "No accessToken provided"))

        const checkToken = await verifyAccessToken(req.cookies.accessToken)

        if (checkToken._id) {
            const user = await UserModel.findById(checkToken._id).populate("portfolio")

            res.status(200).send(user)
        } else {
            next(createError(400, "JWT EXPIRED!"))
        }

    } catch (error) {
        next(error)
    }
})


export default router