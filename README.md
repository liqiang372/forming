# forming

> Build form with least re-renders!

[![NPM](https://img.shields.io/npm/v/forming.svg)](https://www.npmjs.com/package/forming) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save forming
```

Forming exposes two basic components, `Form` and `Field`. `Field` accepts a functional component as children to achieve minimum performance gain where it doesn't need to udpate other fields when its value is updated.

## Usage

```tsx
import { Form, Field } from 'forming';

export function Example() {
  return (
    <div className="flex flex-col items-start">
      <h2 className="text-2xl">async validating</h2>
      <Form
        initialValues={{
          email: 'hello@demo.com',
        }}
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
          validateOnChange
        >
          {({ value = '', onChange, errors }) => {
            return (
              <div className="flex flex-col items-start">
                <label htmlFor="">
                  Email (Required, also validate onChange)
                </label>
                <input
                  value={value}
                  onChange={onChange}
                  className="border border-black border-solid"
                />
                {errors && errors.length > 0 && (
                  <div className="text-red-500">{errors[0].message}</div>
                )}
              </div>
            );
          }}
        </Field>
        <Field
          validateDebouncedTime={300}
          name="username"
          validate={{
            minLen: (val: string) => {
              if (val.length < 2) {
                return 'Minimum length is 2';
              }

              return ''; // or return true
            },
            valid: async (val: string) => {
              const result = await checkUsername(val);
              if (result === 'valid') {
                return '';
              }
              return 'invalid';
            },
          }}
          validateOnChange
        >
          {({ value = '', updateValue, errors, isValidating }) => {
            return (
              <div className="flex flex-col items-start">
                <label htmlFor="">Username</label>
                <input
                  value={value}
                  onChange={e => {
                    // don't have to use preset "onChange" for flexible update
                    updateValue(e.target.value);
                  }}
                  className="border border-black border-solid"
                />
                {errors && errors.length > 0 && (
                  <div className="text-red-500">{errors[0].message}</div>
                )}
                {isValidating && <div>is validating</div>}
              </div>
            );
          }}
        </Field>
        <SubmitBtn />
      </Form>
    </div>
  );
}
```

## Recipes

### Validate field on change

You can validate the field in either sync or async manner.

```ts
<Field
  validateDebouncedTime={300}
  name="username"
  validate={{
    // sync
    minLen: (val: string) => {
      if (val.length < 2) {
        return 'Minimum length is 2';
      }

      return ''; // or return true
    },
    // async
    valid: async (val: string) => {
      const result = await checkUsername(val);
      if (result === 'valid') {
        return '';
      }
      return 'invalid';
    },
  }}
  validateOnChange
>
  {({ value = '', updateValue, errors, isValidating }) => {
    return (
      <div className="flex flex-col items-start">
        <label htmlFor="">Username</label>
        <input
          value={value}
          onChange={e => {
            updateValue(e.target.value);
          }}
          className="border border-black border-solid"
        />
        {errors && errors.length > 0 && (
          <div className="text-red-500">{errors[0].message}</div>
        )}
        {isValidating && <div>is validating</div>}
      </div>
    );
  }}
</Field>
```

### Access other fields state (value, errors, changed)

There are several hooks you can use

- `useFormValue`

This is used to read a single other field value from current field component. It's a singular use case of `useFormValues`

```ts
const FullNameField = () => {
  const firstName = useFormValue('firstName');
  const lastName = useFormValue('lastName');
  const fullName = `${firstName} ${lastName}`;
  return <div>{fullName}</div>;
};
```

- `useFormValues`
  This is useful to get multiple field values or all field values

```ts
const FullNameField = () => {
  const { firstName, lastName } = useFormValues(['firstName', 'lastName']); // only re-render when these two fields change value
  // or
  const { firstName, lastName } = useFormValues(); // will re-render when other fields change value even though we only use firstName and lastName.
};
```

- `useFormError`

This is a singular use case of `useFormErrors`, in most case, you may want to use `useFormErrors` for convenience

```ts
const SubmitBtn = () => {
  const errors = useFormError('password');
  return (
    <button type="submit" disabled={errors && errors.length > 0}>
      Submit
    </button>
  );
};
```

- `useFormErrors`
  Enhanced version of `useFormError`, where you can pass an array of names to get their errors.
  If you don't pass in any names, then it will subscribe to the errors of all fields

```ts
const SubmitBtn = () => {
  const errors = useFormErrors(['username', 'password']);
  const allFieldsErrors = useFormErrors();
  return (
    <button type="submit" disabled={errors && errors.length > 0}>
      Submit
    </button>
  );
};
```

- `useFormChanged`
  This is useful to test if the form values are still pristine, it will be triggered once field values changed.
  Note: this only detects if user has changed the value, but doesn't guarantee the final value is the different than initial value. e.g. user firstly change username value from 'foo' to 'foob', and then change back to 'foo'. This field is still considered changed.

```ts
const SubmitBtn = () => {
  const otherFieldChanged = useFormChanged('otherField');
  const allFieldChanged = useFormChanged();
};
```

### Control form state outside form

There are scenarios where we need to access or update form state outside of Form Component. use `innerRef` on the `Form` Component.

```ts
export function Example6() {
  const formRef = useRef<FormRefProps<any>>(null);
  return (
    <div className="flex flex-col items-start">
      <h2 className="text-2xl">use outside of form</h2>
      <Form innerRef={formRef}>
        <Field
          name="feedback"
          validate={{
            minLen: val => {
              if (val.length < 3) {
                return 'minimum length is 3';
              }
              return '';
            },
          }}
        >
          {({ value = '', onChange, errors }) => {
            return (
              <div className="flex flex-col items-start">
                <label htmlFor="">Leave a feedback</label>
                <input
                  value={value}
                  onChange={onChange}
                  className="border border-black border-solid"
                />
                {errors && errors.length > 0 && (
                  <div className="text-red-500">{errors[0].message}</div>
                )}
              </div>
            );
          }}
        </Field>
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-green-500"
            onClick={() => {
              if (formRef.current) {
                formRef.current.validate('feedback');
                console.log(formRef.current.getValues());
              }
            }}
          >
            Accept
          </button>
          <button
            type="button"
            className="bg-red-500"
            onClick={() => {
              if (formRef.current) {
                formRef.current.validate('feedback');
                console.log(formRef.current.getValues());
              }
            }}
          >
            Reject
          </button>
        </div>
      </Form>
    </div>
  );
}
```

## License

MIT © [liqiang372](https://github.com/liqiang372)
