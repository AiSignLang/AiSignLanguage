import {Model} from "sequelize-typescript";
import {StatusCodes} from "http-status-codes";

export interface  ServiceReturn<t extends Model>{
    data: t | null;
    status: StatusCodes;
}
