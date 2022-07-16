import React, { useEffect, useState } from 'react';
import { FormState } from './FormState';
import { FieldError } from './types';

export interface FormContextState<T> {
  formState: FormState<T>;
}
export const FormContext = React.createContext<FormContextState<any>>({
  formState: new FormState({}),
});

export const useForm = () => React.useContext(FormContext);

export const useFormError = (name: string | undefined) => {
  const [errors, setErrors] = useState<undefined | FieldError[]>(undefined);
  const { formState } = useForm();

  useEffect(() => {
    const unsubscribe = formState.subscribeErrors(name, (errors: any) => {
      setErrors(errors);
    });
    return unsubscribe;
  });
  return errors;
};

export const useFormValue = (name: string) => {
  const [value, setValue] = useState<undefined | any>(undefined);
  const { formState } = useForm();

  useEffect(() => {
    const unsubscribe = formState.subscribeValues(name, value => {
      setValue(value);
    });
    return unsubscribe;
  });
  return value;
};
