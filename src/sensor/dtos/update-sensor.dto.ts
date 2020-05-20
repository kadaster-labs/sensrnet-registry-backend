import { ApiModelProperty } from '@nestjs/swagger';
import { IsObject, IsUUID, IsString } from 'class-validator';


export class UpdateSensorDetailsDto {
  @IsUUID("4")
  readonly id!: string;

  @IsString()
  @ApiModelProperty()
  readonly legalBase?: string;

  @IsString()
  @ApiModelProperty()
  readonly typeName?: string;

  @IsObject()
  @ApiModelProperty()
  readonly typeDetails?: object;

  @IsString()
  @ApiModelProperty()
  readonly comment?: string;
}

export class TransferSensorOwnershipDto {
  @IsUUID("4")
  readonly id!: string;

  @IsUUID("4")
  @ApiModelProperty()
  readonly oldOwnerId!: string;

  @IsUUID("4")
  @ApiModelProperty()
  readonly newOwnerId!: string;
}

export class ShareSensorOwnershipDto {
  @IsUUID("4")
  readonly id!: string;

  @IsString()
  @ApiModelProperty()
  readonly newOwnerId!: string;
}
