import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { LocationBody } from './location-body';
import { DataStreamBody } from './datastream-body';
import { IsString, IsNotEmpty, IsBoolean, IsUUID, IsObject, IsArray, 
  ValidateNested, IsOptional } from 'class-validator';


export class CreateSensorBody {
 
  @IsNotEmpty()
  @ApiProperty()
  @IsUUID(4, {each: true})
  readonly ownerIds: Array<string>;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  readonly location: LocationBody;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly legalBase: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly active: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly typeName: string;

  @IsObject()
  @IsOptional()
  @ApiProperty()
  readonly typeDetails: object;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: DataStreamBody, isArray: true })
  @Type(() => DataStreamBody)
  @ValidateNested({ each: true })
  readonly dataStreams: Array<DataStreamBody>;
}
