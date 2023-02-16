import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {RequestWithBody} from "../models/types";
import {userAuthModel, userInputModel} from "../models/users-models";
import {jwtService} from "../application/jwt-service";
import {authMiddleware, refreshTokenCheck} from "../middlewares/basic-auth.middleware";
import {
    confirmationCodeValidation,
    emailResendingValidation,
    emailValidation, emailValidationForRecovery,
    inputValidationMiddleware,
    loginValidation, newPasswordValidation, passwordRecoveryCodeValidation, passwordValidation
} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {authService} from "../domain/auth-service";
import {authRateLimiter} from "../middlewares/auth-rate-limiter";
import {isEmailExistValidation} from "../middlewares/other-midlevares";


export const authRouter = Router({})

authRouter.post('/registration',
    authRateLimiter.registration,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware,
    async (req: RequestWithBody<userInputModel>, res: Response) => {
        const newUser = await authService.registerUser(
            req.body.login,
            req.body.password,
            req.body.email)
        if (newUser) {
            res.status(204).send(newUser)
        }
        else {
            res.sendStatus(400)
        }
    })

authRouter.post('/registration-email-resending',
    authRateLimiter.emailResending,
    emailResendingValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const result = await authService.registrationEmailResending(req.body.email)
        if (result) {
            res.sendStatus(204)
        }
        else res.sendStatus(400)
    })

authRouter.post('/registration-confirmation',
    authRateLimiter.registrationConfirmation,
    confirmationCodeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
    const result = await authService.confirmEmail(req.body.code)
        if (result) {
            res.sendStatus(204)
        }
        else res.sendStatus(400)
    })

authRouter.post('/login',
    authRateLimiter.login,
    async (req: RequestWithBody<userAuthModel>, res: Response) => {
        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const {accessToken, refreshToken} = await authService.login(user, req.ip, req.headers['user-agent']!)
            res.status(200).cookie("refreshToken", refreshToken, {httpOnly: true, secure: true}).send({accessToken})
        } else res.sendStatus(401)
    })

authRouter.post('/refresh-token',
    refreshTokenCheck,
    async (req: Request, res: Response) => {
        const {accessToken, newRefreshedToken} = await authService.refreshingToken(req.user!, req.cookies!.refreshToken)
        res.status(200).cookie("refreshToken", newRefreshedToken, {httpOnly: true, secure: true}).send({accessToken})
    })

authRouter.get('/me',
    authMiddleware,
    async (req: Request, res: Response) => {
        const currentUserInfo = {
            "email": req.user!.email,
            "login": req.user!.login,
            "userId": req.user!._id
        }
        res.status(200).send(currentUserInfo)

    })

authRouter.post('/logout',
    refreshTokenCheck,
    async (req: Request, res: Response) => {
        const isLogout = await authService.logout(req.user!._id, req.cookies!.refreshToken)
        if (isLogout) res.cookie("refreshToken", "", {httpOnly: true, secure: true}).sendStatus(204)
        else res.status(404).send("no logout")
    })

authRouter.post('/password-recovery',
    authRateLimiter.passwordRecovery,
    emailValidationForRecovery,
    inputValidationMiddleware,
    isEmailExistValidation,
    async (req: Request, res: Response) => {
    const result = await authService.passwordRecovery(req.body.email);
    if (result) {
        res.sendStatus(204)
    }
    else res.sendStatus(404)
})

authRouter.post('/new-password',
    authRateLimiter.newPassword,
    newPasswordValidation,
    passwordRecoveryCodeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const result = await authService.newPasswordSet(req.body.newPassword, req.body.recoveryCode);
        if (result) {
            res.sendStatus(204)
        }
        else res.sendStatus(400)
    })

