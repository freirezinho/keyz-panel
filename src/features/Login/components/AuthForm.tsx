import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/infra/navigation/ProtectedRoute"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AuthForm({ className, ...props }: UserAuthFormProps) {
  const { isLoading, loginWithPassword, isError, authError } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
  }

  async function loginWithEmailAndPassword(event: React.SyntheticEvent) {
    event.preventDefault()
    console.log(username)
    console.log(password)
    loginWithPassword(username, password)
      .then(() => {
        navigate("/")
      })
      .catch((error) => {
        // noop
        console.error(error)
      })
      .finally(() => {
        if (isError) {
          console.error(authError)
        }
      })
  }

  function handleUserNameChange(event: React.SyntheticEvent) {
    const { target } = event
    setUsername((target as HTMLInputElement).value)
  }

  function handlePasswordChange(event: React.SyntheticEvent) {
    const { target } = event
    setPassword((target as HTMLInputElement).value)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={username}
              onChange={handleUserNameChange}
            />
            <Label className="sr-only" htmlFor="email">
              Password
            </Label>
            <Input
              id="password"
              placeholder="************"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <Button disabled={isLoading} onClick={loginWithEmailAndPassword}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
    </div>
  )
}
