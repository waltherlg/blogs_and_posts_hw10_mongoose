//import {client} from "./db";
import {ObjectId} from "mongodb";
import {CommentDBType} from "../models/types";
import {CommentTypeOutput} from "../models/types";
import {CommentModel} from "../schemes/schemes";

//export const commentsCollection = client.db("blogsAndPosts").collection<commentType>("comments")

export const commentsRepository = {

    async createComment(newComment: CommentDBType): Promise<CommentTypeOutput> {
        const result = await CommentModel.insertMany(newComment)
        let createdComment = {
            id: newComment._id.toString(),
            content: newComment.content,
            userId: newComment.userId,
            userLogin: newComment.userLogin,
            createdAt: newComment.createdAt,
        }
        return createdComment
    },

    async getCommentById(id: string): Promise<CommentTypeOutput | null> {
        if(!ObjectId.isValid(id)){
            return null
        }
        let _id = new ObjectId(id)
        const comment: CommentDBType | null = await CommentModel.findOne({_id: _id})
        if (!comment) {
            return null
        }
        return {
            id: comment._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt
        }
    },

    async deleteComment(id: string): Promise<boolean> {
        if (ObjectId.isValid(id)){
            let _id = new ObjectId(id)
            const result = await CommentModel.deleteOne({_id: _id})
            return result.deletedCount === 1
        }
        else return false
    },

    async updateComment(id: string, content: string): Promise<boolean>{
        if (ObjectId.isValid(id)){
            let _id = new ObjectId(id)
            const result = await CommentModel
                .updateOne({_id: _id},{$set: {content: content}})
            return result.matchedCount === 1
        }
        else return false
    },

    async deleteAllComments(): Promise<boolean>{
        const result = await CommentModel.deleteMany({})
        return result.acknowledged
    }
}