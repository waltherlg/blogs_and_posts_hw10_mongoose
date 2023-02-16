import {Response, Router} from "express";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../models/types";
import {userInputModel, userParamURIModel} from "../models/users-models";

import {usersService} from "../domain/users-service";
import {basicAuthMiddleware} from "../middlewares/basic-auth.middleware";
import {
    emailValidation,
    inputValidationMiddleware,
    loginValidation, passwordValidation
} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {requestUsersQueryModel} from "../models/models";
import {usersRepository} from "../repositories/users-repository";
import {usersQueryRepo} from "../repositories/users-query-repository";

export const usersRouter = Router({})


usersRouter.post('/',
    basicAuthMiddleware,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware,
    async (req: RequestWithBody<userInputModel>, res: Response) => {
    const newUser = await usersService.createUser(
        req.body.login,
        req.body.password,
        req.body.email)
        res.status(201).send(newUser)

    })

usersRouter.delete('/:id',
    basicAuthMiddleware,
    inputValidationMiddleware,
    async (req: RequestWithParams<userParamURIModel>, res: Response) => {
    const isUserDeleted = await usersService.deleteUser(req.params.id)
        if (isUserDeleted) {
            res.sendStatus(204)
        }
        else {
            res.sendStatus(404)
        }
    })

usersRouter.get('/',
    basicAuthMiddleware,
    inputValidationMiddleware,
    async (req: RequestWithQuery<requestUsersQueryModel>, res: Response) =>{
    try {
        let sortBy = req.query.sortBy ? req.query.sortBy: 'createdAt'
        let sortDirection = req.query.sortDirection ? req.query.sortDirection: 'desc'
        let pageNumber = req.query.pageNumber ? req.query.pageNumber: '1'
        let pageSize = req.query.pageSize ? req.query.pageSize: '10'
        let searchLoginTerm = req.query.searchLoginTerm ? req.query.searchLoginTerm: ''
        let searchEmailTerm = req.query.searchEmailTerm ? req.query.searchEmailTerm: ''
        const allUsers = await usersQueryRepo.getAllUsers(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm)
        res.status(200).send(allUsers)
    }
    catch (e) {
        res.status(500).send(e)
    }

    })