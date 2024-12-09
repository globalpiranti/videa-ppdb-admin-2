import { Dispatch, SetStateAction, createContext, useContext } from "react";

export const LayoutContext = createContext(
  {} as {
    title: string | undefined;
    setTitle: Dispatch<SetStateAction<string | undefined>>;
    active: string;
    setActive: Dispatch<SetStateAction<string>>;
  }
);

export default function useLayout() {
  return useContext(LayoutContext);
}
