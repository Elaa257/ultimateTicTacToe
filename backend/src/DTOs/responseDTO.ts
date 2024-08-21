import { ApiProperty } from '@nestjs/swagger';

export class ResponseDTO {
  @ApiProperty()
  ok: boolean;
  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })  // Indicate that user is optional
  user?: any;

  constructor(ok: boolean, message: string, user?: any) {
    this.ok = ok;
    this.message = message;
    this.user = user;
  }
}
