import { createBrowserRouter } from "react-router-dom";
import Protected from "./ProtectedRoute";

const pages = import.meta.glob("../../features/**/*.tsx", { eager: true })

const unrestricted = [
  "/login"
]

const routes = []

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
  Element: React.ComponentType,
  path: string
}
const protectedFactory = ({ Element, path }: ProtectedFactoryProps): JSX.Element => {
  if (unrestricted.includes(path)) {
    return (<Element />)
  }
  else {
    return (<Protected><Element /></Protected>)
  }
}

export const router = createBrowserRouter(
  routes.map(({ Element, ErrorBoundary, ...rest }) => ({
    ...rest,
    element: protectedFactory({ Element, path: rest.path }),
    ...(ErrorBoundary && { errorElement: <ErrorBoundary /> })
  }))
)
