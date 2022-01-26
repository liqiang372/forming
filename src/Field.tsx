import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext, useFormErrors } from './FormContext';
import { useDebouncedCallback } from 'use-debounce';
interface FieldChildParams {
  value: any;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  updateValue: (val: any) => void;
  errors?: { rule: string; message?: string }[];
  isValidating: boolean;
}
export interface FieldProps {
  name: string;
  children: (params: FieldChildParams) => React.ReactElement;
  validate?: Record<
    string,
    string | ((val: any) => boolean | string | Promise<boolean | string>)
  >;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateDebouncedTime?: number;
}

export function Field({
  name,
  children,
  validate,
  validateOnBlur = false,
  validateOnChange = false,
  validateDebouncedTime,
}: FieldProps) {
  const { formState } = useFormContext();
  const { errors } = useFormErrors(name);
  const initialValue = formState.getValue(name);
  const [value, setValue] = useState<any>(initialValue ?? '');
  const [isValidating, setIsValidating] = useState(false);
  const validateFn = validateDebouncedTime
    ? useDebouncedCallback(async () => {
        setIsValidating(true);
        await formState.validate(name);
        setIsValidating(false);
      }, validateDebouncedTime)
    : useCallback((name: string) => {
        formState.validate(name);
      }, []);

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
      validateFn(name);
    }
  };

  const updateValue = (val: any) => {
    setValue(val);
    formState.setValue(name, val);
    if (validate) {
      validateFn(name);
    }
  };

  const onBlur = () => {
    if (validate && validateOnBlur) {
      formState.validate(name);
    }
  };

  return children({
    value: initialValue,
    onChange,
    onBlur,
    updateValue,
    errors,
    isValidating,
  });
}
