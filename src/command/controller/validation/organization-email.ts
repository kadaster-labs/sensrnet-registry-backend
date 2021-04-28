import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Logger } from '@nestjs/common';

@ValidatorConstraint({ name: 'organizationEmailValidator', async: false })
export class OrganizationEmailValidator implements ValidatorConstraintInterface {
    public supportedDomainNames = ['info', 'sensor', 'beheer', 'privacy', 'kcc', 'service', 'klant', 'gemeente'];
    public validatorRegex = new RegExp(`^.*(${this.supportedDomainNames.join('|')}).*@.+[.].+$`);

    validate(email: string): boolean {
        return this.validatorRegex.test(email);
    }

    defaultMessage(args: ValidationArguments): string {
        let stringValue = '';

        const supportedDomainNamesLength = this.supportedDomainNames.length;
        for (let i = 0; i < supportedDomainNamesLength; i++) {
            if (i === supportedDomainNamesLength - 1) {
                stringValue += `'${this.supportedDomainNames[i]}'`;
            } else if (i === supportedDomainNamesLength - 2) {
                stringValue += `'${this.supportedDomainNames[i]}' or `;
            } else {
                stringValue += `'${this.supportedDomainNames[i]}', `;
            }
        }

        return `${args.property} must be a valid e-mail and contain either ${stringValue}.`;
    }
}
