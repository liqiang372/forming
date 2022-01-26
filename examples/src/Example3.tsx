import { Form, Field } from 'forming';

function checkUsername(name: string) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('async validating');
      if (['foo', 'bar', 'baz'].includes(name)) {
        resolve('invalid');
      } else {
        resolve('valid');
      }
    }, 500);
  });
}
function SubmitBtn() {
  return (
    <button type="submit" className="btn">
      Submit
    </button>
  );
}
export function Example3() {
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
          {({ value = '', onChange, errors, isValidating }) => {
            return (
              <div className="flex flex-col items-start">
                <label htmlFor="">Username</label>
                <input
                  value={value}
                  onChange={onChange}
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
