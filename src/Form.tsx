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
  className?: string;
}

export type FormRefProps<T extends FormInitialValues> = Pick<
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
  className,
}: FormProps<T> & { innerRef?: React.Ref<FormRefProps<T>> }) => {
  const formState = useRef<FormState<T>>(new FormState({ initialValues }));
  const doSubmit = async () => {
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
  useImperativeHandle(innerRef, () => {
    return {
      getValues: () => {
        return formState.current.getValues();
      },
      getValue: (name: string) => {
        return formState.current.getValue(name);
      },
      updateValue: (
        name: string,
        value: any,
        { shouldValidate }: { shouldValidate?: boolean } = {
          shouldValidate: true,
        },
      ) => {
        formState.current.setValue(name, value);
        if (shouldValidate) {
          formState.current.validate(name);
        }
      },
      submitForm: doSubmit,
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
    doSubmit();
  };

  return (
    <FormContext.Provider value={{ formState: formState.current }}>
      <form
        onSubmit={handleSubmit}
        noValidate={!htmlValidate}
        className={className}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};
