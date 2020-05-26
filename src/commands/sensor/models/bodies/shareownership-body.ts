import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';


export class ShareOwnershipBody {

  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'The ownerId of the new co-owner.'
  })
  readonly ownerId: string;
}
