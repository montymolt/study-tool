import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import FlashcardView from './FlashcardView'

const card = { id:'1', front:'Q', back:'A', tags:[], createdAt: new Date().toISOString() }

test('flips and answers', ()=>{
  const onAnswer = jest.fn()
  render(<FlashcardView card={card as any} onAnswer={onAnswer} />)
  const box = screen.getByText(/Q/)
  fireEvent.click(box)
  const btn = screen.getByText('5')
  fireEvent.click(btn)
  expect(onAnswer).toHaveBeenCalled()
})
