import rateLimit from "express-rate-limit";



export const authRateLimiter = {
    registration: rateLimit({
        windowMs: 10 * 1 * 1000, // 10 sec
        max: 5,
        message: "Too many requests, please try again later",
        statusCode: 429
    }),
    emailResending: rateLimit({
        windowMs: 10 * 1 * 1000, // 10 sec
        max: 5,
        message: "Too many requests, please try again later",
        statusCode: 429
    }),
    registrationConfirmation: rateLimit({
        windowMs: 10 * 1 * 1000, // 10 sec
        max: 5,
        message: "Too many requests, please try again later",
        statusCode: 429
    }),
    login: rateLimit({
        windowMs: 10 * 1 * 1000, // 10 sec
        max: 5,
        message: "Too many requests, please try again later",
        statusCode: 429
    }),
    passwordRecovery: rateLimit({
        windowMs: 10 * 1 * 1000, // 10 sec
        max: 5,
        message: "Too many requests, please try again later",
        statusCode: 429
    }),
    newPassword: rateLimit({
        windowMs: 10 * 1 * 1000, // 10 sec
        max: 5,
        message: "Too many requests, please try again later",
        statusCode: 429
    }),
}

