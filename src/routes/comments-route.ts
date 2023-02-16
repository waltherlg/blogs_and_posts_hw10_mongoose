import {Request, Response, Router} from "express";
import {commentsRepository} from "../repositories/comments-repository";
import {commentService} from "../domain/comment-service";
import {authMiddleware} from "../middlewares/basic-auth.middleware";
import {usersService} from "../domain/users-service";
import {isUserOwnerOfComments} from "../middlewares/other-midlevares";
import {commentContentValidation} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware/input-validation-middleware";

export const commentsRouter = Router({})

//
//GET return comment by id
commentsRouter.get('/:id',
    async (req: Request, res: Response) => {
    let foundComment = await commentService.getCommentById(req.params.id.toString())
        if (foundComment) {
            res.status(200).send(foundComment)
        }
        else {
            res.sendStatus(404)
        }
    }
)

commentsRouter.delete('/:commentId',
    authMiddleware,
    isUserOwnerOfComments,
    async (req: Request, res: Response) => {
        let isDeleted = await commentService.deleteComment(req.params.commentId.toString())
        if (isDeleted) {
            res.sendStatus(204)
        }
        else {
            res.sendStatus(404)
        }
    }
)

commentsRouter.put('/:commentId',
    authMiddleware,
    isUserOwnerOfComments,
    commentContentValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        let updateComment = await commentService.updateComment(
            req.params.commentId.toString(),
            req.body.content)

        if (updateComment) {
            res.sendStatus(204)
        }
        else {
            res.sendStatus(404)
        }
    }
)