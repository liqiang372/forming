---
sidebar_position: 1
---

# Basic

```tsx
import { Form, Field } from 'forming';

export default function App() {
  return (
    <div className="App">
      <h1>Basic</h1>
      <Form
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

[codesandbox](https://codesandbox.io/embed/strange-perlman-yv13ze?fontsize=14&hidenavigation=1&theme=dark)
