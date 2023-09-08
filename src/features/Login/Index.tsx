import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { AuthForm } from "./components/AuthForm"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import Auth from '../../infra/firebase/Auth'
import { useNavigate } from "react-router-dom"
import { LoadingBG } from "@/infra/navigation/ProtectedRoute"

export default function Login() {
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(Auth.shared.auth, (user) => {
      if (user) {
        navigate("/")
        setLoading(false)
      } else {
        setLoading(false)
      }
    })
    setLoading(false)
  }, [navigate, isLoading])

  return (
    <>
      {/* <div className="md:hidden">
        <img
          src="https://images.unsplash.com/photo-1635602739175-bab409a6e94c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2952&q=80"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <img
          src="https://images.unsplash.com/photo-1635602739175-bab409a6e94c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2952&q=80"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div> */}
      {isLoading ?
        (<LoadingBG />)
        : (<div className="container relative bg-surface1 hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <a
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute right-4 top-4 md:right-8 md:top-8"
            )}
          >
            Login
          </a>
          <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-secondary" />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-6 w-6"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
              Keyz
            </div>
            <div className="relative z-20 mt-auto">
              {/* <blockquote className="space-y-2">
                <p className="text-lg">
                  &ldquo;This library has saved me countless hours of work and
                  helped me deliver stunning designs to my clients faster than
                  ever before.&rdquo;
                </p>
                <footer className="text-sm">Sofia Davis</footer>
              </blockquote> */}
            </div>
          </div>
          <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Sign in
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email below to authenticate yourself
                </p>
              </div>
              <AuthForm />
              <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <a
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>)}
    </>
  )
}
