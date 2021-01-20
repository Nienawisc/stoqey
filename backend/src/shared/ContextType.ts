import {Request, Response} from 'express';
import { ObjectType, Field, Int } from "type-graphql";
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

  @Field({ nullable: true })
  data?: string;
}