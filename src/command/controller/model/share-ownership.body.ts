import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ShareOwnershipBody {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    isArray: true,
    description: 'The ownerId(s) of the new co-owner(s).',
  })
  @IsUUID(4, {each: true})
  readonly ownerIds: string[];
}
