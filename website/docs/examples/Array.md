---
sidebar_position: 4
---

# Array

```tsx
import { Form, Field } from 'forming';

const BOOKS = [
  {
    title: 'book 1',
    author: 'author 1',
  },
  {
    title: 'book 2',
    author: 'author 2',
  },
];

export default function App() {
  return (
    <div className="App">
      <h1>Array</h1>
      <Form
        initialValues={{
          username: 'foo',
          books: BOOKS,
        }}
        onSubmit={({ values }) => {
          console.log(values);
        }}
      >
        <Field name="username">
          {({ value, onChange }) => (
            <div className="field">
              <label htmlFor="">Username</label>
              <input type="text" value={value} onChange={onChange} />
            </div>
          )}
        </Field>
        <Field name="books">
          {({ value: books = [], updateValue: updateBooks }) => {
            return (
              <>
                {books.map((book, index) => {
                  return (
                    <div key={index} className="book-entry">
                      <Field name={`books[${index}].title`}>
                        {({ value = '', updateValue }) => {
                          return (
                            <div>
                              <label>title</label>
                              <input
                                type="text"
                                value={value}
                                onChange={e => {
                                  updateValue(e.target.value);
                                }}
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
                          updateBooks(updatedBooks);
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
                    updateBooks(books.concat({ title: '', author: '' }));
                  }}
                >
                  add more
                </button>
              </>
            );
          }}
        </Field>
        <div>
          <button type="submit">Submit</button>
        </div>
      </Form>
    </div>
  );
}
```

[codesandbox](https://codesandbox.io/s/forming-array-9lfnd1?file=/src/App.js)
