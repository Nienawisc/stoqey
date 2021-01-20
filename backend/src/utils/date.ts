interface DataWithDates {
    createdAt: Date;
    updatedAt: Date;
    date: Date;
    exitTime: Date;
    entryTime: Date;

    // [x: string]: string;
};

/**
 * Convert datas to data objects
 * @param data 
 */
export const convertDates = (data: DataWithDates) => {

    if(data.createdAt){
        data.createdAt = new Date(data.createdAt);
    }

    if(data.updatedAt){
        data.updatedAt = new Date(data.updatedAt);
    }

    if(data.date){
        data.date = new Date(data.date);
    }

    if(data.exitTime){
        data.exitTime = new Date(data.exitTime);
    }

    if(data.entryTime){
        data.entryTime = new Date(data.entryTime);
    }

    return data;
}