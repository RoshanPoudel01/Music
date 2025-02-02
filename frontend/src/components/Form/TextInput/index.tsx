import { Field } from "@artist/components/ui/field";
import { InputGroup } from "@artist/components/ui/input-group";
import { PasswordInput } from "@artist/components/ui/password-input";
import {
  Icon,
  Input,
  InputProps,
  NativeSelectRootProps,
  Textarea,
  TextareaProps,
} from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import { Control, Controller } from "react-hook-form";
interface ITextInputProps {
  name: string;
  control?: Control<any>;
  isControlled?: boolean;
  label?: string;
  helperText?: string;
  backendError?: string[];
  type?: string;
  startElement?: ReactNode;
  endElement?: ReactNode;
}

const TextInput: FC<
  ITextInputProps & InputProps & TextareaProps & NativeSelectRootProps
> = ({
  name,
  control,
  isControlled = true,
  label,
  helperText,
  backendError,
  type,
  startElement,
  endElement,
  ...rest
}) => {
  return isControlled ? (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Field
          label={label}
          invalid={!!error || !!backendError?.length}
          errorText={backendError?.[0] ?? error?.message}
          helperText={helperText}
          readOnly={rest.readOnly}
          required={rest.required}
          hidden={rest.hidden}
        >
          <InputGroup
            flex={"1"}
            startElement={
              startElement && (
                <Icon boxSize={5} asChild>
                  {startElement}
                </Icon>
              )
            }
            endElement={endElement && endElement}
            w={"full"}
          >
            {type === "textarea" ? (
              <Textarea
                size={"xl"}
                colorPalette={"primary"}
                value={value}
                onChange={onChange}
                minH={"150px"}
                borderColor={
                  !!error || !!backendError?.length ? "red.500" : "gray.300"
                }
                focusRing={"inside"}
                {...rest}
              />
            ) : type === "password" ? (
              <PasswordInput
                size={"lg"}
                colorPalette={"primary"}
                value={value}
                onChange={onChange}
                borderColor={
                  !!error || !!backendError?.length ? "red.500" : "gray.300"
                }
                focusRing={"inside"}
                {...rest}
              />
            ) : (
              <Input
                size={"lg"}
                colorPalette={"primary"}
                value={value}
                type={type}
                onChange={onChange}
                borderColor={
                  !!error || !!backendError?.length ? "red.500" : "gray.300"
                }
                focusRing={"inside"}
                onWheel={(e) => {
                  const target = e.target as HTMLInputElement;
                  type == "number" && target.blur();
                }}
                {...rest}
              />
            )}
          </InputGroup>
        </Field>
      )}
    />
  ) : (
    <Field
      label={label}
      helperText={helperText}
      readOnly={rest.readOnly}
      required={rest.required}
    >
      <InputGroup
        flex={"1"}
        startElement={
          startElement && (
            <Icon boxSize={5} asChild>
              {startElement}
            </Icon>
          )
        }
        endElement={
          endElement && (
            <Icon boxSize={5} asChild>
              {endElement}
            </Icon>
          )
        }
        w={"full"}
      >
        <Input
          size={"lg"}
          colorPalette={"primary"}
          type={type}
          onWheel={(e) => {
            const target = e.target as HTMLInputElement;
            type == "number" && target.blur();
          }}
          {...rest}
        />
      </InputGroup>
    </Field>
  );
};

export default TextInput;
