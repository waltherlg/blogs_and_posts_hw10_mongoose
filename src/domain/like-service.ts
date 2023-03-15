import {usersQueryRepo} from "../repositories/users-query-repository";
import {usersRepository} from "../repositories/users-repository";
import {commentsRepository} from "../repositories/comments-repository";


export const likeService = {
    async updateCommentLike(userId: string, commentsId: string, status: string){
        const isUserAlreadyLikeComment = await usersQueryRepo.isUserAlreadyLikeComment(userId, commentsId)
        if (!isUserAlreadyLikeComment){
            const createdAt = new Date()
            const addedLike = await usersRepository.createLikeObject(userId, commentsId, createdAt, status)
            const setCount = await commentsRepository.setCountCommentsLike(commentsId, status)
            return addedLike
        }
        const likedComments = await usersQueryRepo.getUsersLikedComments(userId)
        if (!likedComments) return false
        const comment = likedComments.find(c => c.commentsId === commentsId)
        const CurrentStatus = comment ? comment.status : null

    }
}