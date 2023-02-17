import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {blogType, commentType, postType, userDeviceDBType, userType} from "../models/types";


export const userSchema = new mongoose.Schema<userType>({
    _id: ObjectId,
    login: String,
    passwordHash: String,
    passwordSalt: String,
    email: String,
    createdAt: String,
    confirmationCode: String,
    expirationDate: Date,
    isConfirmed: Boolean,
    passwordRecoveryCode: String,
    expirationDateOfRecoveryCode: Date,
})
export const UserModel = mongoose.model('users', userSchema)

export const blogSchema = new mongoose.Schema<blogType>({
    _id: ObjectId,
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean
})
export const BlogModel = mongoose.model('blogs', blogSchema)

export const postSchema = new mongoose.Schema<postType>({
    _id: ObjectId,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String
})
export const PostModel = mongoose.model('posts', postSchema)

export const commentSchema = new mongoose.Schema<commentType>({
    _id: ObjectId,
    parentType: String,
    parentId: String,
    content: String,
    userId:	String,
    userLogin:	String,
    createdAt:	String,
})
export const CommentModel = mongoose.model('comments', commentSchema)

export const userDeviceSchema = new mongoose.Schema<userDeviceDBType>({
    _id: ObjectId,
    userId: ObjectId,
    ip: String,
    title: String,
    lastActiveDate: String,
    expirationDate: String
})
export const UserDeviceModel = mongoose.model('userDevices', userDeviceSchema)