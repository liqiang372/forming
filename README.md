# forming

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/forming.svg)](https://www.npmjs.com/package/forming) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save forming
```

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

## License

MIT © [liqiang372](https://github.com/liqiang372)
