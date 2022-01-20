import React, { useEffect, useState } from 'react';
import { FormState } from './FormState';
import { FieldError } from './types';

export interface FormContextState {
  formState: FormState;
}
export const FormContext = React.createContext<FormContextState>({
  formState: new FormState({}),
});

export const useFormContext = () => React.useContext(FormContext);

export const useFormErrors = (name: string) => {
  const [errors, setErrors] = useState<undefined | FieldError[]>(undefined);
  const { formState } = useFormContext();

  useEffect(() => {
    const unsubscribe = formState.subscribe(name, errors => {
      setErrors(errors);
    });
    return unsubscribe;
  });
  return {
    errors,
  };
};
