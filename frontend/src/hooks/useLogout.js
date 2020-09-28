import { useHistory } from 'react-router-dom'

export function useLogout() {
  const { push } = useHistory()

  return () => {
    fetch('/logout', { method: 'DELETE' })
      .then(() => push('/login'))
      .catch(console.log)
  }
}
