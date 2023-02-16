import {ObjectId} from "mongodb";
import {commentType, commentTypeOutput} from "../models/types";
import {commentsRepository} from "../repositories/comments-repository";
import {jwtService} from "../application/jwt-service";
import {usersService} from "./users-service";
import {usersRepository} from "../repositories/users-repository";

export const commentService = {

    async createComment(postId: string, content: string, userId: string, userLogin: string): Promise<commentTypeOutput> {
        const newComment: commentType = {
            "_id": new ObjectId(),
            "parentType": "post",
            "parentId": postId,
            "content":	content,
            "userId": userId!,
            "userLogin": userLogin!,
            "createdAt": new Date().toISOString()
        }
        const createdComment = await commentsRepository.createComment(newComment)
        return createdComment
    },

    async getCommentById(id: string): Promise<commentTypeOutput | null> {
        return await commentsRepository.getCommentById(id)
    },

    async updateComment(
        id: string,
        content: string): Promise<boolean> {
         return await commentsRepository.updateComment(id, content)
    },

    async deleteComment(id: string): Promise<boolean>{
        return await commentsRepository.deleteComment(id)
        },

    async deleteAllComments(): Promise<boolean>{
        return await commentsRepository.deleteAllComments()
    },
}