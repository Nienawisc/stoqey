import {Request, Response} from 'express';
import { ObjectType, Field, Int } from "type-graphql";
import GraphQLJSON from 'graphql-type-json';
export interface ContextType {
    req: Request; 
    res: Response;
    payload?: string; 
}

/**
 * GraphQL Types start
 */


 /**
  * ResType
  */
@ObjectType()
export class ResType {
  @Field(() => Boolean)
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field(type => GraphQLJSON)
  data?: string;
}