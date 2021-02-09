import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'locationValidator', async: false })
export class LongitudeLatitudeValidator implements ValidatorConstraintInterface {
    validate(location: number[]): boolean {
        return location[0] >= -180 && location[0] <= 180 && location[1] >= -90 && location[1] <= 90;
    }

    defaultMessage(args: ValidationArguments): string {
        return `${args.property} could not be interpreted as [long, lat, ..]`;
    }
}
