/* eslint-disable @typescript-eslint/no-unused-vars */
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isLatLong } from './location';

// Code inspired by https://gitlab.com/mjbecze/GeoJSON-Validation/-/blob/master/index.js

/** Formats error messages, calls the callback */
function _done(trace, message) {
    let valid = false;

    if (typeof message === 'string') {
        message = [message];
    } else if (Object.prototype.toString.call(message) === '[object Array]') {
        if (message.length === 0) {
            valid = true;
        }
    } else {
        valid = true;
    }

    if (trace) {
        return message;
    } else {
        return valid;
    }
}

/** Test an object to see if it is a function */
function isFunction(object) {
    return typeof object === 'function';
}

const definitions = {};

/** Calls a custom definition if one is avalible for the given type */
function _customDefinitions(type, object) {
    let errors;

    if (isFunction(definitions[type])) {
        try {
            errors = definitions[type](object);
        } catch (e) {
            errors = ['Problem with custom definition for ' + type + ': ' + e];
        }
        if (typeof errors === 'string') {
            errors = [errors];
        }
        if (Object.prototype.toString.call(errors) === '[object Array]') {
            return errors;
        }
    }
    return [];
}

/** Determines if an object is a position or not */
function isPosition(position, trace = false) {
    let errors = [];

    // It must be an array
    if (Array.isArray(position)) {
        // and the array must have more than one element
        if (position.length <= 1) {
            errors.push('Position must be at least two elements');
        }

        position.forEach((pos, index) => {
            if (typeof pos !== 'number') {
                errors.push('Position must only contain numbers. Item ' + pos + ' at index ' + index + ' is invalid.');
            }
        });

        if (!isLatLong(position)) {
            errors.push('Position outside LatLong bounds');
        }
    } else {
        errors.push('Position must be an array');
    }

    // run custom checks
    errors = errors.concat(_customDefinitions('Position', position));
    return _done(trace, errors);
}

/**
 * Determines if an array is a linear Ring String or not
 */
function _linearRingCoor(coordinates, trace) {
    let errors = [];
    if (Array.isArray(coordinates)) {
        // 4 or more positions
        coordinates.forEach((val, index) => {
            const t = isPosition(val, true);
            if (t.length) {
                // modify the err msg from 'isPosition' to note the element number
                t[0] = 'at ' + index + ': '.concat(t[0]);
                // build a list of invalide positions
                errors = errors.concat(t);
            }
        });

        // check the first and last positions to see if they are equivalent
        // TODO: maybe better checking?
        if (coordinates[0].toString() !== coordinates[coordinates.length - 1].toString()) {
            errors.push('The first and last positions must be equivalent');
        }

        if (coordinates.length < 4) {
            errors.push('coordinates must have at least four positions');
        }
    } else {
        errors.push('coordinates must be an array');
    }

    return _done(trace, errors);
}

/** Determines if an array is valid Polygon Coordinates or not */
function isPolygonCoor(coordinates, trace = false) {
    let errors = [];
    if (Array.isArray(coordinates)) {
        coordinates.forEach((val, index) => {
            const t = _linearRingCoor(val, true);

            if (t.length) {
                // modify the err msg from 'isPosition' to note the element number
                t[0] = 'at ' + index + ': '.concat(t[0]);
                // build a list of invalid positions
                errors = errors.concat(t);
            }
        });
    } else {
        errors.push('coordinates must be an array');
    }

    return _done(trace, errors);
}

@ValidatorConstraint({ name: 'polygonCoordinates', async: false })
export class PolygonCoordinates implements ValidatorConstraintInterface {
    errors = [];

    validate(coordinates: any, args: ValidationArguments): boolean {
        const valid: boolean = isPolygonCoor(coordinates);

        if (!valid) {
            this.errors = isPolygonCoor(coordinates, true);
        }

        return isPolygonCoor(coordinates);
    }

    defaultMessage(args: ValidationArguments) {
        // errors is a list, but can only return 1 message for this validation
        return this.errors[0];
    }
}
