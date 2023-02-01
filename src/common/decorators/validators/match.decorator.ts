import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'match', async: false })
@Injectable()
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    // Get the property to compare with
    const [relatedPropertyName] = args.constraints;

    // Get the object being validated
    const object = args.object as any;

    if (object?.[relatedPropertyName] === undefined) {
      return true;
    }

    // Return true if the value matches the related property
    return object && value === object[relatedPropertyName];
  }

  defaultMessage(args: ValidationArguments) {
    // Get the display name of the related property
    const [relatedPropertyName] = args.constraints;

    const object = args.object as any;

    // Return a default error message
    return `Password "$value" is not matched with value "${object[relatedPropertyName]}"`;
  }
}

export function Match(
  relatedPropertyName,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [relatedPropertyName],
      validator: MatchConstraint,
    });
  };
}
