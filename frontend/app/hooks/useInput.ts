import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useState,
} from 'react'

export const useInput = (
  init: string,
): [string, ChangeEventHandler, Dispatch<SetStateAction<string>>] => {
  const [value, setValue] = useState(init)
  const onChange = (event: ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value)
  return [value, onChange, setValue]
}
