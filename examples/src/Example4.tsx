import { useState } from 'react';
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

function BooksRegistration({ initialBooks }: { initialBooks: string[] }) {
  const [bookCount, setBookCount] = useState(initialBooks.length);
  return (
    <div className="flex flex-col items-start mt-4">
      {Array(bookCount)
        .fill(0)
        .map((_, index) => {
          return (
            <Field name={`books[${index}]`} key={index}>
              {({ value = '', onChange }) => {
                return (
                  <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    className="border border-black border-solid"
                  />
                );
              }}
            </Field>
          );
        })}
      <button
        type="button"
        onClick={() => {
          setBookCount(prev => prev + 1);
        }}
      >
        add more
      </button>
    </div>
  );
}
export function Example4() {
  const books = ['book 1', 'book 2', 'book 3'];
  return (
    <div className="flex flex-col items-start">
      <h2 className="text-2xl">Arrays</h2>
      <Form
        initialValues={{
          email: 'hello@demo.com',
          books,
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
        <BooksRegistration initialBooks={books} />

        <SubmitBtn />
      </Form>
    </div>
  );
}
