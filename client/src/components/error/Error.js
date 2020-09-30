import React from 'react'
import style from './Error.module.css'

function Error({ error }) {
  return <div className={style.error}>{error}</div>
}

export default Error
