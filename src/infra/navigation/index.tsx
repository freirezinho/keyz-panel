import { ActionFunction, LoaderFunction, RouteObject, createBrowserRouter } from "react-router-dom";
import { Protected } from "./ProtectedRoute";

type PageModule = {
  default: React.ComponentType | null,
  loader: LoaderFunction | undefined,
  action: ActionFunction | undefined,
  ErrorBoundary: React.ComponentType | null
}

const pages: Record<string, PageModule> = import.meta.glob("../../features/**/*.tsx", { eager: true })

const unrestricted = [
  "/login"
]

type IncrementedRouteObject = {
  Element: React.ComponentType | null
} & RouteObject

const routes: IncrementedRouteObject[] = []

for (const path of Object.keys(pages)) {
  const filename = path.match(/\.\.\/\.\.\/features\/(.*)\.tsx$/)?.[1].toLowerCase()
  if (!filename && !filename?.includes("components")) {
    continue
  }
  const normalizedPathName = filename.includes("$")
    ? filename.replace("$", ":")
    : filename.replace(/\/index/, "")
  routes.push({
    path: filename == "index" ? "/" : `${normalizedPathName.toLowerCase()}`,
    Element: pages[path].default,
    loader: pages[path]?.loader,
    action: pages[path]?.action,
    ErrorBoundary: pages[path]?.ErrorBoundary
  })
}

type ProtectedFactoryProps = {
  Element: React.ComponentType | null,
  path: string | undefined
}
const protectedFactory = ({ Element, path }: ProtectedFactoryProps): JSX.Element | null => {
  if (Element != null && path != undefined && unrestricted.includes(path)) {
    return (<Element />)
  }
  else {
    return (
      <Protected>
        {
          Element && <Element />
        }
      </Protected>
    )
  }
}

export const router = createBrowserRouter(
  routes.map(({ Element, ErrorBoundary, ...rest }) => ({
    ...rest,
    element: protectedFactory({ Element, path: rest.path }),
    ...(ErrorBoundary && { errorElement: <ErrorBoundary /> })
  })),
  {
    basename: import.meta.env.BASE_URL
  }
)
