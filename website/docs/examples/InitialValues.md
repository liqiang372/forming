---
sidebar_position: 3
---

# InitialValues

```tsx
import { Form, Field } from 'forming';

export default function App() {
  return (
    <div className="App">
      <h1>Initial Values</h1>
      <Form
        initialValues={{
          username: 'foo',
          password: '123',
        }}
        onSubmit={({ values }) => {
          console.log(values);
        }}
      >
        <Field name="username">
          {({ value, onChange }) => (
            <div className="field">
              <label htmlFor="">Username</label>
              <input type="text" value={value} onChange={onChange} />
            </div>
          )}
        </Field>
        <Field name="password">
          {({ value, onChange }) => (
            <div className="field">
              <label htmlFor="">Password</label>
              <input type="password" value={value} onChange={onChange} />
            </div>
          )}
        </Field>
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
```

[codesandbox](https://codesandbox.io/s/wonderful-https-m2lkjp?file=/src/App.js)
