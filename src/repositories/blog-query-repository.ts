
import {blogsRepository} from "./blogs-repository";
import {blogType, blogTypeOutput} from "../models/types";
import {paginationOutputModel, requestBlogsQueryModel} from "../models/models";
import {BlogModel} from "../schemes/schemes";

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

        let blogsCount = await BlogModel.countDocuments({name: new RegExp(searchNameTerm, "gi")})

        let blogs
        if (searchNameTerm !== 'null'){
            blogs = await BlogModel.find({name: new RegExp(searchNameTerm, "gi")})
                .skip(skipped(pageNumber, pageSize))
                .limit(+pageSize)
                .sort({[sortBy]: sort(sortDirection)})
                .lean()
        }
        else {
            blogs = await BlogModel.find({})
                .skip(skipped(pageNumber, pageSize))
                .limit(+pageSize)
                .sort({[sortBy]: sort(sortDirection)})
                .lean()
        }

        let outBlogs = blogs.map((blogs: blogType) => {
            return {
                id: blogs._id.toString(),
                name: blogs.name,
                description: blogs.description,
                websiteUrl: blogs.websiteUrl,
                createdAt: blogs.createdAt,
                isMembership: blogs.isMembership
            }
        })

        let pageCount = Math.ceil(blogsCount / +pageSize)

        let outputBlogs: paginationOutputModel<blogTypeOutput>  = {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: blogsCount,
            items: outBlogs
        }
        return outputBlogs
    },


}