import {User} from "../../user/user.entity";

export class ResponseUserDTO {
    user?: User;
    message:string;
    constructor(message:string, user?:User){
        this.message = message;
        this.user = user;
    }
}