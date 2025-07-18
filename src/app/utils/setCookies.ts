import { Response } from "express";
interface AuthTokens {
    accessToken?: string,
    refreshToken?: string
}
export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) =>{
     res.cookie("accessToken", tokenInfo.accessToken, {
        httpOnly: true,
        secure: false
    })
     res.cookie("refreshToken", tokenInfo.refreshToken, {
        httpOnly: true,
        secure: false
    })
}