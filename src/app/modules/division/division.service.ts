import  httpStatus  from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async(payload: Partial<IDivision>) =>{
      const isDivisionExist = await Division.findOne({name: payload.name})

    if(isDivisionExist){
        throw new AppError(httpStatus.NOT_FOUND, "Division already exists")
    }

    
    // const baseslug = payload.name?.toLowerCase().split(" ").join("-")
    // let slug = `${baseslug}-division`
    // let counter = 1
    // while(await Division.exists({ slug })){
    //     slug = `${slug}-${counter++}`
    // }
    // payload.slug = slug

    const division = await Division.create(payload)

    return division

}

const updateDivision = async(divisionId: string, payload: Partial<IDivision>) =>{

    const isDivisionExist = await Division.findById(divisionId)

    if(!isDivisionExist){
        throw new AppError(httpStatus.NOT_FOUND, "Division Not found")
    }
    // if(payload.name){
    //     const baseslug = payload.name?.toLowerCase().split(" ").join("-")
    // let slug = `${baseslug}-division`
    // let counter = 1
    // while(await Division.exists({ slug })){
    //     slug = `${slug}-${counter++}`
    // }
    // payload.slug = slug
    // }

    // const {name} = payload
    // const slug = name.toLowerCase().replace(/\s+/g, '-');

    const newUpdate = await Division.findByIdAndUpdate(divisionId, payload, { new: true })
    return newUpdate

}


const getAllDivisions = async () =>{
    const divisions = await Division.find({})
    return divisions
}

const deleteDivision = async(divisionId: string) =>{

    const isDivisionExist = await Division.findById(divisionId)

    if(!isDivisionExist){
        throw new AppError(httpStatus.NOT_FOUND, "Division Not found")
    }

    // const {name} = payload
    // const slug = name.toLowerCase().replace(/\s+/g, '-');

     await Division.findByIdAndDelete(divisionId)
    

}




export const DivisionServices = {
    createDivision,
    getAllDivisions,
    updateDivision,
    deleteDivision
}



