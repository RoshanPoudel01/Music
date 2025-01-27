import { create } from "zustand";

interface ISettingData {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
  description: string;
  facebook: string;
  instagram: string;
  youtube: string;
  google_map: string;
  google_password: string;
}

interface ISettingDataStore {
  settingData?: ISettingData;
  setSettingData: (settingData: ISettingData) => void;
}

export const useStoreSettingData = create<ISettingDataStore>((set) => ({
  settingData: undefined,
  setSettingData: (settingData) => set((state) => ({ ...state, settingData })),
}));
