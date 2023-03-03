import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {commentService} from "../domain/comment-service";
import {usersService} from "../domain/users-service";
import {deviceService} from "../domain/device-service";
import {commentsQueryRepo} from "../repositories/comments-query-repository";
import {jwtService} from "../application/jwt-service";


export const isUserOwnerOfComments = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization!.split(' ')[1]
    const userId = await jwtService.getUserIdFromRefreshToken(token)
    const comment = await commentsQueryRepo.getCommentById(req.params.commentId)
    if (!comment) {
        res.sendStatus(404)
        return
    }
    if (userId !== comment.userId){
        res.sendStatus(403)
        return
    }
    next()
}

export const isUserOwnerOfDevice = async (req: Request, res: Response, next: NextFunction) => {
    const deviceId = req.params.deviceId
    const isDeviseExist = await deviceService.isDeviceExist(deviceId)
    if (!isDeviseExist){
        res.status(404).send("device not found")
        return
    }
    const token = req.headers.authorization!.split(' ')[1]
    const userId = await jwtService.getUserIdFromRefreshToken(token)
    const isOwner = await deviceService.doesUserHaveThisDevice(userId, deviceId)
    if (!isOwner) {
        res.sendStatus(403)
        return
    }
    next()
}

export const isEmailExistValidation = async (req: Request, res: Response, next: NextFunction) => {
    const isEmailExist = await usersService.isEmailExist(req.body.email)
    if (!isEmailExist) {
        res.sendStatus(204)
        return
    }
    next()
}