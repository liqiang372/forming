import React, { FormEvent, useRef, useImperativeHandle } from 'react';
import { FormContext } from './FormContext';
import { FormState } from './FormState';
import { FormInitialValues } from './types';

export interface FormProps<Values> {
  initialValues?: Values;
  validateOnSubmit?: boolean;
  validateOnSubmitSyncOnly?: boolean;
  htmlValidate?: boolean;
  children: React.ReactNode;
  onSubmit?: (params: { values: Values }) => void;
}

export type FormRefProps<T> = Pick<
  FormState<T>,
  'getErrors' | 'getValue' | 'getValues' | 'validate' | 'validateAll'
>;
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref/58473012#58473012
// Omit forwardRef and expose ref as a direct prop to preserve generic types
export const Form = <T extends FormInitialValues>({
  initialValues,
  children,
  htmlValidate = false,
  validateOnSubmit,
  validateOnSubmitSyncOnly,
  onSubmit,
  innerRef,
}: FormProps<T> & { innerRef?: React.Ref<FormRefProps<T>> }) => {
  const formState = useRef<FormState<T>>(new FormState({ initialValues }));
  useImperativeHandle(innerRef, () => {
    return {
      getValues: () => {
        return formState.current.getValues();
      },
      getValue: (name: string) => {
        return formState.current.getValue(name);
      },
      getErrors: () => {
        return formState.current.getErrors();
      },
      validate: (name: string) => {
        return formState.current.validate(name);
      },
      validateAll: () => {
        return formState.current.validateAll();
      },
    };
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validateOnSubmit) {
      await formState.current.validateAll();
    } else if (validateOnSubmitSyncOnly) {
      await formState.current.validateAll({
        syncOnly: true,
      });
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
};
