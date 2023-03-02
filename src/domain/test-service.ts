
type codeType = {
    login: string,
    code: string
}

let codes: Array<codeType> = []


export const testService = {
    async saveConfirmationCode(newUser: any){
        const newCode = {
            login: newUser.login,
            code: newUser.confirmationCode
        }
        codes.push(newCode)
    },

    async getConfirmationCode(login: string){
        const code = codes.find(c => c.login === login)
        if (code){
            return code.code
        }
        else return null

    }
}

