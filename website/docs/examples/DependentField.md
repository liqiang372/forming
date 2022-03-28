---
sidebar_position: 5
---

# Dependent Field

```tsx
import './styles.css';
import { Form, Field, useFormValue } from 'forming';
import { useEffect } from 'react';

const FullNameField = ({ value, updateValue }) => {
  const firstName = useFormValue('firstName') ?? '';
  const lastName = useFormValue('lastName') ?? '';
  useEffect(() => {
    const fullName = firstName + ' ' + lastName;
    updateValue(fullName);
  }, [firstName, lastName]); // eslint-disable-line
  return (
    <div className="flex flex-col items-start">
      <label htmlFor="">Full Name</label>
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
export default function App() {
  return (
    <div className="App">
      <h1>Array</h1>
      <Form
        onSubmit={({ values }) => {
          console.log(values);
        }}
      >
        <Field name="firstName">
          {({ value, onChange }) => (
            <div className="field">
              <label htmlFor="">FirstName</label>
              <input type="text" value={value} onChange={onChange} />
            </div>
          )}
        </Field>
        <Field name="lastName">
          {({ value, onChange }) => (
            <div className="field">
              <label htmlFor="">LastName</label>
              <input type="text" value={value} onChange={onChange} />
            </div>
          )}
        </Field>
        <Field name="fullName">
          {({ value = '', updateValue }) => {
            return <FullNameField value={value} updateValue={updateValue} />;
          }}
        </Field>

        <div>
          <button type="submit">Submit</button>
        </div>
      </Form>
    </div>
  );
}
```

[codesandbox](https://codesandbox.io/s/forming-dependent-field-k06o9h?file=/src/App.js)
