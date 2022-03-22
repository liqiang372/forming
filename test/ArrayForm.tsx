import React from 'react';
import { Form, FormProps } from '../src/Form';
import { Field } from '../src/Field';

export function ArrayForm({ onSubmit }: { onSubmit: FormProps['onSubmit'] }) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        books: [
          {
            title: 'book 1',
            author: 'author 1',
          },
        ],
      }}
    >
      <Field name="username">
        {({ value = '', onChange }) => {
          return (
            <input
              type="text"
              value={value}
              onChange={onChange}
              aria-label="username-input"
            />
          );
        }}
      </Field>
      <div>Your books</div>
      <Field name="books">
        {({ value: books = [], updateValue: updateBooks }) => {
          return (
            <>
              {books.map((_: any, index: number) => {
                return (
                  <div key={index} className={`book-entry book-entry-${index}`}>
                    <Field name={`books[${index}].title`}>
                      {({ value, onChange }) => {
                        return (
                          <input
                            type="text"
                            className="book-title-input"
                            value={value}
                            onChange={onChange}
                            aria-label="book-title-input"
                          />
                        );
                      }}
                    </Field>
                    <Field name={`books[${index}].author`}>
                      {({ value, onChange }) => {
                        return (
                          <input
                            type="text"
                            className="book-author-input"
                            value={value}
                            onChange={onChange}
                            aria-label="book-author-input"
                          />
                        );
                      }}
                    </Field>
                    <button
                      className="delete"
                      type="button"
                      role="button"
                      onClick={() => {
                        updateBooks([
                          ...books.slice(0, index),
                          ...books.slice(index + 1),
                        ]);
                      }}
                    >
                      delete
                    </button>
                  </div>
                );
              })}
              <button
                type="button"
                role="button"
                onClick={() => {
                  updateBooks(books.concat({ title: '', author: '' }));
                }}
              >
                Add book
              </button>
            </>
          );
        }}
      </Field>
      <button type="submit" role="button">
        Submit
      </button>
    </Form>
  );
}
