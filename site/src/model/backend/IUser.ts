import {IMistake} from "./IMistake.ts";
import {IScore} from "./IScore.ts";
import {ILevel} from "./ILevel.ts";

export interface IUser {
    userName: string;
    profilePic: string;
    userId: string;
    mistakes: IMistake[];
    friends: IUser[];
    score: IScore;
    created_at: Date;
    updated_at: Date;
    levels: ILevel[];
    levelNumber: number;
    hasProfilePic(): boolean;
}