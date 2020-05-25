import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';


export class ShareOwnershipBody {

  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty()
  readonly ownerId: string;
}
