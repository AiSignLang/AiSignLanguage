
interface IUser {
    userName: string;
    profilePic: string;
    userId: string;
    mistakes: IMistake[];
    friends: IUser[];
    score: IScore;
    created_at: Date;
    updated_at: Date;
    levels: ILevel[];
    hasProfilePic(): boolean;
}