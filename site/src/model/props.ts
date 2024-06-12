export interface IFriend{
    friendID: number;
    name: string;
    score: IScore;
    profilePath: string | null;
}

export interface IUser{
    userId: number;
    userName: string;
    score: IScore;
    profilePic: string;
}

export interface IProfile{
    
}

export interface IScore{
    scoreId: number;
    dailyStreak: number;
    allTimeCorrect: number;
    perfectlyDone: number;
}

