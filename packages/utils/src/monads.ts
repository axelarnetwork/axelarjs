/**
 * Minimal implementation of a Maybe monad
 * loosely based on https://github.com/patrickmichalina/typescript-monads/blob/master/src/maybe/maybe.ts
 */
export class Maybe<T> {
  private _value: T | undefined | null;

  private _isNone = false;

  constructor(value?: T | null) {
    this._value = value;
    this._isNone = value === null || value === undefined;
  }

  static of<T>(value?: T) {
    return new Maybe(value);
  }

  static ofFalsy<T>(value?: T) {
    return new Maybe(value ? value : undefined);
  }

  get isSome() {
    return this._isNone === false;
  }

  valueOr<U>(defaultValue: U): T | U {
    if (this.isSome) {
      return this._value as NonNullable<T>;
    }

    return defaultValue;
  }

  map<U>(fn: (value: NonNullable<T>) => U) {
    if (this.isSome) {
      return Maybe.of(fn(this._value as NonNullable<T>));
    }

    return new Maybe<U>(undefined);
  }

  mapOr<U>(defaultValue: U, fn: (value: NonNullable<T>) => U): U {
    if (this.isSome) {
      return fn(this._value as NonNullable<T>);
    }

    return defaultValue;
  }

  mapOrUndefined<U>(fn: (value: NonNullable<T>) => U): U | undefined {
    return this.mapOr(undefined, fn);
  }

  mapOrNull<U>(fn: (value: NonNullable<T>) => U): U | null {
    return this.mapOr(null, fn);
  }
}
