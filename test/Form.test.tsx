import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BasicForm } from './BasicForm';
import { ArrayForm } from './ArrayForm';
import { RefForm } from './RefForm';
import { DependentForm } from './DependentForm';

describe('Form', () => {
  test('basic', async () => {
    const onSubmitMock = jest.fn();
    const utils = render(<BasicForm onSubmit={onSubmitMock} />);
    const usernameInput = utils.getByLabelText(
      'username-input',
    ) as HTMLInputElement;
    fireEvent.change(usernameInput, { target: { value: 'foo' } });
    expect(usernameInput.value).toBe('foo');

    const passowrdInput = utils.getByLabelText(
      'password-input',
    ) as HTMLInputElement;
    fireEvent.change(passowrdInput, { target: { value: '123456' } });
    expect(passowrdInput.value).toBe('123456');

    const button = utils.queryByText('Submit');
    await fireEvent.click(button!);
    expect(onSubmitMock).toBeCalled();
    expect(onSubmitMock).toBeCalledWith({
      values: { username: 'foo', password: '123456' },
    });
  });
});

describe('arrays', () => {
  test('basic', async () => {
    const onSubmitMock = jest.fn();
    const utils = render(<ArrayForm onSubmit={onSubmitMock} />);
    const usernameInput = utils.getByLabelText(
      'username-input',
    ) as HTMLInputElement;
    fireEvent.change(usernameInput, { target: { value: 'foo' } });
    expect(usernameInput.value).toBe('foo');
    expect(utils.container.querySelectorAll('.book-entry')).toHaveLength(1);

    const titleInput = utils.getByLabelText(
      'book-title-input',
    ) as HTMLInputElement;
    const authorInput = utils.getByLabelText(
      'book-author-input',
    ) as HTMLInputElement;
    expect(titleInput.value).toBe('book 1');
    expect(authorInput.value).toBe('author 1');

    fireEvent.change(titleInput, { target: { value: 'book 1.1' } });
    expect(titleInput.value).toBe('book 1.1');
    const button = utils.queryByText('Submit');
    await fireEvent.click(button!);
    expect(onSubmitMock).toBeCalled();
    expect(onSubmitMock).toBeCalledWith({
      values: {
        username: 'foo',
        books: [
          {
            title: 'book 1.1',
            author: 'author 1',
          },
        ],
      },
    });
  });
  test('add/delete item', async () => {
    const onSubmitMock = jest.fn();
    const utils = render(<ArrayForm onSubmit={onSubmitMock} />);
    const addBookBtn = utils.queryByText('Add book');
    await fireEvent.click(addBookBtn!);
    expect(utils.container.querySelectorAll('.book-entry')).toHaveLength(2);

    const secondBookEntry = utils.container.querySelector('.book-entry-1');
    let titleInput = secondBookEntry!.querySelector(
      'input.book-title-input',
    ) as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: 'book 2' } });
    expect(titleInput.value).toBe('book 2');

    let authorInput = secondBookEntry!.querySelector(
      'input.book-author-input',
    ) as HTMLInputElement;
    fireEvent.change(authorInput, { target: { value: 'author 2' } });
    expect(authorInput.value).toBe('author 2');

    const submitBtn = utils.queryByText('Submit');
    await fireEvent.click(submitBtn!);
    expect(onSubmitMock).toBeCalled();
    expect(onSubmitMock).toBeCalledWith({
      values: {
        books: [
          {
            title: 'book 1',
            author: 'author 1',
          },
          {
            title: 'book 2',
            author: 'author 2',
          },
        ],
      },
    });

    // Add third one
    await fireEvent.click(addBookBtn!);
    expect(utils.container.querySelectorAll('.book-entry')).toHaveLength(3);
    const thirdBookEntry = utils.container.querySelector('.book-entry-2');
    titleInput = thirdBookEntry!.querySelector(
      'input.book-title-input',
    ) as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: 'book 3' } });
    expect(titleInput.value).toBe('book 3');

    authorInput = thirdBookEntry!.querySelector(
      'input.book-author-input',
    ) as HTMLInputElement;
    fireEvent.change(authorInput, { target: { value: 'author 3' } });
    expect(authorInput.value).toBe('author 3');

    await fireEvent.click(submitBtn!);
    expect(onSubmitMock).toBeCalled();
    expect(onSubmitMock).toBeCalledWith({
      values: {
        books: [
          {
            title: 'book 1',
            author: 'author 1',
          },
          {
            title: 'book 2',
            author: 'author 2',
          },
          {
            title: 'book 3',
            author: 'author 3',
          },
        ],
      },
    });

    let firstBookEntry = utils.container.querySelector('.book-entry-0');
    let deleteBtn = firstBookEntry!.querySelector('.delete');
    await fireEvent.click(deleteBtn!);
    expect(utils.container.querySelectorAll('.book-entry')).toHaveLength(2);

    await fireEvent.click(submitBtn!);
    expect(onSubmitMock).toBeCalled();
    expect(onSubmitMock).toBeCalledWith({
      values: {
        books: [
          {
            title: 'book 2',
            author: 'author 2',
          },
          {
            title: 'book 3',
            author: 'author 3',
          },
        ],
      },
    });

    firstBookEntry = utils.container.querySelector('.book-entry-0');
    deleteBtn = firstBookEntry!.querySelector('.delete');
    await fireEvent.click(deleteBtn!);
    expect(utils.container.querySelectorAll('.book-entry')).toHaveLength(1);
    await fireEvent.click(submitBtn!);
    expect(onSubmitMock).toBeCalled();
    expect(onSubmitMock).toBeCalledWith({
      values: {
        books: [
          {
            title: 'book 3',
            author: 'author 3',
          },
        ],
      },
    });
  });
});

