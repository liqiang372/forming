import { useState, useRef } from 'react';
import { Form, Field, FormRefProps } from 'forming';

export function Example6() {
  const formRef = useRef<FormRefProps>(null);
  return (
    <div className="flex flex-col items-start">
      <h2 className="text-2xl">use outside of form</h2>
      <Form ref={formRef}>
        <Field
          name="feedback"
          validate={{
            minLen: val => {
              if (val.length < 3) {
                return 'minimum length is 3';
              }
              return '';
            },
          }}
        >
          {({ value = '', onChange, errors }) => {
            return (
              <div className="flex flex-col items-start">
                <label htmlFor="">Leave a feedback</label>
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
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-green-500"
            onClick={() => {
              if (formRef.current) {
                formRef.current.validate('feedback');
                console.log(formRef.current.getValues());
              }
            }}
          >
            Accept
          </button>
          <button
            type="button"
            className="bg-red-500"
            onClick={() => {
              if (formRef.current) {
                formRef.current.validate('feedback');
                console.log(formRef.current.getValues());
              }
            }}
          >
            Reject
          </button>
        </div>
        ;
      </Form>
    </div>
  );
}
