import * as ottoman from 'ottoman';

export const defineCouchbaseModel = (modelName: string, schema: any): any => {
    // Define model if not exists
    const allModels: any = ottoman.getDefaultInstance().models || {};
    if(allModels[modelName]){
      return ottoman.getDefaultInstance().getModel(modelName);
    }
    // const collectionName = `${modelName.toLowerCase()}s`;
    return ottoman.model(modelName, schema, { collectionName: modelName });
}