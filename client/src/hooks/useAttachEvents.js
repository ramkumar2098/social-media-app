import { useEffect } from 'react'

export function useAttachEvents(close, ref) {
  useEffect(() => {
    const handleEvent = e =>
      (e.keyCode === 27 ||
        (ref ? ref.current.isEqualNode(e.target) : !e.keyCode)) &&
      close()

    ;['click', 'keyup'].forEach(event =>
      window.addEventListener(event, handleEvent)
    )

    return () =>
      ['click', 'keyup'].forEach(event =>
        window.removeEventListener(event, handleEvent)
      )
  }, [])
}
