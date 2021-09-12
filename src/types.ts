export type SerialiseFunction<T> = (v: any) => T;
export type SerialiseParametersMeta<T> = Map<number, SerialiseFunction<T>>;

export const SERIALISER_KEY_PARAMETER = Symbol("serialise_parameter");
