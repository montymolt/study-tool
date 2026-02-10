import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CardEditor from './CardEditor'

test('renders editor and saves', ()=>{
  const onSave = jest.fn()
  render(<CardEditor onSave={onSave} />)
  const front = screen.getByLabelText(/Front/i)
  fireEvent.change(front, { target: { value: 'Q1' }})
  const back = screen.getByLabelText(/Back/i)
  fireEvent.change(back, { target: { value: 'A1' }})
  const save = screen.getByText(/Save/i)
  fireEvent.click(save)
  expect(onSave).toHaveBeenCalled()
})
