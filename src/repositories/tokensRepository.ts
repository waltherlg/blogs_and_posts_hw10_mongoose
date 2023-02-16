import {client} from "./db";
import {ObjectId} from "mongodb";
import {postType} from "../models/types";

export const expiredTokenCollection = client.db("blogsAndPosts").collection("expiredToken")
export const expiredTokenRepository = {
    async addTokenToRepo (userId: ObjectId, token: string) {
        const expToken = {
            userId: userId,
            refreshToken: token
        }
        await expiredTokenCollection.insertOne(expToken)
        return true
    },

    async findExpiredToken (refreshToken: string): Promise<object | null> {
       return expiredTokenCollection.findOne({refreshToken: refreshToken})

    }
}