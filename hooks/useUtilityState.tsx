import { cloneDeep, isEqual, set } from 'lodash-es';
import { useCallback, useMemo, useState } from 'react';

type PropertyPath = (string | number | symbol)[];
// nested object 내의 모든 property path를 array로 표현하는 타입
// ex :  ['a', 'b', 'c'] | ['a', 'b', 'd'] | ['a', 'e'] | ['f']
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

const useUtilityState = <T extends object>(value: T) => {
  const [currentState, setCurrentState] = useState<T>(cloneDeep(value));
  const [initState, setInitState] = useState<T>(cloneDeep(value));

  // currentState를 initState로 reset한다.
  const returnToInit = useCallback(() => {
    setCurrentState(cloneDeep(initState));
  }, [initState]);

  // initState를 currentState로 update한다.
  const updateInit = useCallback(() => {
    setInitState(cloneDeep(currentState));
  }, [currentState]);

  // useUtilityState 전체를 초기화 한다. ex : fetch 데이터 받은 후에 init state, current state를 fetch 데이터로 초기화 할 때
  const reInitialize = useCallback((value: T) => {
    setCurrentState(cloneDeep(value));
    setInitState(cloneDeep(value));
  }, []);

  // CurrentState를 업데이트 한다. setCurrentState와 동일
  const setCurrent = useCallback((nextValue: T | ((prev: T) => T)) => {
    if (typeof nextValue === 'function') {
      setCurrentState((prev) => nextValue(prev));
    } else {
      setCurrentState(nextValue);
    }
  }, []);
  // CurrentState의 특정 target을 업데이트 한다.
  const setCurrentTarget = useCallback(
    <K extends PropertyPathAsArr<T>>(
      target: K,
      value: PropertyValueFromArr<T, K>,
    ) => {
      const targetAsPropertyPath = target as PropertyPath;
      setCurrentState((prev) =>
        set(cloneDeep(prev), targetAsPropertyPath, value),
      );
    },
    [],
  );
  // initState와 currentState가 같은지 비교한다.
  const isSame = useMemo(() => {
    return isEqual(currentState, initState);
  }, [currentState, initState]);

  return {
    currentState,
    initState,
    isSame,
    reInitialize,
    returnToInit,
    updateInit,
    setCurrent,
    setCurrentTarget,
  } as const;
};

export default useUtilityState;
