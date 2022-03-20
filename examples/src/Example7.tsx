import { useState, useRef } from 'react';
import { Form, Field, FormRefProps, useFormValue } from 'forming';
import { useEffect } from 'react';

const FullNameField = ({ value, updateValue }: any) => {
  const firstName = useFormValue('firstName');
  const lastName = useFormValue('lastName');

  useEffect(() => {
    updateValue(`${firstName ?? ''} ${lastName ?? ''}`);
  }, [firstName, lastName]);
  return (
    <div className="flex flex-col items-start">
      <label htmlFor="">Last Name</label>
      <input
        value={value}
        onChange={e => {
          updateValue(e.target.value);
        }}
        className="border border-black border-solid"
      />
    </div>
  );
};
export function Example7() {
  const formRef = useRef<FormRefProps>(null);
  return (
    <div className="flex flex-col items-start">
      <h2 className="text-2xl">Dependent fields</h2>
      <Form ref={formRef}>
        <Field name="firstName">
          {({ value = '', onChange, errors }) => {
            return (
              <div className="flex flex-col items-start">
                <label htmlFor="">First Name</label>
                <input
                  value={value}
                  onChange={onChange}
                  className="border border-black border-solid"
                />
              </div>
            );
          }}
        </Field>
        <Field name="lastName">
          {({ value = '', onChange }) => {
            return (
              <div className="flex flex-col items-start">
                <label htmlFor="">Last Name</label>
                <input
                  value={value}
                  onChange={onChange}
                  className="border border-black border-solid"
                />
              </div>
            );
          }}
        </Field>
        <Field name="fullName">
          {({ value = '', updateValue }) => {
            return <FullNameField value={value} updateValue={updateValue} />;
          }}
        </Field>
      </Form>
    </div>
  );
}
