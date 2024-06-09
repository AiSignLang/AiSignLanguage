export interface IFriend{
    friendID: number;
    name: string;
    score: IScore;
    profilePath: string | null;
}

export interface IUser{
    id: number;
    name: string;
    score: IScore;
    profilePic: string;
}

export interface IProfile{
    
}

export interface IScore{
    scoreID: number;
    streak: number;
    allTasks: number;
    doneWell: number;
}

