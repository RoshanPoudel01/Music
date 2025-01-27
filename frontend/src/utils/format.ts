import { ReactNode } from "react";

export interface IFormatSelectOptionParams {
  data: any;
  labelKey: string;
  labelHelper?: string;
  valueKey: number | string;
  defaultLabel?: string;
  defaultValue?: any;
  icon?: ReactNode;
}

export interface ISelectOptions<T extends number | string | boolean> {
  label: string;
  value: T;
  icon?: ReactNode;
}

export function formatSelectOptions({
  data,
  labelKey,
  labelHelper,
  valueKey,
  defaultLabel,
  defaultValue,
}: IFormatSelectOptionParams) {
  const formattedData =
    data?.map((item: any) => {
      return {
        label: `${item?.[labelKey]}${
          labelHelper ? ` (${item?.[labelHelper]})` : ""
        }`,
        value: item?.[valueKey],
        icon: item?.icon,
      };
    }) ?? [];
  if (defaultLabel)
    return [
      { label: defaultLabel, value: defaultValue ?? null },
      ...formattedData,
    ];
  else return formattedData;
}
