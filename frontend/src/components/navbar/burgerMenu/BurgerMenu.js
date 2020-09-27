import React from 'react'
import { useAttachEvents } from 'hooks/useAttachEvents'
import Overlay from './overlay/Overlay'
import NavItems from '../navItems/NavItems'

function BurgerMenu({ closeBurgerMenu }) {
  useAttachEvents(closeBurgerMenu)

  return (
    <>
      <Overlay />
      <NavItems className="burgerMenu" />
    </>
  )
}

export default BurgerMenu
