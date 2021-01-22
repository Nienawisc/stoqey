import * as ottoman from 'ottoman';

export const defineModel = (modelName: string, schema: any): any => {
    // Define model if not exists
    const allModels: any = ottoman.getDefaultInstance().models || {};
    if(allModels[modelName]){
      return ottoman.getDefaultInstance().getModel(modelName);
    }
    return ottoman.model(modelName, schema);
}