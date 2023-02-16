import {blogsRepository} from "../repositories/blogs-repository";
import {ObjectId} from "mongodb";
import {blogType} from "../models/types";
import {blogTypeOutput} from "../models/types";

export const blogsService = {

    async getBlogByID(id: string): Promise<blogTypeOutput | null> {
        return blogsRepository.getBlogByID(id)
    },

    // async getAllBlogs(): Promise<blogTypeOutput[]> {
    //     return blogsRepository.getAllBlogs()
    // },

    async createBlog(name: string, description: string, websiteUrl: string): Promise<blogTypeOutput> {
        const newBlog: blogType = {
            "_id": new ObjectId(),
            "name": name,
            "description": description,
            "websiteUrl": websiteUrl,
            "createdAt": new Date().toISOString(),
            "isMembership": true
        }
        const createdBlog = await blogsRepository.createBlog(newBlog)
        return createdBlog
    },

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean>{
        return await blogsRepository.updateBlog(id, name, description, websiteUrl)
    },

    async deleteBlog(id: string): Promise<boolean>{
        return await blogsRepository.deleteBlog(id)
    },

    async deleteAllBlogs(): Promise<boolean> {
        return  await blogsRepository.deleteAllBlogs()
    },
}

