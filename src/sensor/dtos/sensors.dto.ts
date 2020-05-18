import { ApiModelProperty } from '@nestjs/swagger';
import { IsUUID, IsInstance, IsObject, IsNumber, IsString } from 'class-validator';

export class SensorIdRequestParamsDto {
  @IsUUID("4")
  readonly sensorId!: string;
}

export class LocationDto {
  @IsNumber()
  @ApiModelProperty()
  readonly lon!: number;
  @IsNumber()
  @ApiModelProperty()
  readonly lat!: number;
  @IsNumber()
  @ApiModelProperty()
  readonly height!: number;
  @IsString()
  @ApiModelProperty()
  readonly baseObjectId!: string;
}

export class SensorDto {
  @IsUUID("4")
  readonly sensorId!: string;
  @IsUUID("4")
  @ApiModelProperty()
  readonly nodeId!: string;
  @IsUUID("4")
  @ApiModelProperty()
  readonly ownerId!: string;
  @IsObject()
  @ApiModelProperty()
  readonly location!: LocationDto;
  @IsString()
  @ApiModelProperty()
  readonly legalBase!: string;
  @IsString()
  @ApiModelProperty()
  readonly typeName!: string; // E.g. sensor; camera; beacon.
  @IsObject()
  @ApiModelProperty()
  readonly typeDetails!: object;
}
