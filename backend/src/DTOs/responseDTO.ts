import { ApiProperty } from '@nestjs/swagger';

export class ResponseDTO {
  @ApiProperty()
  ok: boolean;
  @ApiProperty()
  message: string;
  @ApiProperty({ required: false })
  id: number;
  @ApiProperty({ required: false }) // Indicate that user is optional
  user?: any;
  @ApiProperty({ required: false }) // Indicate that user is optional
  userWinner?: any;
  @ApiProperty({ required: false }) // Indicate that user is optional
  userLoser?: any;

  constructor(
    ok: boolean,
    message: string,
    user?: any,
    id?: number,
    userWinner?: any,
    userLoser?: any
  ) {
    this.ok = ok;
    this.message = message;
    this.user = user;
    this.id = id;
    this.userWinner = userWinner;
    this.userLoser = userLoser;
  }
}
