import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';


export class TransferOwnershipBody {

  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'The ownerId of the old owner.'
  })
  readonly oldOwnerId: string;

  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'The ownerId of the new owner.'
  })
  readonly newOwnerId: string;
}
