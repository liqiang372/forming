import { Form, Field } from 'forming';

function SubmitBtn() {
  return (
    <button type="submit" className="btn">
      Submit
    </button>
  );
}
export function Example2() {
  return (
    <div className="flex flex-col items-start">
      <h2 className="text-2xl">Validate on change</h2>
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
          name="username"
          validate={{
            minLen: (val: string) => {
              if (val.length < 6) {
                return 'Minimum length is 6';
              }
              return ''; // or return true
            },
          }}
          validateOnChange
        >
          {({ value = '', onChange, errors }) => {
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
              </div>
            );
          }}
        </Field>
        <SubmitBtn />
      </Form>
    </div>
  );
}
