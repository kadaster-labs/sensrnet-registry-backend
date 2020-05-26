import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';


export class CreateOwnerBody {
 
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly ssoId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;
  
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly publicName: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;
  
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly companyName: string;
  
  @IsUrl()
  @IsOptional()
  @ApiProperty()
  readonly website: string;
}
