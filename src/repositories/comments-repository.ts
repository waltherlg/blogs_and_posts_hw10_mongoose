//import {client} from "./db";
import {ObjectId} from "mongodb";
import {CommentDBType} from "../models/types";
import {CommentTypeOutput} from "../models/types";
import {CommentModel} from "../schemes/schemes";

//export const commentsCollection = client.db("blogsAndPosts").collection<commentType>("comments")

export const commentsRepository = {

    async createComment(newComment: CommentDBType): Promise<string> {
        const result = await CommentModel.insertMany(newComment)
        return newComment._id.toString()
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