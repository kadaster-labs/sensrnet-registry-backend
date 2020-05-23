import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';


export class UpdateBody {
 
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly ssoId?: string;
  
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly email?: string;
  
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly publicName?: string;
  
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly name?: string;
  
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly companyName?: string;
  
  @IsUrl()
  @IsOptional()
  @ApiProperty()
  readonly website?: string;
}
