import {blogTypeOutput} from "./types";

export type URIParamsPostModel = {
    /**
     * id of existing post
     */
    postId: string
}

// class  Человек {
//     рука: строка
//
//     печататьрукой(){}
// }
//
// class Левша extends  Человек {
//     печататьрукой() {
//         super.печататьрукой();
//         печатать.леовой рукой
//     }
// }
//
// class првша extends Человек{
//     печататьрукой() {
//         super.печататьрукой();
//         печатать правой рукой
//     }
// }


export type URIParamsBlogModel = {
    /**
     * id of existing blog
     */
    id: string
}

export type URIParamsIDBlogModel = {
    /**
     * for finding posts by blogs id
     */
    blogId: string
}

export type URIParamsGetPostByBlogIdModel = {
    /**
     * When you need get post by blog id
     */
    blogId: string
}

export type URIParamsCommentModel = {
    postId: string
}

export type createPostModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export type updatePostModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export type createBlogModel = {
    name: string,
    description: string,
    websiteUrl: string,
}

export type updateBlogModel = {
    name: string,
    description: string,
    websiteUrl: string,
}

export type createCommentModel = {
    content: string
}

export type requestBlogsQueryModel = {
    searchNameTerm: string,
    sortBy: string,
    sortDirection: string,
    pageNumber: string,
    pageSize: string,
}

export type requestUsersQueryModel = {
    sortBy: string,
    sortDirection: string,
    pageNumber: string,
    pageSize: string,
    searchLoginTerm: string,
    searchEmailTerm: string,

}

export type requestPostsQueryModel = {
    sortBy: string,
    sortDirection: string,
    pageNumber: string,
    pageSize: string,
}

export type requestPostsByBlogsIdQueryModel = {
    sortBy: string,
    sortDirection: string,
    pageNumber: string,
    pageSize: string,
}

export type requestCommentsByPostIdQueryModel = {
    sortBy: string,
    sortDirection: string,
    pageNumber: string,
    pageSize: string,
}


export type paginationBlogOutputModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: any
}

export type paginationPostOutputModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: any
}

export type paginationUserOutputModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: any
}

