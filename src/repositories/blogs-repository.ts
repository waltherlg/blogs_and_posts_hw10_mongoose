
import {ObjectId} from "mongodb";
import {BlogDBType} from "../models/types";
import {BlogTypeOutput} from "../models/types";
import {BlogModel} from "../schemes/schemes";


export const blogsRepository = {

    async getBlogByID(id: string): Promise<BlogTypeOutput | null> {
        if(!ObjectId.isValid(id)){
            return null
        }
        let _id = new ObjectId(id)
        const blog: BlogDBType | null = await BlogModel.findOne({_id: _id})
        if (!blog) {
            return null
        }
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    },

    async getAllBlogsWithoutPagination(): Promise<BlogTypeOutput[]> {
        let outBlogs = await BlogModel.find({}).lean()
        return outBlogs.map((blogs: BlogDBType) => ({
            id: blogs._id.toString(),
            name: blogs.name,
            description: blogs.description,
            websiteUrl: blogs.websiteUrl,
            createdAt: blogs.createdAt,
            isMembership: blogs.isMembership
        }))
    },

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


