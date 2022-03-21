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

function BooksRegistration({
  books,
}: {
  books: { title: string; author: string }[];
}) {
  return (
    <div className="flex flex-col items-start mt-4">
      <Field name="books">
        {({ value: books = [], updateValue: updateBooksValue }) => {
          return (
            <>
              {books.map((book: any, index: number) => {
                return (
                  <div key={index}>
                    <Field name={`books[${index}].title`}>
                      {({ value = '', updateValue }) => {
                        return (
                          <div>
                            <label htmlFor="">title</label>
                            <input
                              type="text"
                              value={value}
                              onChange={e => {
                                updateValue(e.target.value);
                              }}
                              className="border border-black border-solid"
                            />
                          </div>
                        );
                      }}
                    </Field>
                    <Field name={`books[${index}].author`}>
                      {({ value, updateValue }) => {
                        return (
                          <div>
                            <label htmlFor="">author</label>
                            <input
                              type="text"
                              value={value}
                              onChange={e => {
                                updateValue(e.target.value);
                              }}
                              className="border border-black border-solid"
                            />
                          </div>
                        );
                      }}
                    </Field>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedBooks = [
                          ...books.slice(0, index),
                          ...books.slice(index + 1),
                        ];
                        updateBooksValue(updatedBooks);
                      }}
                    >
                      X
                    </button>
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  updateBooksValue(books.concat({ title: '', author: '' }));
                }}
              >
                add more
              </button>
            </>
          );
        }}
      </Field>
    </div>
  );
}
export function Example4() {
  const books = [
    {
      title: 'book 1',
      author: 'author 1',
    },
    {
      title: 'book 2',
      author: 'author 2',
    },
  ];
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
        <BooksRegistration books={books} />

        <SubmitBtn />
      </Form>
    </div>
  );
}
