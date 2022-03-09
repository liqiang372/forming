---
sidebar_position: 2
---

# Field

## Overview

```ts
export interface FieldProps {
  name: string;
  children: (params: FieldChildParams) => React.ReactElement;
  validate?: Record<
    string,
    string | ((val: any) => boolean | string | Promise<boolean | string>)
  >;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateDebouncedTime?: number;
}

interface FieldChildParams {
  value: any;
  updateValue: (val: any) => void;
  onChange: (e: React.ChangeEvent<any>) => void; // syntax sugar of updateValue
  onBlur: (e: React.FocusEvent<any>) => void;
  errors?: { rule: string; message?: string }[];
  isValidating: boolean;
}
```

## Usage

A simple usage example

```ts
<Form
  validateOnSubmit
  onSubmit={({ values }) => {
    console.log('submitting', values);
  }}
>
  <Field
    name="email"
    validate={{
      required: 'Email is required',
    }}
  >
    {({ value = '', onChange, errors }) => {
      return (
        <div>
          <label htmlFor="">Email</label>
          <input value={value} onChange={onChange} />
          {errors && errors.length > 0 && <div>{errors[0].message}</div>}
        </div>
      );
    }}
  </Field>
  <Field
    name="username"
    validate={{
      minLen: (val: string) => {
        if (val.length < 6) {
          return 'Minimum length is 6';
        }
        return ''; // or return true
      },
    }}
  >
    {({ value = '', updateValue, errors }) => {
      return (
        <div>
          <label htmlFor="">Username</label>
          <CustomComponent
            value={value}
            onUpdate={value => {
              updateValue(value);
            }}
          />
          {errors && errors.length > 0 && <div>{errors[0].message}</div>}
        </div>
      );
    }}
  </Field>
  <button type="submit">Submit</button>
</Form>
```

`value` and `updateValue` are the two most important props here.

- `value` is the up to date value you can get from Forming.
- `updateValue` is to update the value stored inside Forming.

Don't get confused about `onChange`, it is just a syntax sugar of `udpateValue` for input fields.

it is implemented as

```ts
onChange = e => {
  updateValue(e.target.value);
};
```
