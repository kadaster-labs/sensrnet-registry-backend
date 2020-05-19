import { ApiModelProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';


export class OwnerIdDto {
  @IsUUID("4")
  @ApiModelProperty()
  readonly id!: string;
}
