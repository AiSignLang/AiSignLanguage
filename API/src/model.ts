import {Model} from "sequelize-typescript";
import {StatusCodes} from "http-status-codes";
import User from "./data/models/User";
import express from "express";

export interface  ServiceReturn<t extends Model>{
    data: t | null;
    status: StatusCodes;
}

export interface AuthRequest extends express.Request {
    user:  User;
}