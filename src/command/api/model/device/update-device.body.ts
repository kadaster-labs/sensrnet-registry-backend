import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, MaxLength, IsObject, IsEnum } from 'class-validator';
import { Category } from '../../../model/category.model';
import { UpdateLocationBody } from '../location/update-location.body';
import { DeviceBody } from './device.body';

export class UpdateDeviceBody extends DeviceBody {
    @IsString()
    @IsOptional()
    @MaxLength(255)
    @ApiProperty({
        type: String,
        required: false,
        description: 'The device name.',
    })
    readonly name: string;

    @IsString()
    @IsOptional()
    @IsEnum(Category)
    @MaxLength(255)
    @ApiProperty({
        type: String,
        required: false,
        description: 'The device category.',
    })
    readonly category: Category;

    @IsObject()
    @IsOptional()
    @ApiProperty({
        type: UpdateLocationBody,
        required: false,
    })
    @Type(() => UpdateLocationBody)
    readonly location: UpdateLocationBody;
}
