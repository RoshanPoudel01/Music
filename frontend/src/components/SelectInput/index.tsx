import { Field } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { FC, ReactNode } from "react";
import { Control, Controller } from "react-hook-form";
import { FieldProps } from "../ui/field";
// interface IOption extends OptionBase {
//   label: string;
//   value: string;
//   icon?: ReactNode;
//   iconColor?: string;
// }

interface ISelectInputProps {
  name: string;
  control?: Control<any>;
  label?: string;
  helperText?: string;
  backendError?: string[];
  startElement?: ReactNode;
  endElement?: ReactNode;
  isMulti?: boolean;
  isControlled?: boolean;
  options: any;
  menuPortalTarget?: HTMLElement;
  value?: { value: string; label: string } | null;
  handleChange?: (value: any) => void;
  placeholder?: string;
}

const SelectInput: FC<ISelectInputProps & FieldProps> = ({
  name,
  control,
  options,
  label,
  isMulti,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Field.Root>
          <Field.Label>{label}</Field.Label>
          <Select
            name={name}
            isMulti={isMulti}
            onChange={onChange}
            value={value}
            options={options}
          />
          {error && <Field.ErrorText>{error.message}</Field.ErrorText>}
        </Field.Root>
      )}
    />
  );
};

export default SelectInput;
