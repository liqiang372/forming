import { useState, useRef } from 'react';
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
  console.log({ errors: JSON.stringify(errors) });
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
  const [flag2, setFlag2] = useState(true);
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
            random: val => {
              console.log('validating');

              if (showField) {
                if (val.length < 5) {
                  return 'length less than 5';
                }
                return '';
              } else {
                return 'field not shown';
              }
              if (flag2) {
                return 'flag2';
              }
              return '';
            },
          }}
          validateOnChange
          validateOnDeps={[showField, flag2]}
        >
          {({ value = '', onChange, errors }) => {
            console.log({ emailError: JSON.stringify(errors) });
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
        {showField && <div>123</div>}

        {<SubmitBtn />}
      </Form>

      <button
        type="button"
        onClick={() => {
          setShowField(prev => !prev);
        }}
      >
        toggle email field
      </button>
      <button
        type="button"
        onClick={() => {
          setFlag2(prev => !prev);
        }}
      >
        toggle flag2
      </button>
    </div>
  );
}
