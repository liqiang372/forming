import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormState, ALL_KEY } from './FormState';
import { FieldError, FormInitialValues } from './types';

export interface FormContextState<T extends FormInitialValues> {
  formState: FormState<T>;
  validateFieldsOnMount: boolean;
}
export const FormContext = React.createContext<FormContextState<any>>({
  formState: new FormState({}),
  validateFieldsOnMount: false,
});

export const useForm = () => React.useContext(FormContext);

export const useFormError = (name: string) => {
  const { formState } = useForm();
  const [errors, setErrors] = useState<undefined | FieldError[]>(
    formState.getErrors()[name],
  );
  useEffect(() => {
    const unsubscribe = formState.subscribeErrors(name, (errors: any) => {
      setErrors(errors);
    });
    return unsubscribe;
  }, []);
  return errors;
};

export const useFormErrors = (names?: string[]) => {
  const { formState } = useForm();
  const keys = names && names.length !== 0 ? names : [ALL_KEY];
  const [errors, setErrors] = useState<
    undefined | Record<string, FieldError[]>
  >(() => {
    const allErrors = formState.getErrors();
    if (keys.length === 1 && keys[0] === ALL_KEY) {
      return allErrors;
    }
    const picked = {};
    for (const name of keys) {
      picked[name] = allErrors[name];
    }
    return picked;
  });
  useEffect(() => {
    const unsubscribeFns = keys.map(name =>
      formState.subscribeErrors(name, (errors, fieldName) => {
        if (errors === undefined) {
          setErrors(prev => {
            const updated = { ...prev };
            delete updated[fieldName ?? name];
            return updated;
          });
        } else {
          setErrors(prev => {
            return {
              ...prev,
              [fieldName ?? name]: errors,
            };
          });
        }
      }),
    );
    return () => {
      for (const fn of unsubscribeFns) {
        fn();
      }
    };
  }, []);
  return errors;
};

export const useFormValue = (name: string) => {
  const { formState } = useForm();
  const [value, setValue] = useState<undefined | any>(formState.getValue(name));

  useEffect(() => {
    const unsubscribe = formState.subscribeValues(name, value => {
      setValue(value);
    });
    return unsubscribe;
  });
  return value;
};

export const useFormValues = (names?: string[]) => {
  const { formState } = useForm();
  const keys = names && names.length !== 0 ? names : [ALL_KEY];
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initialValues = formState.getValues();
    if (keys.length === 1 && keys[0] === ALL_KEY) {
      return initialValues;
    }
    const picked = {};
    for (const name of keys) {
      picked[name] = initialValues[name];
    }
    return picked;
  });
  useEffect(() => {
    const unsubscribeFns = keys.map(name =>
      formState.subscribeValues(name, (value, fieldName) => {
        setValues(prev => {
          return {
            ...prev,
            [fieldName ?? name]: value,
          };
        });
      }),
    );
    return () => {
      for (const fn of unsubscribeFns) {
        fn();
      }
    };
  });
  return values;
};

export const useFormChanged = (names?: string[]) => {
  const [changes, setChanges] = useState<undefined | Record<string, boolean>>(
    undefined,
  );
  const { formState } = useForm();
  const hasChanged = useRef<Record<string, boolean>>({});
  const keys = names && names.length !== 0 ? names : [ALL_KEY];
  useEffect(() => {
    const unsubscribeFns = keys.map(name =>
      formState.subscribeValues(name, (value, fieldName) => {
        const finalName = fieldName ?? name;
        if (!hasChanged.current[finalName]) {
          setChanges(prev => ({
            ...prev,
            [finalName]: true,
          }));
          hasChanged.current[finalName] = true;
        }
      }),
    );
    return () => {
      for (const fn of unsubscribeFns) {
        fn();
      }
    };
  });
  return changes;
};
