import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from "class-validator";

export class IdParams {

  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty()
  readonly id: string;
}
