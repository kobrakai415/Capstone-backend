import createError from "create-error"
import jwt from "jsonwebtoken"
import UserModel from "../models/user/schema.js"

const secret = process.env.JWT_SECRET
const refreshSecret = process.env.JWT_REFRESH_SECRET

export const JwtAuthenticateToken = async (req, res, next) => {
    console.log(req.cookies)
    if (!req.cookies.accessToken) {
        next( (400, "Please provide a bearer token!"))
    } else {

        try {
            const token = req.cookies.accessToken
            const payload = await verifyAccessToken(token)

            const user = await UserModel.findById(payload._id)
            console.log(user)
            if (user) {
                req.user = user
                next()
            } else {
                next(createError(404, "User not found!"))
            }

        } catch (error) {
            next(error)
        }
    }
}

export const JwtAuthenticateUser = async (user) => {
    const accessToken = await generateAccessToken({ _id: user._id })
    const refreshToken = await generateRefreshToken({ _id: user._id })

    user.refreshToken = refreshToken
    await user.save()

    return { accessToken, refreshToken }
}

const generateAccessToken = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15 mins" }, (err, token) => (
            err ? reject(err) : resolve(token))
        )
    })
}

const generateRefreshToken = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "1 day" }, (err, token) => (
            err ? reject(err) : resolve(token)
        ))
    })
}

export const verifyAccessToken = token => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, token) => {
            err ? reject(err) : resolve(token)
        })
    })
}

export const verifyRefreshToken = token => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, token) => {
            err ? reject(err) : resolve(token)
        })
    })
}

export const refreshTokens = async actualRefreshToken => {

    const content = await verifyRefreshToken(actualRefreshToken)

    const user = await UserModel.findById(content._id)

    if (!user) throw new Error("User not found")


    if (user.refreshToken === actualRefreshToken) {

        const newAccessToken = await generateJWT({ _id: user._id })

        const newRefreshToken = await generateRefreshJWT({ _id: user._id })


        user.refreshToken = newRefreshToken

        await user.save()

        return { newAccessToken, newRefreshToken }
    } else {
        throw new Error("Refresh Token not valid!")
    }
}
