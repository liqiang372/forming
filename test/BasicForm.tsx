import React from 'react';
import { Form, FormProps } from '../src/Form';
import { Field } from '../src/Field';

export function BasicForm({ onSubmit }: { onSubmit: FormProps['onSubmit'] }) {
  return (
    <Form onSubmit={onSubmit}>
      <Field name="username">
        {({ value = '', onChange }) => {
          return (
            <input
              type="text"
              value={value}
              onChange={onChange}
              aria-label="username-input"
            />
          );
        }}
      </Field>
      <Field name="password">
        {({ value = '', onChange }) => {
          return (
            <input
              type="password"
              value={value}
              onChange={onChange}
              aria-label="password-input"
            />
          );
        }}
      </Field>
      <button type="submit" role="button">
        Submit
      </button>
    </Form>
  );
}
