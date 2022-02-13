---
sidebar_position: 1
---

# Basic

```jsx title="basic.tsx"
import { Form, Field } from 'forming';

export default function Example() {
  return (
    <Form
      onSubmit={({ values }) => {
        console.log(values);
      }}
    >
      <Field name="username">
        {({ value, onChange }) => {
          return <input type="text" value={value} onChange={onChange} />;
        }}
      </Field>
      <Field name="password">
        {({ value, onChange }) => {
          return <input type="text" value={value} onChange={onChange} />;
        }}
      </Field>
      <button type="submit">Submit</button>
    </Form>
  );
}
```
