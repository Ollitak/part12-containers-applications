import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('render Todo', () => {
  const todo = {
    text:"Jest test",
    done:true
  }

  render(<Todo todo={todo} onClickComplete={()=>null} onClickDelete={()=>null} />)

  const element = screen.getByText('Jest test')
  expect(element).toBeDefined()
})