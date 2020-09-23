import React, { useRef } from 'react'
import style from './Footer.module.css'

function Footer() {
  const footerRef = useRef()

  let prevScrollPos = window.pageYOffset

  window.addEventListener('scroll', () => {
    const currentScrollPos = window.pageYOffset

    footerRef.current.style.bottom =
      prevScrollPos > currentScrollPos ? 0 : '-26px'

    prevScrollPos = currentScrollPos
  })

  return (
    <div ref={footerRef} className={style.footer}>
      © 2020 fakebook.com
    </div>
  )
}

export default Footer
