/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { DivisionServices } from "./division.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IDivision } from './division.interface';

const createDivision = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
    const payload: IDivision = {
        ...req.body,
        thumbnail: req.file?.path
    }
    const division = await DivisionServices.createDivision(payload)

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