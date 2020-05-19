import { ApiModelProperty } from '@nestjs/swagger';
import { IsUUID, IsUrl, IsString } from 'class-validator';


export class UpdateOwnerDto {
  @IsUUID("4")
  readonly id!: string;

  @IsString()
  @ApiModelProperty()
  readonly email?: string;

  @IsString()
  @ApiModelProperty()
  readonly publicName?: string;

  @IsString()
  @ApiModelProperty()
  readonly name?: string;

  @IsString()
  @ApiModelProperty()
  readonly companyName?: string;

  @IsUrl()
  @ApiModelProperty()
  readonly website?: string;
}
