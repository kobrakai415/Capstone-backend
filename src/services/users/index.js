import express from "express"
import UserModel from "../../models/user/schema.js"
import createError from "http-errors"
import { LoginValidator } from "../../helpers/validators.js"
import { JwtAuthenticateUser } from "../../auth/JWT.js"
import { JwtAuthenticateToken } from "../../auth/JWT.js"
import { validationResult } from "express-validator"


const router = express.Router()

router.post("/register", async (req, res, next) => {
    try {

        const newUser = new UserModel(req.body)

        const user = await newUser.save()

        if (user) {

            const { accessToken, refreshToken } = await JwtAuthenticateUser(user)
            res.cookie("accessToken", accessToken, { httpOnly: true })
            res.cookie("refreshToken", refreshToken, { httpOnly: true })

            res.status(201).send(user)

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
            res.cookie("accessToken", accessToken, { httpOnly: true })
            res.cookie("refreshToken", refreshToken, { httpOnly: true })

            res.send()
        } else {
            next(createError(404, "User not found, check credentials!"))
        }
    } catch (error) {
        next(error)
    }
})

router.post("/refreshToken", JwtAuthenticateToken,)


export default router