import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';


export class TransferOwnershipBody {

  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty()
  readonly oldOwnerId: string;

  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty()
  readonly newOwnerId: string;
}
