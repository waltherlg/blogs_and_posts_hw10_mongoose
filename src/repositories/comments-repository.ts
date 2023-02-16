import {client} from "./db";
import {ObjectId} from "mongodb";
import {commentType} from "../models/types";
import {commentTypeOutput} from "../models/types";

export const commentsCollection = client.db("blogsAndPosts").collection<commentType>("comments")

export const commentsRepository = {

    async createComment(newComment: commentType): Promise<commentTypeOutput> {
        const result = await commentsCollection.insertOne(newComment)
        let createdComment = {
            id: newComment._id.toString(),
            content: newComment.content,
            userId: newComment.userId,
            userLogin: newComment.userLogin,
            createdAt: newComment.createdAt,
        }
        return createdComment
    },

    async getCommentById(id: string): Promise<commentTypeOutput | null> {
        if(!ObjectId.isValid(id)){
            return null
        }
        let _id = new ObjectId(id)
        const comment: commentType | null = await commentsCollection.findOne({_id: _id})
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
            const result = await commentsCollection.deleteOne({_id: _id})
            return result.deletedCount === 1
        }
        else return false
    },

    async updateComment(id: string, content: string): Promise<boolean>{
        if (ObjectId.isValid(id)){
            let _id = new ObjectId(id)
            const result = await commentsCollection
                .updateOne({_id: _id},{$set: {content: content}})
            return result.matchedCount === 1
        }
        else return false
    },

    async deleteAllComments(): Promise<boolean>{
        const result = await commentsCollection.deleteMany({})
        return result.acknowledged
    }
}