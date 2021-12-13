import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

export function isLatLong(location: number[]): boolean {
    return location[0] >= -180 && location[0] <= 180 && location[1] >= -90 && location[1] <= 90;
}

@ValidatorConstraint({ name: 'locationValidator', async: false })
export class LongitudeLatitudeValidator implements ValidatorConstraintInterface {
    validate(location: number[]): boolean {
        return isLatLong(location);
    }

    defaultMessage(args: ValidationArguments): string {
        return `${args.property} could not be interpreted as [long, lat, ..]`;
    }
}
