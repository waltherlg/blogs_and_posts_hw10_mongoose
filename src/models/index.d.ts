import {userType} from "./types";

declare global {
    declare namespace Express {
        export interface Request {
            user: userType | null
        }
    }
}