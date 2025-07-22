
import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const createTour = async(payload: Partial<ITour>) =>{
    const existingTour = await Tour.findOne({title: payload.title})

    if(existingTour){
        throw new Error("Tour already exists.");
    }
    //  const baseslug = payload.title?.toLowerCase().split(" ").join("-")
    //     let slug = `${baseslug}`
    //     let counter = 1
    //     while(await Tour.exists({ slug })){
    //         slug = `${slug}-${counter++}`
    //     }
    //     payload.slug = slug

    const tour = await Tour.create(payload)

    return tour

}

const updateTour = async(id: string, payload: Partial<ITour>) =>{

    const existingTour = await Tour.findById(id);
    if (!existingTour) {
        throw new Error("Tour not found.");
    }
    // if(payload.title){
    //       const baseslug = payload.title?.toLowerCase().split(" ").join("-")
    //     let slug = `${baseslug}`
    //     let counter = 1
    //     while(await Tour.exists({ slug })){
    //         slug = `${slug}-${counter++}`
    //     }
    //     payload.slug = slug

    // }

    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });
    return updatedTour;

}


const getAllTour = async (query: Record<string, string>) =>{

    const queryBuilder = new QueryBuilder(Tour.find(), query)
    const tours =  await queryBuilder
    .search(tourSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    
     const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}

const deleteTour = async(id: string) =>{

     const existingTour = await Tour.findById(id);
    if (!existingTour) {
        throw new Error("Tour not found.");
    }

    return await Tour.findByIdAndDelete(id);
    

}


const createTourType = async(payload: ITourType) =>{
    const existingTourTypes = await TourType.findOne({name: payload.name})

    if(existingTourTypes){
        throw new Error("Tour type already exists.");
    }

    const tourType = await TourType.create(payload)

    return tourType

}

const updateTourType = async(id: string, payload: Partial<ITourType>) =>{

    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, { new: true });
    return updatedTourType;

}


const getAllTourType = async () =>{
    const tourType =  await TourType.find();
    return tourType
}

const deleteTourType = async(id: string) =>{

     const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    return await TourType.findByIdAndDelete(id);
    

}



export const TourServices = {
    createTourType,
    getAllTourType,
    updateTourType,
    deleteTourType,
    createTour,
    getAllTour,
    updateTour,
    deleteTour
}