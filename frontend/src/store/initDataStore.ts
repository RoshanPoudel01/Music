import { create } from "zustand";

interface IInitData {
  id: number;
  firstName: string;
  lastName: string;
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

export const useInitDataStore = create<IInitDataStore>((set) => ({
  initData: undefined,
  setInitData: (initData) => set((state) => ({ ...state, initData })),
}));
