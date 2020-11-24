import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ShareOwnershipBody {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'The id of the new organization.',
  })
  @IsUUID(4)
  readonly organizationId: string;
}
