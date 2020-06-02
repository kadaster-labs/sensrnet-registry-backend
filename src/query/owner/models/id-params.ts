import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from "class-validator";


export class OwnerIdParams {

  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty()
  readonly ownerId: string;
}
