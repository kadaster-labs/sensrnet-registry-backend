import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class TransferOwnershipBody {
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'The id of the new organization.',
  })
  readonly newOrganizationId: string;
}
