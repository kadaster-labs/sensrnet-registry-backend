import { ApiModelProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsString } from 'class-validator';


export class SensorIdDto {
  @IsUUID("4")
  @ApiModelProperty()
  readonly id!: string;
}


export class DataStreamDto {
  @IsString()
  @ApiModelProperty()
  readonly name!: string;
}


export class LocationDto {
  @IsNumber()
  @ApiModelProperty()
  readonly lat!: number;

  @IsNumber()
  @ApiModelProperty()
  readonly lon!: number; 

  @IsNumber()
  @ApiModelProperty()
  readonly height!: number;

  @IsString()
  @ApiModelProperty()
  readonly baseObjectId: string;
}
