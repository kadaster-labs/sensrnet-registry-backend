import { IsUUID } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';


export class OwnerIdDto {
  @IsUUID("4")
  @ApiModelProperty()
  readonly id!: string;
}
