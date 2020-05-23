import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl } from 'class-validator';


export class CreateBody {
 
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly ssoId?: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly email!: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly publicName?: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name!: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly companyName?: string;
  
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty()
  readonly website?: string;
}
