import { LocationDto } from './sensor.dto';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsObject, IsUUID, IsArray, IsString, IsBoolean } from 'class-validator';


export class UpdateSensorDto {
  @IsUUID("4")
  readonly id!: string;

  @IsArray()
  @ApiModelProperty()
  addOwnerIds?: Array<string>;

  @IsArray()
  @ApiModelProperty()
  removeOwnerIds?: Array<string>;

  @IsObject()
  @ApiModelProperty()
  readonly location?: LocationDto;

  @IsString()
  @ApiModelProperty()
  readonly legalBase?: string;

  @IsBoolean()
  @ApiModelProperty()
  readonly active?: boolean;

  @IsString()
  @ApiModelProperty()
  readonly typeName?: string;

  @IsObject()
  @ApiModelProperty()
  readonly typeDetails?: object;

  @IsArray()
  @ApiModelProperty()
  readonly dataStreams?: Array<string>;

  @IsString()
  @ApiModelProperty()
  readonly comment?: string;
}
