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
// propertyPath가 문자열일 경우의 해당 path의 value 타입
type PropertyValueFromStr<
  T,
  K extends string,
> = K extends `${infer K1}.${infer K2}`
  ? K1 extends keyof T
    ? PropertyValueFromStr<T[K1], K2>
    : never
  : K extends keyof T
  ? T[K]
  : never;
// nested object 내의 모든 property path를 array로 표현하는 타입
// ex :  ['a', 'b', 'c'] | ['a', 'b', 'd'] | ['a', 'e'] | ['f']
// ! : 자동완성 시에 ['a','f', ] 이 상태에서 자동완성을 할 경우에 b의 경로의 있는 c, d가 추천된다. 하지만 막상 값을 넣으면 에러가 난다.

type PropertyPathAsArr<T> = T extends object
  ? {
      [K in keyof T]: [K] | [K, ...PropertyPathAsArr<T[K]>];
    }[keyof T]
  : never;
// propertyPath가 배열일 경우의 해당 path의 value 타입
type PropertyValueFromArr<T, K> = K extends [infer K1, ...infer K2]
  ? K1 extends keyof T
    ? K2 extends []
      ? T[K1]
      : PropertyValueFromArr<T[K1], K2>
    : never
  : never;
