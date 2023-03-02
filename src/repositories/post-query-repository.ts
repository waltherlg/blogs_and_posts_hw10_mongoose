
import {postType, postTypeOutput} from "../models/types";
import {paginationOutputModel, paginationPostOutputModel} from "../models/models";
import {sort} from "../application/functions";
import {skipped} from "../application/functions";
import {PostModel} from "../schemes/schemes";

export const postsQueryRepo = {

    async getAllPosts(
        sortBy: string,
        sortDirection: string,
        pageNumber: string,
        pageSize: string,) {

        let postsCount = await PostModel.countDocuments({})

        let posts = await PostModel.find({})
            .sort({[sortBy]: sort(sortDirection)})
            .skip(skipped(pageNumber, pageSize))
            .limit(+pageSize)
            .lean()

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

        let posts = await PostModel.find({"blogId": blogId})
            .skip(skipped(pageNumber, pageSize))
            .limit(+pageSize)
            .sort({[sortBy]: sort(sortDirection)})
            .lean()

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

        let postsCount = await PostModel.countDocuments({"blogId": blogId})

        let pageCount = Math.ceil(+postsCount / +pageSize)

        let outputPosts: paginationOutputModel<postTypeOutput>  = {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: postsCount,
            items: outPosts
        }
        return outputPosts

    }





}