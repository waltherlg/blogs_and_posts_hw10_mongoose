import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {commentType, userDeviceDBType} from "../models/types";


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

export const UserModel = mongoose.model('users', userSchema)

export const blogShema = new mongoose.Schema({
    _id: ObjectId,
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean
})

export const postShema = new mongoose.Schema({
    _id: ObjectId,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String
})

export const commentShema = new mongoose.Schema({
    _id: ObjectId,
    parentType: String,
    parentId: String,
    content: String,
    userId:	String,
    userLogin:	String,
    createdAt:	String,
})

export const userDeviceShema = new mongoose.Schema({
    _id: ObjectId,
    userId: ObjectId,
    ip: String,
    title: String,
    lastActiveDate: String,
    expirationDate: String

})