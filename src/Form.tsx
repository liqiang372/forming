import React, { FormEvent, useRef } from 'react';
import { FormContext } from './FormContext';
import { FormState } from './FormState';
import { FormInitialValues } from './types';

export interface FormProps {
  initialValues?: FormInitialValues;
  validateOnSubmit?: boolean;
  htmlValidate?: boolean;
  children: React.ReactNode;
  onSubmit?: (params: any) => void; // TODO: fix type
}
export function Form({
  initialValues,
  children,
  htmlValidate = false,
  validateOnSubmit,
  onSubmit,
}: FormProps) {
  const formState = useRef<FormState>(new FormState({ initialValues }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validateOnSubmit) {
      await formState.current.validateAll();
    }
    const hasErrors = Object.keys(formState.current.getErrors()).length > 0;
    if (!hasErrors) {
      onSubmit?.({ values: formState.current.getValues() });
    }
  };

  return (
    <FormContext.Provider value={{ formState: formState.current }}>
      <form onSubmit={handleSubmit} noValidate={!htmlValidate}>
        {children}
      </form>
    </FormContext.Provider>
  );
}
