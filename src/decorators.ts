import { SERIALISER_KEY_PARAMETER } from "./types";

import type { SerialiseFunction, SerialiseParametersMeta } from "./types";

export function SerialiseParam<T>(cb: SerialiseFunction<T>): ParameterDecorator {
  return function (target, propertyName, parameterIndex) {
    const existingSerialiseParameters: SerialiseParametersMeta<T> =
      Reflect.getOwnMetadata(SERIALISER_KEY_PARAMETER, target, propertyName) || new Map();

    existingSerialiseParameters.set(parameterIndex, cb);

    Reflect.defineMetadata(SERIALISER_KEY_PARAMETER, existingSerialiseParameters, target, propertyName);
  };
}

export function Serialise<T = unknown>(returnSerialiseFunction?: SerialiseFunction<T>): MethodDecorator {
  return function (target, propertyName, descriptor: PropertyDescriptor) {
    const _func = descriptor.value;

    const serialiseParameters = (...args: any[]) => {
      const serialiseParameterMeta: SerialiseParametersMeta<any> = Reflect.getOwnMetadata(
        SERIALISER_KEY_PARAMETER,
        target,
        propertyName
      );

      const parsedArgs = args;
      if (serialiseParameterMeta) {
        for (const [index, value] of args.entries()) {
          const serialiseFunc = serialiseParameterMeta.get(index);
          parsedArgs[index] = serialiseFunc ? serialiseFunc(value) : value;
        }
      }

      return parsedArgs;
    };

    const serialiseResponse = (result: any | Promise<any>) => {
      if (!returnSerialiseFunction) {
        return result;
      }

      if (result instanceof Promise) {
        return result.then(returnSerialiseFunction);
      }

      return returnSerialiseFunction(result);
    };

    // assign wrapped function
    descriptor.value = function (...args: any[]) {
      const parsedArgs = serialiseParameters(...args);
      const result = _func.apply(this, parsedArgs);
      return serialiseResponse(result);
    };

    return descriptor;
  };
}
