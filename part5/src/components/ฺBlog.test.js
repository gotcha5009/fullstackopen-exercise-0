import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';

describe('<Blog />', () => {
  let component;
  let mockHandler = jest.fn();

  const blog = {
    id: '60a66b1120c7713b18f7406b',
    likes: 3,
    title: 'Test',
    author: 'asdad',
    url: 'adasd.com',
    user: {
      id: '60a2ad7d682fa12e0413f998',
      name: 'testboii',
    },
  };

  const user = {
    name: 'testboii',
  };

  beforeEach(() => {
    component = render(
      <Blog blog={blog} user={user} handleLike={mockHandler} />
    );
  });

  test('shows only title and author, but not url and likes by default', () => {
    const alwaysShowDiv = component.container.querySelector('.alwaysShowBlog');
    const toggleDiv = component.container.querySelector('.detailBlog');

    expect(alwaysShowDiv).not.toHaveStyle('display: none');
    expect(toggleDiv).toHaveStyle('display: none');
  });

  test('shows all details after click show button', () => {
    const toggleDiv = component.container.querySelector('.detailBlog');
    const button = component.getByText('view');

    fireEvent.click(button);

    expect(toggleDiv).not.toHaveStyle('display: none');
  });

  test('is received proper number of like button clicked', () => {
    const button = component.getByText('like');

    for (let i = 0; i < 2; i++) {
      fireEvent.click(button);
    }

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