describe('ref', () => {
  test('able to get ref', async () => {
    const ref = React.createRef<any>();
    const onSubmitMock = jest.fn();
    const utils = render(<RefForm onSubmit={onSubmitMock} innerRef={ref} />);
    expect(ref.current.getValues).toBeInstanceOf(Function);
    expect(ref.current.getValue).toBeInstanceOf(Function);
    expect(ref.current.getErrors).toBeInstanceOf(Function);
    expect(ref.current.validate).toBeInstanceOf(Function);
    expect(ref.current.validateAll).toBeInstanceOf(Function);
    const usernameInput = utils.getByLabelText(
      'username-input',
    ) as HTMLInputElement;
    fireEvent.change(usernameInput, { target: { value: 'foo' } });
    const passowrdInput = utils.getByLabelText(
      'password-input',
    ) as HTMLInputElement;
    fireEvent.change(passowrdInput, { target: { value: '123456' } });
    expect(ref.current.getValues()).toEqual({
      username: 'foo',
      password: '123456',
    });
    expect(ref.current.getValue('username')).toBe('foo');
    expect(ref.current.getValue('password')).toBe('123456');
    expect(ref.current.validate('username')).toBeTruthy();
  });
});

describe('useFormValue', () => {
  test('able subscribe to value', async () => {
    const onSubmitMock = jest.fn();
    const utils = render(<DependentForm onSubmit={onSubmitMock} />);
    const fullNameField = utils.getByLabelText(
      'fullName-field',
    ) as HTMLDivElement;
    expect(fullNameField.textContent).toBe('Kokuul');
    const firstNameInput = utils.getByLabelText(
      'firstName-input',
    ) as HTMLInputElement;
    fireEvent.change(firstNameInput, { target: { value: 'Kokul' } });
    expect(firstNameInput.value).toBe('Kokul');

    const lastNameField = utils.getByLabelText(
      'lastName-input',
    ) as HTMLInputElement;
    fireEvent.change(lastNameField, { target: { value: 'Subendran' } });
    expect(lastNameField.value).toBe('Subendran');
    expect(fullNameField.textContent).toBe('Kokul Subendran');
  });
});
