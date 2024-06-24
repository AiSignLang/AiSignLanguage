export interface IScore {
    dailyStreak: number;
    allTimeCorrect: number;
    perfectlyDone: number;
    scoreId: string;
    ownerId: string;
    updated_at: Date;
    created_at: Date;
}