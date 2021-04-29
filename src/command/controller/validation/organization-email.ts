import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'organizationEmailValidator', async: false })
export class OrganizationEmailValidator implements ValidatorConstraintInterface {
    public supportedNames = [
        'info', 'sensor', 'beheer', 'privacy', 'kcc', 'service', 'klant', 'gemeente', 'support', 'help', 'ondersteuning',
        'informatie', 'management', 'team', 'afdeling', 'data',
    ];
    public validatorRegex = new RegExp(`^.*(${this.supportedNames.join('|')}).*@.+[.].+$`);

    validate(email: string): boolean {
        return this.validatorRegex.test(email);
    }

    defaultMessage(args: ValidationArguments): string {
        let stringValue = '';

        const supportedDomainNamesLength = this.supportedNames.length;
        for (let i = 0; i < supportedDomainNamesLength; i++) {
            if (i === supportedDomainNamesLength - 1) {
                stringValue += `'${this.supportedNames[i]}'`;
            } else if (i === supportedDomainNamesLength - 2) {
                stringValue += `'${this.supportedNames[i]}' or `;
            } else {
                stringValue += `'${this.supportedNames[i]}', `;
            }
        }

        return `${args.property} must be a valid e-mail and contain either ${stringValue}.`;
    }
}
