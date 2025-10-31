import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import Button from '../Button/Button'
import { Digit, Operator } from '../../lib/types'

interface PadProps {
  onDigitButtonClick: (digit: Digit) => void
  onPointButtonClick: () => void
  onOperatorButtonClick: (operator: Operator) => void
  onChangeSignButtonClick: () => void
  onEqualButtonClick: () => void
  onAllClearButtonClick: () => void
  onClearEntryButtonClick: () => void
  onBackspaceButtonClick: () => void
  onMemoryRecallButtonClick: () => void
  onMemoryClearButtonClick: () => void
  onMemoryPlusButtonClick: () => void
  onMemoryMinusButtonClick: () => void
}

const StyledPad = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 1fr;

  button {
    border-radius: 0;
  }
`

export const Pad: FunctionComponent<PadProps> = ({
  onDigitButtonClick,
  onPointButtonClick,
  onOperatorButtonClick,
  onChangeSignButtonClick,
  onEqualButtonClick,
  onAllClearButtonClick,
  onClearEntryButtonClick,
  onBackspaceButtonClick,
  onMemoryRecallButtonClick,
  onMemoryClearButtonClick,
  onMemoryPlusButtonClick,
  onMemoryMinusButtonClick
}) => {
  return (
    <StyledPad>
      <Button onClick={onMemoryRecallButtonClick}>
        MR
      </Button>
      <Button onClick={onMemoryClearButtonClick}>
        MC
      </Button>
      <Button onClick={onMemoryPlusButtonClick}>
        M+
      </Button>
      <Button onClick={onMemoryMinusButtonClick}>
        M-
      </Button>
      <Button color="red" onClick={onAllClearButtonClick}>
        AC
      </Button>
      <Button onClick={onClearEntryButtonClick}>
        C
      </Button>
      <Button onClick={onBackspaceButtonClick}>
        &larr;
      </Button>
      <Button color="dark" onClick={() => onOperatorButtonClick('÷')}>
        ÷
      </Button>
      <Button onClick={() => onDigitButtonClick(7)}>
        7
      </Button>
      <Button onClick={() => onDigitButtonClick(8)}>
        8
      </Button>
      <Button onClick={() => onDigitButtonClick(9)}>
        9
      </Button>
      <Button color="dark" onClick={() => onOperatorButtonClick('×')}>
        ×
      </Button>
      <Button onClick={() => onDigitButtonClick(4)}>
        4
      </Button>
      <Button onClick={() => onDigitButtonClick(5)}>
        5
      </Button>
      <Button onClick={() => onDigitButtonClick(6)}>
        6
      </Button>
      <Button color="dark" onClick={() => onOperatorButtonClick('-')}>
        -
      </Button>
      <Button onClick={() => onDigitButtonClick(1)}>
        1
      </Button>
      <Button onClick={() => onDigitButtonClick(2)}>
        2
      </Button>
      <Button onClick={() => onDigitButtonClick(3)}>
        3
      </Button>
      <Button color="dark" onClick={() => onOperatorButtonClick('+')}>
        +
      </Button>
      <Button onClick={onChangeSignButtonClick}>
        -/+
      </Button>
      <Button onClick={onPointButtonClick}>
        .
      </Button>
      <Button color="green" isLarge={true} onClick={() => onEqualButtonClick()}>
        =
      </Button>
    </StyledPad>
  )
}

export default Pad
