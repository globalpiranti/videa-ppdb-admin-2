import { createContext, useEffect, useState } from "react";

export type ModalControl = {
  show: () => void;
  hide: () => void;
  shown: boolean;
};

export const ModalContext = createContext(
  {} as {
    container: React.MutableRefObject<HTMLDivElement>;
  }
);

export default function useModal<T = any>({
  defaultState,
}:
  | {
      defaultState?: T;
    }
  | undefined = {}) {
  const [shown, setShown] = useState(false);
  const [state, setState] = useState<T>();

  useEffect(() => {
    setState(defaultState);
  }, [defaultState]);

  return {
    state: { set: setState, value: state },
    control: {
      show: () => setShown(true),
      hide: () => setShown(false),
      shown,
    } as ModalControl,
  };
}
