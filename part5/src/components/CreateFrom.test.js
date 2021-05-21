import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import BlogForm from './CreateForm';

describe('<BlogForm />', () => {
  let component;
  const inputValue = {
    title: 'Mighty test',
    author: 'Boony',
    url: 'facebook.com',
  };
  const addBlog = jest.fn();

  beforeEach(() => {
    component = render(<BlogForm addBlog={addBlog} />);
  });

  test('receives form values correctly', () => {
    const form = component.container.querySelector('form');
    const objKeys = Object.keys(inputValue);
    for (const key in inputValue) {
      fireEvent.change(component.container.querySelector(`#${key}`), {
        target: { value: inputValue[key] },
      });
    }

    fireEvent.submit(form);

    expect(addBlog.mock.calls).toHaveLength(1);

    for (let i = 0; i < objKeys.length; i++) {
      expect(addBlog.mock.calls[0][0][objKeys[i]]).toBe(inputValue[objKeys[i]]);
    }
  });
});
