import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IInitData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
  dob: string;
  gender?: string;
}

interface IInitDataStore {
  initData?: IInitData;
  setInitData: (initData: IInitData) => void;
}

export const useInitDataStore = create<IInitDataStore>(
  persist(
    (set) => ({
      initData: undefined,
      setInitData: (initData) => set((state) => ({ ...state, initData })),
    }),
    {
      name: "initData",
    }
  )
);
