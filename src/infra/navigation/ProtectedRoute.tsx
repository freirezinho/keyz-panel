import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";

type ProtectedProps = {
  children: React.ReactNode | null
}
const Protected = ({ children }: ProtectedProps) => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/login')
  }, [navigate])

  return (
    <>{children}</>
  )
}

export default Protected
