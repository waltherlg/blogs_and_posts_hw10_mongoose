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
        else return false


    }
}