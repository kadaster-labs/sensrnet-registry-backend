import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject, IsOptional } from 'class-validator';


export class UpdateSensorBody {
 
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly legalBase: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly typeName: string;

  @IsObject()
  @IsOptional()
  @ApiProperty()
  readonly typeDetails: object;
}
