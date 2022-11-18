import React from 'react';
import { Form, FormProps } from '../src/Form';
import { Field } from '../src/Field';
import { useFormValue } from '../src/FormContext';

const FullNameField = () => {
  const firstName = useFormValue('firstName') ?? '';
  const lastName = useFormValue('lastName') ?? '';
  const fullName = (firstName + ' ' + lastName).trim();
  return <div aria-label="fullName-field">{fullName}</div>;
};
export function DependentForm({
  onSubmit,
}: {
  onSubmit: FormProps<any>['onSubmit'];
}) {
  return (
    <Form onSubmit={onSubmit} initialValues={{ firstName: 'Kokuul' }}>
      <Field name="firstName">
        {({ value = '', onChange }) => {
          return (
            <input
              type="text"
              value={value}
              onChange={onChange}
              aria-label="firstName-input"
            />
          );
        }}
      </Field>
      <Field name="lastName">
        {({ value = '', onChange }) => {
          return (
            <input
              type="text"
              value={value}
              onChange={onChange}
              aria-label="lastName-input"
            />
          );
        }}
      </Field>
      <FullNameField />
      <button type="submit" role="button">
        Submit
      </button>
    </Form>
  );
}
