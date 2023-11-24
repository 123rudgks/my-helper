'use client';

import { RefObject, useEffect } from 'react';

// 자기자신 또는 자신의 자식들 외의 클릭을 하였을 경우에만 콜백을 실행하는 훅
// 드롭다운과 같이 열려있을 때 외부를 클릭하면 닫혀야 하는 경우에 사용
const useClickOutside = (
  ref: RefObject<HTMLElement> | null,
  callback?: () => void
) => {
  useEffect(() => {
    const clickOutsideHandler = (e: MouseEvent) => {
      if (ref?.current && !ref.current.contains(e.target as HTMLElement)) {
        callback && callback();
      }
    };
    const modalEl = document.getElementById('modal-root');
    modalEl
      ? modalEl?.addEventListener('click', clickOutsideHandler)
      : document.addEventListener('click', clickOutsideHandler);
    return () => {
      document.removeEventListener('click', clickOutsideHandler);
      modalEl?.removeEventListener('click', clickOutsideHandler);
    };
  }, [ref, callback]);
};

export default useClickOutside;
