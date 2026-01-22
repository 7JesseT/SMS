import { TextField, MenuItem } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name' | 'select'> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: SelectOption[];
}

function SelectField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  ...textFieldProps
}: SelectFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...textFieldProps}
          select
          label={label}
          error={!!error}
          helperText={error?.message}
          fullWidth
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}

export default SelectField;
