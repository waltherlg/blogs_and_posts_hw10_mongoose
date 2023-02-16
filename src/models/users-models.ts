import {v4 as uuid4} from "uuid";
import add from "date-fns/add";

export type userParamURIModel = {
    id: string
}

export type userInputModel = {
    login: string,
    password: string,
    email: string,
}

export type userAuthModel = {
    loginOrEmail: string,
    password: string
}

export type passwordRecoveryModel = {
    email: string,
    passwordRecoveryCode: string,
    expirationDateOfRecoveryCode: Date
}