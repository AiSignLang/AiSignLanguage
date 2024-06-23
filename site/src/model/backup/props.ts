export interface IFriend{
    friendID: number;
    name: string;
    score: IScore;
    profilePath: string | null;
}

export interface IScore{
    scoreId: number;
    dailyStreak: number;
    allTimeCorrect: number;
    perfectlyDone: number;
}

