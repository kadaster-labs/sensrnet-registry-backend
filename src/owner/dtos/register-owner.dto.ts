import { ApiModelProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsUrl } from 'class-validator';


export class RegisterOwnerDto {
    @IsUUID("4")
    readonly id!: string;

    @IsUUID("4")
    readonly nodeId!: string;

    @IsString()
    @ApiModelProperty()
    readonly email!: string;

    @IsString()
    @ApiModelProperty()
    readonly publicName?: string;

    @IsString()
    @ApiModelProperty()
    readonly name!: string;
  
    @IsString()
    @ApiModelProperty()
    readonly companyName?: string;
  
    @IsUrl()
    @ApiModelProperty()
    readonly website?: string;
  }
