import React from 'react'
import ButtonSpinner from 'components/buttonSpinner/ButtonSpinner'
import style from './Buttons.module.css'

function Buttons({
  text,
  submit,
  loading,
  cancel,
  opacity,
  styles,
  autoFocus,
}) {
  return (
    <div className={style.buttons} style={{ ...styles }}>
      <button
        onClick={submit}
        disabled={loading}
        style={{ opacity }}
        autoFocus={autoFocus}
      >
        {loading && <ButtonSpinner />}
        {text}
      </button>
      <button onClick={cancel}>Cancel</button>
    </div>
  )
}

export default Buttons
