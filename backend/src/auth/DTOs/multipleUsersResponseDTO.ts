import {User} from "../../user/user.entity";

export class MultiUsersResponseDTO {
    users?: User[];
    message:string;
    constructor(message:string, users?:User[]){
        this.message = message;
        this.users = users;
    }
}