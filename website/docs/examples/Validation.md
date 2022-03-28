---
sidebar_position: 6
---

# Validation

The built in validation in forming follows very simple convention.

The rule is defined as a function assigned to a rule name.
if the return value is a non-empty string, then it will be the error message

e.g.

```tsx
<Field validate={{
  ruleName: (val) => {
    if (!isValid(val)) {
      return 'the value is not valid'
    }
    return ''
  }
}}>
```

Forming has simplified rule for `required`, Message can be passed directly to the rule name. and it will be used as error message when value is empty(undefined, null, val.trim().length === 0)

```tsx
import './styles.css';
import { Form, Field } from 'forming';

function ErrorMsg({ error }) {
  return <div className="error">{error}</div>;
}
export default function App() {
  return (
    <div className="App">
      <h1>SimpleValidation</h1>
      <Form
        validateOnSubmit
        onSubmit={({ values }) => {
          console.log(values);
        }}
      >
        <Field
          name="username"
          validate={{
            required: 'username is required',
          }}
        >
          {({ value = '', onChange, errors }) => (
            <div className="field">
              <label htmlFor="">Username</label>
              <input type="text" value={value} onChange={onChange} />
              {errors && errors.length > 0 && (
                <ErrorMsg error={errors[0].message} />
              )}
            </div>
          )}
        </Field>
        <Field
          name="password"
          validate={{
            minLen: val => {
              if (val.length < 3) {
                return 'too short';
              }
              return '';
            },
          }}
        >
          {({ value = '', onChange, errors }) => (
            <div className="field">
              <label htmlFor="">Password</label>
              <input type="text" value={value} onChange={onChange} />
              {errors && errors.length > 0 && (
                <ErrorMsg error={errors[0].message} />
              )}
            </div>
          )}
        </Field>

        <div>
          <button type="submit">Submit</button>
        </div>
      </Form>
    </div>
  );
}
```

[codesandbox](https://codesandbox.io/s/forming-validation-15bc6w?file=/src/App.js)
