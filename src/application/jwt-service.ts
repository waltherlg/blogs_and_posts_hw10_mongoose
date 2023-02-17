import {userType} from "../models/types";
import {ObjectId} from "mongodb";
import jwt from 'jsonwebtoken'
import {settings} from "../settings";


export const jwtService = {
    async createJWT(user: userType) {
        const token = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '10h'})
        return token
    },

    async createJWTRefresh(user: userType, deviceId: ObjectId)  {
    const newRefreshedToken = jwt.sign({userId: user._id, deviceId}, settings.JWT_SECRET, {expiresIn: '20h'})
    return newRefreshedToken
    },

    async getUserIdFromRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            // console.log(typeof result.userId)
            return result.userId
        }
        catch (error){
            return null
        }
    },

    async getDeviceIdFromRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.deviceId
        }
        catch (error) {
            return null
        }
    },

    async getLastActiveDateFromRefreshToken (refreshToken: string): Promise<string>{
        const payload: any = jwt.decode(refreshToken)
        return new Date(payload.iat * 1000).toISOString()
    },

    async getExpirationDateFromRefreshToken (refreshToken: string): Promise<string>{
        const payload: any = jwt.decode(refreshToken)
        return new Date(payload.exp * 1000).toISOString()
    }


}