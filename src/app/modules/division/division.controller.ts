/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { DivisionServices } from "./division.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createDivision = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
    const division = await DivisionServices.createDivision(req.body)

    sendResponse(res, {
         success: true,
        statusCode: httpStatus.CREATED,
        message: "Division Created Successfully",
        data: division,
    })
})

const updateDivision = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
    const divisionId = req.params.id
    const payload = req.body
    const divisions = await DivisionServices.updateDivision(divisionId, payload )

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Updated Division Successfully",
        data: divisions,
    })
})

const getAllDivisions = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
    const divisions = await DivisionServices.getAllDivisions()

    sendResponse(res, {
         success: true,
        statusCode: httpStatus.CREATED,
        message: "Retreived all Division Successfully",
        data: divisions,
    })
})

const deleteDivision = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
     const divisionId = req.params.id
    await DivisionServices.deleteDivision(divisionId)

    sendResponse(res, {
         success: true,
        statusCode: httpStatus.CREATED,
        message: "Delete Division Successfully",
        data: null,
    })
})



export const DivisionControllers = {
    createDivision,
    getAllDivisions,
    updateDivision,
    deleteDivision
}