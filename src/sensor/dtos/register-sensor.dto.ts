import { LocationDto } from './sensor.dto';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsObject, IsUUID, IsArray, IsString, IsBoolean } from 'class-validator';


export class RegisterSensorDto {
    @IsUUID("4")
    readonly id!: string;

    @IsUUID("4")
    readonly nodeId!: string;

    @IsArray()
    @ApiModelProperty()
    readonly ownerIds!: Array<string>;

    @IsObject()
    @ApiModelProperty()
    readonly location!: LocationDto;

    @IsString()
    @ApiModelProperty()
    readonly legalBase: string;
  
    @IsBoolean()
    @ApiModelProperty()
    readonly active: boolean;
  
    @IsString()
    @ApiModelProperty()
    readonly typeName!: string;
  
    @IsObject()
    @ApiModelProperty()
    readonly typeDetails: object;
  
    @IsArray()
    @ApiModelProperty()
    readonly dataStreams!: Array<string>;
  }
