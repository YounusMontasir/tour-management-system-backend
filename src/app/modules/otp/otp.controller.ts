import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OTPService } from './otp.service';

const sendOTP = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {email, name} = req.body
    await OTPService.sendOTP(email, name)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "OTP send Successfully",
        data: null,
    })
})

const verifyOTP = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {email, otp} = req.body
  await OTPService.verifyOTP(email, otp)
    

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "OTP verified Successfully",
        data: null,
    })
})

export const OTPController = {
    sendOTP,
    verifyOTP
}