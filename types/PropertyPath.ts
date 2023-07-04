/*
  sample object : {
    a: {
      b: {
        c: 1,
        d: 2,
      },
      e: 3,
    },
    f: 4,
  }
*/

// !. 해당 타입 object 타입에만 동작, 그 외는 never 타입

// nested object 내의 모든 property path를 string으로 표현하는 타입
// ex :  'a.b.c' | 'a.b.d' | 'a.e' | 'f'
type PropertyPathAsStr<T> = T extends object
  ? {
      [K in Extract<keyof T, string>]: K | `${K}.${PropertyPathAsStr<T[K]>}`;
    }[Extract<keyof T, string>]
  : never;

// nested object 내의 모든 property path를 array로 표현하는 타입
// ex :  ['a', 'b', 'c'] | ['a', 'b', 'd'] | ['a', 'e'] | ['f']
type PropertyPathAsArr<T> = T extends object
  ? {
      [K in keyof T]: [K] | [K, ...PropertyPathAsArr<T[K]>];
    }[keyof T]
  : never;
