import { ApiProperty } from '@nestjs/swagger';

export class ResponseDTO {
  @ApiProperty()
  ok: boolean;
  @ApiProperty()
  message: string;
  @ApiProperty({ required: false })
  id: number;
  @ApiProperty({ required: false })
  user?: any;
  @ApiProperty({ required: false })
  userWinner?: any;
  @ApiProperty({ required: false })
  userLoser?: any;

  constructor(
    ok: boolean,
    message: string,
    user?: any,
    id?: number
  ) {
    this.ok = ok;
    this.message = message;
    this.user = user;
    this.id = id;
  }
}
