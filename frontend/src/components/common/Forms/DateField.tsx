import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';

interface DateFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name' | 'type'> {
  name: Path<T>;
  control: Control<T>;
  label: string;
}

function DateField<T extends FieldValues>({
  name,
  control,
  label,
  ...textFieldProps
}: DateFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...textFieldProps}
          type="date"
          label={label}
          error={!!error}
          helperText={error?.message}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      )}
    />
  );
}

export default DateField;
