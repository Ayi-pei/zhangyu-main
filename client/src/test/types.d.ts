/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

declare namespace Vi {
  interface Assertion<T = any> extends jest.Matchers<void, T> {}
  interface AsymmetricMatchersContaining extends jest.Matchers<void, any> {}
}

declare module 'vitest' {
  interface Assertion<T = any> extends Vi.Assertion<T> {}
  interface AsymmetricMatchersContaining extends Vi.AsymmetricMatchersContaining {}
}

declare const vi: typeof import('vitest').vi;
declare const expect: typeof import('vitest').expect; 