import { Field } from "@artist/components/ui/field";
import { RadioCardItem, RadioCardRoot } from "@artist/components/ui/radio-card";
import { ConditionalValue, HStack } from "@chakra-ui/react";
import { FC, ReactElement } from "react";
import { Control, Controller } from "react-hook-form";

interface RadioCardProps {
  name: string;
  control: Control<any>;
  label: string;
  options?: { label: string; value: string; icon?: ReactElement }[];
  flexDir?: ConditionalValue<"row" | "column">;
  backendError?: string[];
  required?: boolean;
  readOnly?: boolean;
  helperText?: string;
}
const RadioCard: FC<RadioCardProps> = ({
  name,
  control,
  label,
  options,
  flexDir,
  required,
  readOnly,
  helperText,
  backendError,
}) => {
  name === "is_active"
    ? (options = [
        { label: "Active", value: "1" },
        { label: "Inactive", value: "0" },
      ])
    : options;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { name, value, onChange }, fieldState: { error } }) => (
        <Field
          label={label}
          invalid={!!error || !!backendError?.length}
          errorText={backendError?.[0] ?? error?.message}
          required={required}
          readOnly={readOnly}
          helperText={helperText}
        >
          <RadioCardRoot
            name={name}
            value={value}
            onValueChange={({ value }) => onChange(value)}
            colorPalette={"primary"}
          >
            <HStack direction={flexDir ?? "row"} align={"stretch"}>
              {options?.map((option) => (
                <RadioCardItem
                  indicator={false}
                  key={option.value}
                  icon={option.icon}
                  value={option.value}
                  label={option.label}
                />
              ))}
            </HStack>
          </RadioCardRoot>
        </Field>
      )}
    />
  );
};

export default RadioCard;
