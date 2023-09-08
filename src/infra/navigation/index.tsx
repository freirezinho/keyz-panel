import { createBrowserRouter } from "react-router-dom";

const pages = import.meta.glob("../../features/**/*.tsx", { eager: true })

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

export const router = createBrowserRouter(
  routes.map(({ Element, ErrorBoundary, ...rest }) => ({
    ...rest,
    element: <Element />,
    ...(ErrorBoundary && { errorElement: <ErrorBoundary /> })
  }))
)
