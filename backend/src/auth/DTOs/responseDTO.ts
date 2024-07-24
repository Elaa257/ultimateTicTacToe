import {ApiProperty} from "@nestjs/swagger";

export class Response{
    @ApiProperty()
    ok:boolean;
    message:string;

    constructor(ok:boolean, message:string){
        this.ok = ok;
        this.message = message;
    }
}