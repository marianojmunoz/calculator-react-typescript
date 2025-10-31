import React, { FunctionComponent, useState, useEffect } from 'react'
import styled from 'styled-components'
import Display from '../Display/Display'
import Pad from '../Pad/Pad'
import { Digit, Operator } from '../../lib/types'

const StyledApp = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue" ,Arial ,sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 16px;
  width: 100%;
  max-width: 320px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`

export const App: FunctionComponent = () => {
  // Calculator's states
  const [memory, setMemory] = useState<number>(0)
  const [result, setResult] = useState<number>(0)
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(true)
  const [pendingOperator, setPendingOperator] = useState<Operator>()
  const [display, setDisplay] = useState<string>('0')
  const [expression, setExpression] = useState<string>('')

  const onKeyDown = (e: KeyboardEvent) => {
    e.preventDefault()

    if (e.key >= '0' && e.key <= '9') {
      onDigitButtonClick(Number(e.key) as Digit)
    } else if (/[+\-×÷]/.test(e.key)) {
      onOperatorButtonClick(e.key as Operator)
    } else if (e.key === '*') {
      onOperatorButtonClick('×')
    } else if (e.key === '/') {
      onOperatorButtonClick('÷')
    } else if (e.key === '.' || e.key === ',') {
      onPointButtonClick()
    } else if (e.key === 'Enter' || e.key === '=') {
      onEqualButtonClick()    
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      onBackspaceButtonClick()
    } else if (e.key === 'Escape') {
      onAllClearButtonClick()
    } else if (e.key.toLowerCase() === 'r') {
      onMemoryRecallButtonClick()
    } else if (e.key.toLowerCase() === 'p') {
      onMemoryPlusButtonClick()
    } else if (e.key.toLowerCase() === 'q') {
      onMemoryMinusButtonClick()
    } else if (e.key.toLowerCase() === 'c') {
      onMemoryClearButtonClick()
    } else if (e.key.toLowerCase() === 'n') {
      onChangeSignButtonClick()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
    // We need to re-run this effect whenever the handler functions change
    // to avoid using stale closures.
  })

  const calculate = (rightOperand: number, pendingOperator: Operator): boolean => {
    let newResult = result

    switch (pendingOperator) {
      case '+':
        newResult += rightOperand
        break
      case '-':
        newResult -= rightOperand
        break
      case '×':
        newResult *= rightOperand
        break
      case '÷':
        if (rightOperand === 0) {
          return false
        }

        newResult /= rightOperand
    }

    setResult(newResult)
    setDisplay(newResult.toString().toString().slice(0, 12))

    return true
  }

  // Pad buttons handlers
  const onDigitButtonClick = (digit: Digit) => {
    let newDisplay = display

    if ((display === '0' && digit === 0) || display.length > 12) {
      return
    }

    if (waitingForOperand) {
      // If we are waiting for an operand but there's no pending operator, it's a new calculation.
      if (typeof pendingOperator === 'undefined') {
        setExpression('')
        newDisplay = ''
      } else {
        newDisplay = ''
      }
    }
    
    if (newDisplay === '0' && digit !== 0) {
      newDisplay = digit.toString()
    } else if (newDisplay !== '0') {
      newDisplay = newDisplay + digit.toString()
    }

    setDisplay(newDisplay)
    setWaitingForOperand(false)
  }

  const onPointButtonClick = () => {
    let newDisplay = display

    if (waitingForOperand) {
      newDisplay = '0'
    }

    if (newDisplay.indexOf('.') === -1) {
      newDisplay = newDisplay + '.'
    }

    setDisplay(newDisplay)
    setWaitingForOperand(false)
  }

  const onOperatorButtonClick = (operator: Operator) => {
    const operand = Number(display)

    if (typeof pendingOperator !== 'undefined' && !waitingForOperand) {
      if (!calculate(operand, pendingOperator)) {
        return
      }
      setExpression(prev => `${prev} ${operand} ${operator}`)
    } else {
      // If waiting for an operand but there's no pending operator, it's a new calculation starting with the previous result.
      if (typeof pendingOperator === 'undefined') {
        setExpression(`${operand} ${operator}`)
      } else if (waitingForOperand) {
        setExpression(prev => prev.slice(0, -1) + operator)
      } else {
      setExpression(`${operand} ${operator}`)
      }
      setResult(operand)
    }

    setPendingOperator(operator)
    setWaitingForOperand(true)
  }

  const onChangeSignButtonClick = () => {
    const value = Number(display)

    if (value > 0) {
      setDisplay('-' + display)
    } else if (value < 0) {
      setDisplay(display.slice(1))
    }
  }

  const onEqualButtonClick = () => {
    const operand = Number(display)

    if (typeof pendingOperator !== 'undefined') {
      // If we are not waiting for an operand, it's a normal calculation
      if (!waitingForOperand) {
      if (!calculate(operand, pendingOperator)) {
        return
      }
      setPendingOperator(undefined)
      setExpression(prevExpression => `${prevExpression} ${operand} =`)
      setWaitingForOperand(true)
      } else { // If we are waiting for an operand...
        // This case is when an operator is the last thing pressed, e.g. `10 + 5 + =`
        // The desired behavior is to just finalize the calculation.
        setExpression(prev => `${prev.slice(0, -1)}=`)
        setPendingOperator(undefined)
      }
    }
  }

  const onAllClearButtonClick = () => {
    setMemory(0)
    setResult(0)
    setPendingOperator(undefined)
    setDisplay('0')
    setWaitingForOperand(true)
    setExpression('')
  }

  const onClearEntryButtonClick = () => {
    setDisplay('0')
    setWaitingForOperand(true)
    setExpression('')
  }

  const onBackspaceButtonClick = () => {
    if (waitingForOperand) {
      // This case handles when an operator was the last button pressed.
      // We want to undo the operator.
      if (typeof pendingOperator !== 'undefined') {
        setPendingOperator(undefined)
        setExpression(prev => prev.slice(0, prev.lastIndexOf(' ')).slice(0, prev.lastIndexOf(' ')))
        setWaitingForOperand(false)
      }
      // If there's no pending operator, do nothing.
      return;
    }

    const newDisplay = display.slice(0, -1)

    if (newDisplay === '' || newDisplay === '-') {
      setDisplay('0')
    } else {
      setDisplay(newDisplay)
    }
  }

  const onMemoryRecallButtonClick = () => {
    setDisplay(memory.toString())
    setWaitingForOperand(true)
  }

  const onMemoryClearButtonClick = () => {
    setMemory(0)
    setWaitingForOperand(true)
  }

  const onMemoryPlusButtonClick = () => {
    setMemory(memory + Number(display))
    setWaitingForOperand(true)
  }

  const onMemoryMinusButtonClick = () => {
    setMemory(memory - Number(display))
    setWaitingForOperand(true)
  }

  return (
    <StyledApp>
      <Display
        value={display}
        hasMemory={memory !== 0}
        expression={expression}
      />
      <Pad
        onDigitButtonClick={onDigitButtonClick}
        onPointButtonClick={onPointButtonClick}
        onOperatorButtonClick={onOperatorButtonClick}
        onChangeSignButtonClick={onChangeSignButtonClick}
        onEqualButtonClick={onEqualButtonClick}
        onAllClearButtonClick={onAllClearButtonClick}
        onClearEntryButtonClick={onClearEntryButtonClick}
        onBackspaceButtonClick={onBackspaceButtonClick}
        onMemoryRecallButtonClick={onMemoryRecallButtonClick}
        onMemoryClearButtonClick={onMemoryClearButtonClick}
        onMemoryPlusButtonClick={onMemoryPlusButtonClick}
        onMemoryMinusButtonClick={onMemoryMinusButtonClick}
      />
    </StyledApp>
  )
}

export default App
