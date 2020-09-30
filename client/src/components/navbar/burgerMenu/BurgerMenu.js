import React from 'react'
import { useAttachEvents } from 'hooks/useAttachEvents'
import NavItems from '../navItems/NavItems'
import { overlay } from 'components/Overlay.module.css'

function BurgerMenu({ closeBurgerMenu }) {
  useAttachEvents(closeBurgerMenu)

  return (
    <div className={overlay} style={{ top: '47px' }}>
      <NavItems className="burgerMenu" />
    </div>
  )
}

export default BurgerMenu
