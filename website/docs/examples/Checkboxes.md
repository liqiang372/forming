---
sidebar_position: 2
---

# Checkboxes

```tsx
import { Form, Field } from 'forming';

export default function App() {
  return (
    <div className="App">
      <h1>What fruit do you like</h1>
      <Form
        onSubmit={({ values }) => {
          console.log(values);
        }}
      >
        <Field name="apple">
          {({ value, updateValue }) => (
            <div className="field">
              <input
                type="checkbox"
                value={value}
                onChange={e => {
                  updateValue(e.target.checked);
                }}
              />
              <label htmlFor="">Apple</label>
            </div>
          )}
        </Field>
        <Field name="orange">
          {({ value, updateValue }) => (
            <div className="field">
              <input
                type="checkbox"
                value={value}
                onChange={e => {
                  updateValue(e.target.checked);
                }}
              />
              <label htmlFor="">Orange</label>
            </div>
          )}
        </Field>
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
```

[codesandbox](https://codesandbox.io/s/focused-meitner-qhl465?file=/src/App.js)
