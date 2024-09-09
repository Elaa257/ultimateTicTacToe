export interface UserDTO{
    id:number;
    email:string;
    nickname:string;
    role:string;
    eloPoints:number;
    profilePicture:Buffer;
    wins:number;
    losses:number;
    draw:number;
}
