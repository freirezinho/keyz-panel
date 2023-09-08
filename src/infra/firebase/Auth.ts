import { Auth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { getAuth, AuthError as FireAuthError } from "firebase/auth"
import { AuthData, AuthError } from "../navigation/ProtectedRoute"
import initFirebase from "."
import { FirebaseError } from "firebase/app"

initFirebase()

const auth = getAuth()
auth.useDeviceLanguage()

const authenticationProvider = new GoogleAuthProvider()

class FirebaseAuthenticator {
  auth: Auth
  googleProvider: GoogleAuthProvider
  public static shared: FirebaseAuthenticator = new FirebaseAuthenticator(authenticationProvider)

  constructor(google: GoogleAuthProvider) {
    this.auth = getAuth()
    this.auth.useDeviceLanguage()
    this.googleProvider = google
    this.googleProvider.setCustomParameters({
      'login_hint': 'vc@aluno.faculdadeimpacta.com.br'
    })
  }

  signInWithGoogle = async (onSuccess: (data: AuthData) => void, onError: (error: AuthError) => void) => {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential?.accessToken
      const user = result.user
      onSuccess({ user, token })
      return true
    } catch (error) {
      const errorCode = (error as FirebaseError).code
      const errorMessage = (error as FirebaseError).message
      const email = (error as FireAuthError).customData.email ?? ""
      const credential = GoogleAuthProvider.credentialFromError(error as FirebaseError)
      console.error(JSON.stringify({ errorCode, errorMessage, email, credential }))
      onError({ errorCode, errorMessage, email })
    }
  }
}

export default FirebaseAuthenticator
