import { useState } from 'react'

export function useForm() {
  const [values, setValues] = useState({})

  const handleChange = e => {
    e.persist()
    setValues({ ...values, [e.target.id]: e.target.value })
  }

  return { values, handleChange }
}
