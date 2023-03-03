import {Request, Response, Router} from "express";

import {postsService} from "../domain/posts-service";
import {commentService} from "../domain/comment-service";
import {commentsQueryRepo} from "../repositories/comments-query-repository";

import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../models/types";
import {
    CreateCommentModel,
    CreatePostModel, RequestCommentsByPostIdQueryModel,
    RequestPostsQueryModel,
    UpdatePostModel, URIParamsCommentModel,
    URIParamsGetPostByBlogIdModel,
    URIParamsPostModel
} from "../models/models";

export const postsRouter = Router({})

import {
    commentContentValidation,
    inputValidationMiddleware
} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {authMiddleware, basicAuthMiddleware} from "../middlewares/basic-auth.middleware";
import {titleValidation} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {shortDescriptionValidation} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {contentValidation} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {existBlogIdValidation} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {postsQueryRepo} from "../repositories/post-query-repository";
import {jwtService} from "../application/jwt-service";

// GET Returns All posts
postsRouter.get('/', async (req: RequestWithQuery<RequestPostsQueryModel>, res: Response) => {
    try {
        let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt'
        let sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
        let pageNumber = req.query.pageNumber ? req.query.pageNumber : '1'
        let pageSize = req.query.pageSize ? req.query.pageSize : '10'
        const allPosts = await postsQueryRepo.getAllPosts(sortBy, sortDirection, pageNumber, pageSize)
        res.status(200).send(allPosts);
    } catch (e) {
        res.status(500).send(e)
    }
})

//GET return post by id
postsRouter.get('/:postId', async (req: RequestWithParams<URIParamsPostModel>, res) => {
    let foundPost = await postsQueryRepo.getPostByID(req.params.postId.toString())
    if (foundPost) {
        res.status(200).send(foundPost)
    } else {
        res.sendStatus(404)
    }
})

// POST add post
postsRouter.post('/',
    basicAuthMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    existBlogIdValidation,
    inputValidationMiddleware,
    async (req: RequestWithBody<CreatePostModel>, res: Response) => {
        const newPost = await postsService.createPost(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId)
        res.status(201).send(newPost)
    })

// POST add comment by post id
postsRouter.post('/:postId/comments',
    authMiddleware,
    commentContentValidation,
    inputValidationMiddleware,
    async (req: RequestWithParamsAndBody<URIParamsCommentModel, CreateCommentModel>, res: Response) => {
        let foundPost = await postsQueryRepo.getPostByID(req.params.postId.toString())
        if (!foundPost){
            res.sendStatus(404)
            return
        }
        const token = req.headers.authorization!.split(' ')[1]
        const userId = await jwtService.getUserIdFromRefreshToken(token)
        const newComment = await commentService.createComment(
            req.params.postId,
            req.body.content,
            userId)

        res.status(201).send(newComment)
    })

// GET all comments by post id
postsRouter.get('/:postId/comments',
    async (req: RequestWithParamsAndQuery<URIParamsPostModel, RequestCommentsByPostIdQueryModel>, res: Response) => {
        const foundPost = await postsQueryRepo.getPostByID(req.params.postId.toString())
        if (!foundPost) {
            res.sendStatus(404)
        } else {
            try {
                let postId = req.params.postId.toString()
                let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt'
                let sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
                let pageNumber = req.query.pageNumber ? req.query.pageNumber : '1'
                let pageSize = req.query.pageSize ? req.query.pageSize : '10'
                let foundComments = await commentsQueryRepo.getAllCommentsByPostId(postId, sortBy, sortDirection, pageNumber, pageSize)
                if (foundComments) {
                    res.status(200).send(foundComments)
                }
            } catch (error) {
                res.status(500).send(error)
            }
        }
    })

// PUT update post
postsRouter.put('/:postId',
    basicAuthMiddleware,
    existBlogIdValidation,
    shortDescriptionValidation,
    titleValidation,
    contentValidation,
    inputValidationMiddleware,
    async (req: RequestWithParamsAndBody<URIParamsPostModel, UpdatePostModel>, res: Response) => {
        const updatePost = await postsService.updatePost(
            req.params.postId,
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId)
        if (updatePost) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

// DELETE post
postsRouter.delete('/:postId',
    basicAuthMiddleware,
    async (req: RequestWithParams<URIParamsPostModel>, res: Response) => {
        const isDeleted = await postsService.deletePost(req.params.postId)
        if (isDeleted) {
            return res.sendStatus(204)
        } else {
            res.sendStatus(404);
        }
    })

