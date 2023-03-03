import {postsRepository} from "../repositories/posts-repository";
import {ObjectId} from "mongodb";
import {PostDBType} from "../models/types";
import {PostTypeOutput} from "../models/types";
import {blogsService} from "./blogs-service";
import {postsQueryRepo} from "../repositories/post-query-repository";
import {blogsQueryRepo} from "../repositories/blog-query-repository";


export const postsService = {

    async createPost(
        title: string,
        shortDescription: string,
        content: string,
        blogId: string): Promise<PostTypeOutput> {
        let foundBlog = await blogsQueryRepo.getBlogByID(blogId)
        const blogName = foundBlog!.name
        const newPost: PostDBType = {
            "_id": new ObjectId(),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "blogId": blogId,
            "blogName": blogName,
            "createdAt": new Date().toISOString()
        }
        const createdPost = await postsRepository.createPost(newPost)
        return createdPost
    },

    async createPostByBlogId(
        title: string,
        shortDescription: string,
        content: string,
        blogId: string): Promise<PostTypeOutput> {
        let foundBlog = await blogsQueryRepo.getBlogByID(blogId)
        const blogName =  foundBlog!.name
        const newPost: PostDBType = {
            "_id": new ObjectId(),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "blogId": blogId,
            "blogName": blogName,
            "createdAt": new Date().toISOString()
        }
        const createdPost = await postsRepository.createPost(newPost)
        return createdPost
    },

    async updatePost(
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string): Promise<boolean> {
        return await postsRepository.updatePost(id, title, shortDescription, content, blogId)
    },

    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)
    },

    async deleteAllPosts(): Promise<boolean> {
        return await postsRepository.deleteAllPosts()
    },
}