import {client} from "./db";
import {postCollection} from "./posts-repository";
import {blogCollection, blogsRepository} from "./blogs-repository";
import {blogType, blogTypeOutput} from "../models/types";
import {paginationBlogOutputModel, requestBlogsQueryModel} from "../models/models";


function sort(sortDirection: string){
    return (sortDirection === 'desc') ? -1 : 1;
}

function skipped(pageNumber: string, pageSize: string): number {
    return (+pageNumber - 1) * (+pageSize);
}


export const blogsQueryRepo = {

    async getAllBlogs(
        searchNameTerm: string,
        sortBy: string,
        sortDirection: string,
        pageNumber: string,
        pageSize: string,) {

        let blogsCount = await blogCollection.countDocuments({name: new RegExp(searchNameTerm, "gi")})

        let blogs
        if (searchNameTerm !== 'null'){
            blogs = await blogCollection.find({name: new RegExp(searchNameTerm, "gi")})
                .skip(skipped(pageNumber, pageSize))
                .limit(+pageSize)
                .sort({[sortBy]: sort(sortDirection)})
                .toArray()
        }
        else {
            blogs = await blogCollection.find({})
                .skip(skipped(pageNumber, pageSize))
                .limit(+pageSize)
                .sort({[sortBy]: sort(sortDirection)})
                .toArray()
        }

        let outBlogs = blogs.map((blogs: blogType) => {
            return {
                id: blogs._id.toString(),
                name: blogs.name,
                description: blogs.description,
                websiteUrl: blogs.websiteUrl,
                createdAt: blogs.createdAt
            }
        })

        let pageCount = Math.ceil(blogsCount / +pageSize)

        let outputBlogs: paginationBlogOutputModel  = {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: blogsCount,
            items: outBlogs
        }
        return outputBlogs
    },


}