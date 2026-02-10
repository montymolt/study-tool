import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SwipeView from './SwipeView'

const cards = [{ id:'1', front:'Q1', back:'A1', tags:[], createdAt: new Date().toISOString() }]

test('renders and swipes', ()=>{
  const onSwipe = jest.fn()
  render(<SwipeView cards={cards as any} onSwipe={onSwipe} />)
  const know = screen.getByText(/Know/i)
  fireEvent.click(know)
  expect(onSwipe).toHaveBeenCalled()
})
