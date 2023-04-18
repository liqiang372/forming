import { useState } from 'react';
import {
  Form,
  Field,
  useFormErrors,
  useFormChanged,
  useFormValues,
} from 'forming';

function checkUsername(name: string) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('async validating');
      if (['foo', 'bar', 'baz'].includes(name)) {
        resolve('invalid');
      } else {
        resolve('valid');
      }
    }, 500);
  });
}
function SubmitBtn() {
  const errors = useFormErrors();
  const hasError = errors && Object.keys(errors).length > 0;
  return (
    <button
      type="submit"
      className="btn"
      disabled={errors && Object.keys(errors).length > 0}
    >
      {hasError ? 'error' : 'Submit'}
    </button>
  );
}

export function Example8() {
  const [showField, setShowField] = useState(true);
  return (
    <div className="flex flex-col items-start">
      <h2 className="text-2xl">Arrays</h2>
      <Form
        initialValues={{
          email: 'hello@demo.com',
          social: {
            facebook: 'facebook.com/profile',
            twitter: 'twitter.com/awesome',
          },
        }}
        validateOnSubmit
        onSubmit={({ values }) => {
          console.log('submitting', values);
        }}
      >
        <Field
          name="email"
          validate={{
            required: 'Email is required',
          }}
          validateOnChange
        >
          {({ value = '', onChange, errors }) => {
            return (
              <div className="flex flex-col items-start">
                <label htmlFor="">
                  Email (Required, also validate onChange)
                </label>
                <input
                  value={value}
                  onChange={onChange}
                  className="border border-black border-solid"
                />
                {errors && errors.length > 0 && (
                  <div className="text-red-500">{errors[0].message}</div>
                )}
              </div>
            );
          }}
        </Field>
        {showField && (
          <Field
            validateDebouncedTime={300}
            name="username"
            validate={{
              minLen: (val: string) => {
                if (val.length < 6) {
                  return 'Minimum length is 6';
                }

                return ''; // or return true
              },
              valid: async (val: string) => {
                const result = await checkUsername(val);
                if (result === 'valid') {
                  return '';
                }
                return 'invalid';
              },
            }}
            validateOnChange
          >
            {({ value = '', onChange, errors, isValidating }) => {
              return (
                <div className="flex flex-col items-start">
                  <label htmlFor="">Username</label>
                  <input
                    value={value}
                    onChange={onChange}
                    className="border border-black border-solid"
                  />
                  {errors && errors.length > 0 && (
                    <div className="text-red-500">{errors[0].message}</div>
                  )}
                  {isValidating && <div>is validating</div>}
                </div>
              );
            }}
          </Field>
        )}

        {showField && <SubmitBtn />}
      </Form>

      <button
        type="button"
        onClick={() => {
          setShowField(prev => !prev);
        }}
      >
        toggle email field
      </button>
    </div>
  );
}
