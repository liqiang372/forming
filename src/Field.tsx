import React, { useEffect, useState } from 'react';
import { useFormContext, useFormErrors } from './FormContext';

interface FieldChildParams {
  value: any;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  updateValue: (val: any) => void;
  errors?: { rule: string; message?: string }[];
}
export interface FieldProps {
  name: string;
  children: (params: FieldChildParams) => React.ReactElement;
  validate?: Record<string, string | ((val: any) => boolean | string)>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function Field({
  name,
  children,
  validate,
  validateOnBlur = false,
  validateOnChange = false,
}: FieldProps) {
  const { formState } = useFormContext();
  const { errors } = useFormErrors(name);
  const initialValue = formState.getValue(name);
  const [value, setValue] = useState<any>(initialValue ?? '');

  useEffect(() => {
    if (validate) {
      formState.setValidateRules(name, validate);
    }
  }, [validate, name]);

  const onChange = (e: React.ChangeEvent<any>) => {
    e.stopPropagation();
    const val = e.target.value;
    setValue(val);
    formState.setValue(name, val);
    if (validate && validateOnChange) {
      formState.validate(name);
    }
  };

  const updateValue = (val: any) => {
    setValue(val);
    formState.setValue(name, val);
    if (validate) {
      formState.validate(name);
    }
  };

  const onBlur = () => {
    if (validate && validateOnBlur) {
      formState.validate(name);
    }
  };

  return children({
    value,
    onChange,
    onBlur,
    updateValue,
    errors,
  });
}
