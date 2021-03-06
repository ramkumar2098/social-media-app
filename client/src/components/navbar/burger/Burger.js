import React from 'react'
import style from './Burger.module.css'

function Burger({ openBurgerMenu }) {
  return (
    <button onClick={openBurgerMenu} className={style.burgerBtn}>
      &#9776;
    </button>
  )
}

export default Burger
