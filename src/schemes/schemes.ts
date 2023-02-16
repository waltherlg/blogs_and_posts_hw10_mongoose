import mongoose from "mongoose";
import {ObjectId} from "mongodb";


export const userSchema = new mongoose.Schema({
    _id: ObjectId,
    login: String,
    passwordHash: String,
    passwordSalt: String,
    email: String,
    createdAt: String,
    confirmationCode: String,
    expirationDate: {
        type: Date,
        sparse: true
    },
    isConfirmed: Boolean,
    passwordRecoveryCode: String,
    expirationDateOfRecoveryCode: {
        type: Date,
        sparse: true
    }
})

export const blogShema = new mongoose.Schema({
    _id: ObjectId,
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean
})

export const postShema = new mongoose.Schema({

})