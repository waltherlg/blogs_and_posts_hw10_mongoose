import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {BlogDBType, CommentDBType, PostDBType, UserDeviceDBType, UserDBType} from "../models/types";


export const userSchema = new mongoose.Schema<UserDBType>({
    login: String,
    passwordHash: String,
    passwordSalt: String,
    email: String,
    createdAt: String,
    confirmationCode: {
        type: String,
        default: null
    },
    expirationDateOfConfirmationCode: {
        type: Date,
        default: null
    },
    isConfirmed: Boolean,
    passwordRecoveryCode: {
        type: String,
        default: null
    },
    expirationDateOfRecoveryCode: {
        type: Date,
        default: null
    }
})
export const UserModel = mongoose.model('users', userSchema)

export const blogSchema = new mongoose.Schema<BlogDBType>({
    _id: ObjectId,
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean
})
export const BlogModel = mongoose.model('blogs', blogSchema)

export const postSchema = new mongoose.Schema<PostDBType>({
    _id: ObjectId,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String
})
export const PostModel = mongoose.model('posts', postSchema)

export const commentSchema = new mongoose.Schema<CommentDBType>({
    _id: ObjectId,
    parentType: String,
    parentId: String,
    content: String,
    userId:	String,
    userLogin:	String,
    createdAt:	String,
})
export const CommentModel = mongoose.model('comments', commentSchema)

export const userDeviceSchema = new mongoose.Schema<UserDeviceDBType>({
    _id: ObjectId,
    userId: ObjectId,
    ip: String,
    title: String,
    lastActiveDate: String,
    expirationDate: String
})
export const UserDeviceModel = mongoose.model('userDevices', userDeviceSchema)