import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import { prettyDOM } from '@testing-library/react'


describe('Blog Tests', () => {

  let component
  const incrementLikes = jest.fn()

  beforeEach(() => {
    const blog = {
      'title': 'Title for the test',
      'author': 'Mr Test',
      'url': 'www.test.com',
      'likes': 10,
      'user': {
        'id': 'test1234'
      }
    }

    component = render(
      <Blog blog={blog} id={'test4321'} incrementLikes={incrementLikes} />
    )
  })

  test('blog that has title and author',() => {

    expect(
      component.container.querySelector('.blogsView')
    ).not.toBe(null)
  })

  test('blog that has title and author but no other details',() => {

    expect(
      component.container.querySelector('.blogsView')
    ).not.toBe(null)

    expect(
      component.container.querySelector('.blogsDetail')
    ).toBe(null)
  })

  test('When view button clicked, then url and author shown', () => {

    expect(
      component.container.querySelector('.blogsView')
    ).not.toBe(null)

    expect(
      component.container.querySelector('.blogsDetail')
    ).toBe(null)

    const button = component.getByText('view')
    fireEvent.click(button)

    expect(
      component.container.querySelector('.blogsView')
    ).toBe(null)

    expect(
      component.container.querySelector('.blogsDetail')
    ).not.toBe(null)
  })

  test('Verify when likes button is clicked..', () => {

    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    const likeButton = component.getByText('likes')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(incrementLikes.mock.calls).toHaveLength(2)
  })


})