import { Form, Field } from 'forming';

export function Example1() {
  return (
    <div className="flex flex-col items-start">
      <h2 className="text-2xl">Validate on submit(Only)</h2>
      <Form
        initialValues={{ email: '', name: '' }}
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
              <div className="flex flex-col items-start">
                <label htmlFor="">Email</label>
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
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
