import { Field } from "@artist/components/ui/field";
import { RadioCardItem, RadioCardRoot } from "@artist/components/ui/radio-card";
import { HStack, Icon, RadioCardRootProps } from "@chakra-ui/react";
import { FC } from "react";
import { Control, Controller } from "react-hook-form";

interface IOption {
  value: string;
  label: string;
  icon?: JSX.Element;
}

interface IStatusRadioProps {
  name?: string;
  control: Control<any>;
  label?: string;
  helperText?: string;
  backendError?: string[];
  required?: boolean;
  options?: IOption[];
}

const items = [
  { value: "1", label: "Active" },
  { value: "0", label: "Inactive" },
];

const StatusRadio: FC<IStatusRadioProps & RadioCardRootProps> = ({
  name,
  control,
  label,
  helperText,
  backendError,
  required,
  options,
  ...rest
}) => {
  return (
    <Controller
      name={name ?? "is_active"}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Field
          invalid={!!error || !!backendError?.length}
          errorText={backendError?.[0] ?? error?.message}
          helperText={helperText}
          readOnly={rest.readOnly}
          required={required}
          label={label ?? "Status"}
        >
          <RadioCardRoot
            orientation="horizontal"
            align="center"
            justify="center"
            maxW="100%"
            value={value}
            borderColor={"gray.300"}
            onValueChange={(option) => onChange(option.value)}
          >
            <HStack align="stretch" flexWrap={"wrap"}>
              {options
                ? options.map((item) => (
                    <RadioCardItem
                      label={item.label}
                      icon={
                        item.icon && (
                          <Icon fontSize="2xl" color="fg.subtle">
                            {item.icon}
                          </Icon>
                        )
                      }
                      indicator={false}
                      key={item.value}
                      value={item.value}
                      cursor={"pointer"}
                    />
                  ))
                : items.map((item) => (
                    <RadioCardItem
                      label={item.label}
                      indicator={false}
                      key={item.value}
                      value={item.value}
                    />
                  ))}
            </HStack>
          </RadioCardRoot>
        </Field>
      )}
    />
  );
};

export default StatusRadio;
