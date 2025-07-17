import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { AuthServices } from "./auth.service"
import { sendResponse } from "../../utils/sendResponse"
import { catchAsync } from '../../utils/catchAsync';

const credentialsLogin = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const loginInfo = await AuthServices.credentialsLogin(req.body)


     sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Logged in Successfully",
        data: loginInfo,
    })
})

export const AuthControllers = {
    credentialsLogin
}