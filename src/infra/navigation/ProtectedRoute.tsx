import { User, onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { useNavigate } from "react-router-dom";
import Auth from '../firebase/Auth';
import { Icons } from '@/components/ui/icons';

type ProtectedProps = {
  children: React.ReactNode | null
}
enum ProtectedAction {
  login,
  logout,
  loading,
  error,
  updateUser
}
type Action = { type: ProtectedAction, data?: AuthData, error?: AuthError }
type Dispatch = (action: Action) => void
type State = { user: User | null, token: string, isLoading: boolean, isError: boolean, error: AuthError | null }
export type AuthData = {
  user: User | null,
  token: string | undefined
}
export type AuthError = {
  errorCode: string | number,
  errorMessage: string,
  email: string
}
const ProtectedContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined)

const initialState = { user: null, token: "", isLoading: false, isError: false, error: null }

function protectedReducer(state: State, action: Action) {
  switch (action.type) {
    case ProtectedAction.loading: {
      return { ...state, isLoading: !state.isLoading, isError: false, error: null }
    }
    case ProtectedAction.login: {
      if (action.data === null || action.data === undefined) {
        console.error(`Can't login without data'`)
        return state
      }
      return { ...state, user: action?.data.user, token: action?.data.token ?? "", isError: false, error: null }
    }
    case ProtectedAction.error: {
      if (action.error === null || action.error === undefined) {
        return { ...state, isError: true }
      }
      return { ...state, isError: true, error: action?.error }
    }
    case ProtectedAction.logout: {
      return initialState
    }
    case ProtectedAction.updateUser: {
      if (action.data === null || action.data === undefined) {
        console.error(`Can't login without data'`)
        return state
      }
      return { ...state, user: action?.data.user, token: action?.data.token ?? "", isError: false, error: null }
    }
    default: {
      throw new Error(`Unhandled action type: ${(action as Action).type}`)
    }
  }
}

function _useAuth() {
  const context = useContext(ProtectedContext)
  if (context == undefined) {
    throw new Error("useAuth must be used within a Protected component")
  }
  return context
}

function useAuth() {
  const context = _useAuth()

  const login = async () => {
    context.dispatch({ type: ProtectedAction.loading })
    return Auth.shared.signInWithGoogle((authData: AuthData) => {
      context.dispatch({ type: ProtectedAction.login, data: authData })
      context.dispatch({ type: ProtectedAction.loading })
    }, (error: AuthError) => {
      context.dispatch({ type: ProtectedAction.error, error })
      context.dispatch({ type: ProtectedAction.loading })
      throw new Error("Auth error")
    })
  }

  const loginWithPassword = async (email: string, password: string) => {
    context.dispatch({ type: ProtectedAction.loading })
    Auth.shared.signInWithEmailAndPassword(email, password, (success: AuthData | null, error: AuthError | null) => {
      if (error === null && success !== null) {
        context.dispatch({ type: ProtectedAction.login, data: success })
        context.dispatch({ type: ProtectedAction.loading })
      } else if (error !== null) {
        context.dispatch({ type: ProtectedAction.error, error })
        context.dispatch({ type: ProtectedAction.loading })
      } else {
        context.dispatch({ type: ProtectedAction.loading })
        throw new Error("Auth unhandled error")
      }
    })
  }

  const logout = async () => {
    context.dispatch({ type: ProtectedAction.loading })
    context.dispatch({ type: ProtectedAction.logout })
    context.dispatch({ type: ProtectedAction.loading })
  }

  return {
    login,
    loginWithPassword,
    logout,
    isLoading: context.state.isLoading,
    isError: context.state.isError,
    authError: context.state.error
  }
}

export const LoadingBG = () => (
  <div className='w-full h-screen flex flex-col items-center justify-center bg-surface1'>
    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
  </div>
)

const Protected = ({ children }: ProtectedProps) => {
  const [isLoading, setLoading] = useState(true)
  const [state, dispatch] = useReducer(protectedReducer, initialState)
  const value = { state, dispatch }
  const navigate = useNavigate()
  useEffect(() => {
    dispatch({ type: ProtectedAction.loading })
    onAuthStateChanged(Auth.shared.auth, (user) => {
      if (user) {
        user.getIdToken()
          .then((token) => {
            dispatch({ type: ProtectedAction.updateUser, data: { user: user, token } })
            dispatch({ type: ProtectedAction.loading })
            setLoading(false)
          })
      } else {
        navigate("/login")
        dispatch({ type: ProtectedAction.loading })
        setLoading(false)
      }
    })
  }, [navigate])

  return (
    <ProtectedContext.Provider value={value}>{isLoading ? <LoadingBG /> : children}</ProtectedContext.Provider>
  )
}

export { Protected, useAuth }
