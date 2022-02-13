import React, { FormEvent, useRef, useImperativeHandle } from 'react';
import { FormContext } from './FormContext';
import { FormState } from './FormState';
import { FormInitialValues } from './types';

export interface FormProps {
  initialValues?: FormInitialValues;
  validateOnSubmit?: boolean;
  validateOnSubmitSyncOnly?: boolean;
  htmlValidate?: boolean;
  children: React.ReactNode;
  onSubmit?: (params: any) => void; // TODO: fix type
}

export type FormRefProps = Pick<
  FormState,
  'getErrors' | 'getValue' | 'getValues' | 'validate' | 'validateAll'
>;
export const Form = React.forwardRef<FormRefProps, FormProps>(
  (
    {
      initialValues,
      children,
      htmlValidate = false,
      validateOnSubmit,
      validateOnSubmitSyncOnly,
      onSubmit,
    },
    ref,
  ) => {
    const formState = useRef<FormState>(new FormState({ initialValues }));
    useImperativeHandle(ref, () => {
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
  },
);
