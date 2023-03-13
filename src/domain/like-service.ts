import {usersQueryRepo} from "../repositories/users-query-repository";
import {usersRepository} from "../repositories/users-repository";


export const likeService = {
    async updateCommentLike(userId: string, commentId: string, likeStatus: string){
        // const isLikeExist = await usersQueryRepo.isCommentLikeExist(userId, commentId)
        // return "hardcode"
    await usersRepository.addLike(userId, commentId, likeStatus)

    }
}