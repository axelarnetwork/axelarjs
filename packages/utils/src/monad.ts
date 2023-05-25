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

/**
 * Minimal implementation of an Either monad
 */
export class Either<L, R> {
  private _value: L | R;
  private _isLeft: boolean;

  constructor(isLeft: boolean, value: L | R) {
    this._isLeft = isLeft;
    this._value = value;
  }

  static left<L, R>(value: L): Either<L, R> {
    return new Either<L, R>(true, value);
  }

  static right<L, R>(value: R): Either<L, R> {
    return new Either<L, R>(false, value);
  }

  isLeft(): boolean {
    return this._isLeft;
  }

  isRight(): boolean {
    return !this._isLeft;
  }

  left(): L | undefined {
    return this._isLeft ? (this._value as L) : undefined;
  }

  right(): R | undefined {
    return this._isLeft ? undefined : (this._value as R);
  }

  map<R2>(fn: (value: R) => R2): Either<L, R2> {
    if (this.isRight()) {
      return Either.right(fn(this._value as R));
    }

    return Either.left(this._value as L);
  }

  mapLeft<L2>(fn: (value: L) => L2): Either<L2, R> {
    if (this.isLeft()) {
      return Either.left(fn(this._value as L));
    }

    return Either.right(this._value as R);
  }

  flatMap<L2, R2>(fn: (value: R) => Either<L2, R2>): Either<L | L2, R2> {
    if (this.isRight()) {
      return fn(this._value as R);
    }

    return Either.left(this._value as L);
  }

  fold<U>(onLeft: (value: L) => U, onRight: (value: R) => U): U {
    return this.isLeft() ? onLeft(this._value as L) : onRight(this._value as R);
  }

  value(): L | R {
    return this._value;
  }
}

/**
 * Minimal implementation of a Result monad that wraps an Either
 */
export class Result<T, E> extends Either<E, T> {
  constructor(either: Either<E, T>) {
    super(either.isLeft(), either.value());
  }

  static ok<T, E>(value: T): Result<T, E> {
    return new Result(Either.right(value));
  }

  static error<T, E>(value: E): Result<T, E> {
    return new Result(Either.left(value));
  }

  static fromEither<T, E>(either: Either<E, T>): Result<T, E> {
    return new Result(either);
  }

  ok(): T | undefined {
    return this.isRight() ? this.right() : undefined;
  }

  error(): E | undefined {
    return this.isLeft() ? this.left() : undefined;
  }

  mapError<E2>(fn: (value: E) => E2): Result<T, E2> {
    return Result.fromEither(super.mapLeft(fn));
  }

  override flatMap<L, R>(fn: (value: T) => Either<L, R>): Result<R, L | E> {
    return Result.fromEither(super.flatMap(fn));
  }
}
