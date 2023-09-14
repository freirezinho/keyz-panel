import { cn } from "@/lib/utils"
import { Button } from "./button"
import FirebaseAuthenticator from "@/infra/firebase/Auth"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center justify-between space-x-4 lg:space-x-6 w-full", className)}
      {...props}
    >
      <a
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Keyz
      </a>
      {/* <a
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Overview
      </a>
      <a
        href="/"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Chaves
      </a>
      <a
        href="/"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Atividade
      </a>
      <a
        href="/"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Configurações
      </a> */}
      <Button variant="outline" onClick={FirebaseAuthenticator.shared.signOut}>Logout</Button>
    </nav>
  )
}
