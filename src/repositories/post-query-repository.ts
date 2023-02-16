import {postCollection} from "./posts-repository";
import {postType} from "../models/types";
import {blogCollection} from "./blogs-repository";
import {paginationBlogOutputModel, paginationPostOutputModel} from "../models/models";
import {sort} from "../application/functions";
import {skipped} from "../application/functions";

export const postsQueryRepo = {

    async getAllPosts(
        sortBy: string,
        sortDirection: string,
        pageNumber: string,
        pageSize: string,) {

        let postsCount = await postCollection.countDocuments({})

        let posts = await postCollection.find({})
            .sort({[sortBy]: sort(sortDirection)})
            .skip(skipped(pageNumber, pageSize))
            .limit(+pageSize)
            .toArray()

        let outPosts = posts.map((posts: postType) => {
            return {
                id: posts._id.toString(),
                title: posts.title,
                shortDescription: posts.shortDescription,
                content: posts.content,
                blogId: posts.blogId,
                blogName: posts.blogName,
                createdAt: posts.createdAt
            }
        })

        let pageCount = Math.ceil(+postsCount / +pageSize)

        let outputPosts: paginationPostOutputModel = {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: postsCount,
            items: outPosts
        }
        return outputPosts

    },

    async getAllPostsByBlogsID(
        blogId: string,
        sortBy: string,
        sortDirection: string,
        pageNumber: string,
        pageSize: string,) {

        let posts = await postCollection.find({"blogId": blogId})
            .skip(skipped(pageNumber, pageSize))
            .limit(+pageSize)
            .sort({[sortBy]: sort(sortDirection)})
            .toArray()

        let outPosts = posts.map((posts: postType) => {
            return {
                id: posts._id.toString(),
                title: posts.title,
                shortDescription: posts.shortDescription,
                content: posts.content,
                blogId: posts.blogId,
                blogName: posts.blogName,
                createdAt: posts.createdAt
            }
        })

        let postsCount = await postCollection.countDocuments({"blogId": blogId})

        let pageCount = Math.ceil(+postsCount / +pageSize)

        let outputPosts: paginationBlogOutputModel  = {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: postsCount,
            items: outPosts
        }
        return outputPosts

    }





}