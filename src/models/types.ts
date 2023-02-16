import {ObjectId} from "mongodb";
import {Request} from "express";

export type postTypeOutput = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}
export type postType = {
    _id: string | ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

// type | interface | class

export type blogTypeOutput = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string
    isMembership: boolean
}
export type blogType = {
    _id: string | ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type userType = {
    _id: ObjectId
    login: string
    passwordHash: string
    passwordSalt: string
    email: string
    createdAt: string
    confirmationCode: string
    expirationDate: Date | null,
    isConfirmed: boolean,
    passwordRecoveryCode: string,
    expirationDateOfRecoveryCode: Date | null
}
export type userTypeOutput = {
    id: string | ObjectId
    login: string
    email: string
    createdAt: string
}

export type commentType = {
    _id:	string | ObjectId,
    "parentType": string,
    "parentId": string,
    content:	string
    userId:	string
    userLogin:	string
    createdAt:	string
}

export type commentTypeOutput = {
    id:	string
    content: string
    userId:	string
    userLogin:	string
    createdAt:	string
}

export type userDeviceDBType = {
    _id: ObjectId,
    userId: ObjectId,
    ip: string,
    title: string,
    lastActiveDate: string,
    expirationDate: string
}

export type userDeviceOutputType = {
    ip: string,
    title: string | unknown | null,
    lastActiveDate: string,
    deviceId: string
}

export type RequestWithBody<B> = Request<{},{}, B>
export type RequestWithQuery<Q> = Request<{},{},{}, Q>
export type RequestWithParams<P> = Request<P>
export type RequestWithParamsAndBody<P, B> = Request<P,{},B>
export type RequestWithParamsAndQuery<P, Q> = Request<P,{},{}, Q>