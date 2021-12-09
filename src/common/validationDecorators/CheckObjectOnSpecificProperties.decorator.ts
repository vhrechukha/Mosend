import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function CheckObjectOnSpecificProperties(property: (string | string[])[], validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'CheckObjectOnSpecificProperties',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const argumentsMain = args.constraints[0];
                    if (argumentsMain[0] in value) {
                        return value[argumentsMain[0]].every(el => argumentsMain[1][0] in el && argumentsMain[1][1] in el)
                    }
                    return false;
                },
            },
        });
    };
}
