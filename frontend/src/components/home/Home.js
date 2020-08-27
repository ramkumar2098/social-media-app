import React, { useEffect } from 'react'

function Home({ setDisplayBurger }) {
  useEffect(() => {
    setDisplayBurger(true)

    return () => setDisplayBurger(false)
  }, [])

  return <div>home</div>
}

export default Home
