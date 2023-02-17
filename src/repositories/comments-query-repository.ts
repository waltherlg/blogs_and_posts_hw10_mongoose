
import {sort} from "../application/functions";
import {skipped} from "../application/functions";
import {commentType} from "../models/types";
import {CommentModel} from "../schemes/schemes";

export const commentsQueryRepo = {

    async getAllCommentsByPostId(
        postId: string,
        sortBy: string,
        sortDirection: string,
        pageNumber: string,
        pageSize: string,) {

        let commentsCount = await CommentModel.countDocuments({$and:[{parentType: "post"},{parentId: postId}]})

        let comments = await CommentModel.find({$and:[{parentType: "post"},{parentId: postId}]})
            .sort({[sortBy]: sort(sortDirection)})
            .skip(skipped(pageNumber, pageSize))
            .limit(+pageSize)
            .lean()

        let outComments = comments.map((comments: commentType) => {
            return {
                id: comments._id.toString(),
                content: comments.content,
                userId: comments.userId,
                userLogin: comments.userLogin,
                createdAt: comments.createdAt
            }

        })

        let pageCount =  Math.ceil(commentsCount / +pageSize)

        let outputComments = {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: commentsCount,
            items: outComments
        }
        return outputComments
    }
}

