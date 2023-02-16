import {client} from "./db";
import {ObjectId} from "mongodb";
import {userType} from "../models/types";
import {userTypeOutput} from "../models/types";
import {usersService} from "../domain/users-service";
import {passwordRecoveryModel} from "../models/users-models";

export const usersCollection = client.db("blogsAndPosts").collection<userType>("users")

export const usersRepository = {

    async createUser(newUser: userType): Promise<userTypeOutput> {
        const result = await usersCollection.insertOne(newUser)
        let createdUser = {
            id: newUser._id.toString(),
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        }
        return createdUser
    },

    async deleteUser(id: string): Promise<boolean>{
        if (ObjectId.isValid(id)){
            let _id = new ObjectId(id)
            const result = await usersCollection.deleteOne({_id: _id})
            return result.deletedCount === 1
        }
        else return false
    },

    async deleteAllUsers(): Promise<boolean>{
        const result = await usersCollection.deleteMany({})
        return result.acknowledged
    },

    async getUserById(id: string): Promise<userType | null> {
        if (!ObjectId.isValid(id)){
            return null
        }
        let _id = new ObjectId(id)
        const user: userType | null = await usersCollection.findOne({_id: _id})
        if (!user){
            return null
        }
        return user
    },

    async getUserByConfirmationCode(code: string): Promise<userType | null> {
        const user: userType | null = await usersCollection.findOne({confirmationCode: code})
        if (!user){
            return null
        }
        return user
    },
    async getUserByPasswordRecoveryCode(code: string){
        const user = await usersCollection.findOne({passwordRecoveryCode: code})
        if (!user){
            return null
        }
        return user
    },

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<userType | null>{
        const user = await usersCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
        return user
    },

    async updateConfirmation(_id: ObjectId) {
        let result = await usersCollection.updateOne({_id}, {$set: {isConfirmed: true} })
        return result.modifiedCount === 1
    },

    async refreshConfirmationCode(refreshConfirmationData: any){
        let result = await usersCollection.updateOne({email: refreshConfirmationData.email}, {$set: {confirmationCode: refreshConfirmationData.confirmationCode, expirationDate: refreshConfirmationData.expirationDate}})
        return result.modifiedCount === 1
    },

    async addPasswordRecoveryData(passwordRecoveryData: passwordRecoveryModel){
        let result = await usersCollection.updateOne({email: passwordRecoveryData.email},
            {$set:
                    {passwordRecoveryCode: passwordRecoveryData.passwordRecoveryCode,
                    expirationDateOfRecoveryCode: passwordRecoveryData.expirationDateOfRecoveryCode}})
        return result.modifiedCount === 1
    },

    async newPasswordSet(_id: ObjectId, passwordSalt: string, passwordHash: string){
        let result = await usersCollection.updateOne(
            {_id: _id},
            {$set:
                    {passwordHash: passwordHash,
                    passwordSalt: passwordSalt,
                    passwordRecoveryCode: "",
                    expirationDateOfRecoveryCode: null
                    }})
        return result.modifiedCount === 1
    }


}