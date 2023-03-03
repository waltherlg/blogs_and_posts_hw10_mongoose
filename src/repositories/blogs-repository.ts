
import {ObjectId} from "mongodb";
import {BlogDBType} from "../models/types";
import {BlogTypeOutput} from "../models/types";
import {BlogModel} from "../schemes/schemes";


export const blogsRepository = {

    async createBlog(newBlog: BlogDBType): Promise<BlogTypeOutput> {
        const result = await BlogModel.create(newBlog)
        let createdBlog = {
            id: newBlog._id.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        }
        return createdBlog
    },

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean>{
        if (ObjectId.isValid(id)){
            let _id = new ObjectId(id)
            const result = await BlogModel
                .updateOne({_id: _id},{$set: {name: name, description: description, websiteUrl: websiteUrl}})
            return result.matchedCount === 1
        }
        else return false

    },

    async deleteBlog(id: string): Promise<boolean>{
        if (ObjectId.isValid(id)){
            let _id = new ObjectId(id)
            const result = await BlogModel.deleteOne({_id: _id})
            return result.deletedCount === 1
        }
        else return false

    },

    async deleteAllBlogs(): Promise<boolean> {
        const result = await BlogModel.deleteMany({})
        return result.acknowledged
    },
}


