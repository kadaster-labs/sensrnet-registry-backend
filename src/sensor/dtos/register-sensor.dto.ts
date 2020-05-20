import { Type } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';
import { LocationDto, DataStreamDto } from './sensor.dto';
import { IsObject, IsUUID, IsArray, IsString, IsBoolean, 
  ValidateNested } from 'class-validator';


export class RegisterSensorDto {
    @IsUUID("4")
    readonly id!: string;

    @IsUUID("4")
    readonly nodeId!: string;

    @IsUUID("4", {each: true})
    @ApiModelProperty()
    readonly ownerIds!: Array<string>;

    @IsObject()
    @ApiModelProperty()
    readonly location!: LocationDto;

    @IsString()
    @ApiModelProperty()
    readonly legalBase?: string;
  
    @IsBoolean()
    @ApiModelProperty()
    readonly active!: boolean;
  
    @IsString()
    @ApiModelProperty()
    readonly typeName!: string;
  
    @IsObject()
    @ApiModelProperty()
    readonly typeDetails?: object;

    @IsArray()
    @ApiModelProperty({ type: DataStreamDto, isArray: true })
    @Type(() => DataStreamDto)
    @ValidateNested({ each: true })
    dataStreams!: Array<DataStreamDto>;
  }
