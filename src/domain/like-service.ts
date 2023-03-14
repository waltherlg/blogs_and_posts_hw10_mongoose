import {usersQueryRepo} from "../repositories/users-query-repository";
import {usersRepository} from "../repositories/users-repository";


export const likeService = {
    async updateCommentLike(userId: string, commentsId: string, status: string){
        const isLikeExist = await usersQueryRepo.isCommentLikeExist(userId, commentsId)
        if (!isLikeExist){
            const createdAt = new Date()
            const addedLike = await usersRepository.addLike(userId, commentsId, createdAt, status)

            return addedLike
        }


    }
}