import {ObjectId} from "mongodb";
import {userType, UserTypeOutput} from "../models/types";
import {usersRepository} from "../repositories/users-repository";
import * as bcrypt from 'bcrypt'

const getUserDto = (login: string,
                    password: string,
                    email: string,
                    isConfirmed: boolean,
                    passwordHash: string,
                    passwordSalt: string): userType => {
    return {
        _id: new ObjectId(),
        "login": login,
        passwordHash,
        passwordSalt,
        "email": email,
        "createdAt": new Date().toISOString(),
        "confirmationCode": "none",
        "expirationDateOfConfirmationCode": new Date(),
        "isConfirmed": true,
        'passwordRecoveryCode': "none",
        'expirationDateOfRecoveryCode': new Date()
    }

}

export const usersService = {

    async createUser(login: string, password: string, email: string): Promise<string> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: userType = {
            "_id": new ObjectId(),
            "login": login,
            passwordHash,
            passwordSalt,
            "email": email,
            "createdAt": new Date().toISOString(),
            "confirmationCode": "none",
            "expirationDateOfConfirmationCode": new Date(),
            "isConfirmed": true,
            'passwordRecoveryCode': "none",
            'expirationDateOfRecoveryCode': new Date()
        }
        const createdUser = await usersRepository.createUser(newUser)
        return createdUser._id.toString()
    },

    async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
        return hash
    },

    async checkCredentials (loginOrEmail: string, password: string){
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash !== passwordHash){
            return false
        }
        return user
    },

    async getUserById(id: string): Promise<userType | null> {
        return await usersRepository.getUserById(id)
    },

    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },

    async deleteAllUsers(): Promise<boolean>{
        return await usersRepository.deleteAllUsers()
    },

    async isLoginExist (login: string): Promise<boolean> {
        const loginExist = await usersRepository.findUserByLoginOrEmail(login)
        if (loginExist) return true
        else return false
    },

    async isEmailExist (email: string): Promise<boolean> {
        const emailExist = await usersRepository.findUserByLoginOrEmail(email)
        if (emailExist) return true
        else return false
    },

    async isEmailConfirmed(email: string): Promise<boolean> {
        const user = await usersRepository.findUserByLoginOrEmail(email)
        if (user!.isConfirmed) return true
        else return false
    },

    async isCodeConfirmed(code: string): Promise<boolean> {
        const user = await usersRepository.getUserByConfirmationCode(code)
        if (user!.isConfirmed) return true
        else return false
    }
}