import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/ui/mainnav"
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Log, columns } from "./components/table/columns"
import { DataTable } from "./components/table/DataTable"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useCallback, useEffect, useState } from "react"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/components/ui/use-toast"

function Home() {

  const [userId, setUserID] = useState("")
  const [keyID, setKeyID] = useState("")
  const [creatingKey, setCreatingKey] = useState(false)
  const [deletingKey, setDeletingKey] = useState(false)
  const [data, setData] = useState<Log[]>([])
  const { toast } = useToast()

  const getData = async (): Promise<Log[]> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/logs/`)
      const json = await res.json() as Log[]
      return json
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const handleUserIDChange = useCallback((event: React.SyntheticEvent) => {
    const { target } = event
    setUserID((target as HTMLInputElement).value)
  }, [])

  const handleKeyIDChange = useCallback((event: React.SyntheticEvent) => {
    const { target } = event
    setKeyID((target as HTMLInputElement).value)
  }, [])

  const createKey = useCallback(async (userID: string) => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/keys`, {
      body: JSON.stringify({
        user_id: userID
      }), method: 'post', headers: { 'content-type': 'application/json' }
    }).then(() => {

    }).catch(error => {
      console.error(error)
    })
  }, [])

  const cancelKey = useCallback(async (keyID: string) => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/keys/${keyID}`, { method: 'delete' })
  }, [])

  const createKeyForUser = useCallback((event: React.SyntheticEvent) => {
    event.preventDefault()
    setCreatingKey(true)
    createKey(userId)
      .then((res: any) => {
        if (res.statusCode !== 201 || res.statusCode !== 200) {
          throw Error("http error")
        }
        toast({
          title: "Chave criada",
          description: `O usuário ${userId} já pode utilizá-la`,
        })
      })
      .catch(() => {
        toast({
          title: "Erro",
          description: `Houve um problema ao criar a chave`,
          variant: 'destructive'
        })
      })
      .finally(() => {
        setCreatingKey(false)
        setUserID("")
      })
  }, [userId, createKey, toast])

  const cancelKeyForUser = useCallback((event: React.SyntheticEvent) => {
    event.preventDefault()
    setDeletingKey(true)
    cancelKey(keyID)
      .then((res: any) => {
        if (res.statusCode !== 201 || res.statusCode !== 200) {
          throw Error("http error")
        }
        toast({
          title: "Chave cancelada",
          description: `A chave ${keyID} não pode mais ser utilizada`
        })
      })
      .catch(() => {
        toast({
          title: "Erro",
          description: `Houve um problema ao cancelar a chave`,
          variant: 'destructive'
        })
      })
      .finally(() => {
        setDeletingKey(false)
        setKeyID("")
      })
  }, [keyID, cancelKey])

  useEffect(() => {
    getData().then(res => setData(res as unknown as Log[]))
  }, [])

  return (
    <>
      <div className="md:hidden">
        <img
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <img
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex bg-surface1 h-screen">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            {/* <TeamSwitcher /> */}
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              {/* <Search />
                  <UserNav /> */}
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              {/* <CalendarDateRangePicker /> */}
              {/* <Button>Download</Button> */}
            </div>
          </div>
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Acessos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* <div className="text-2xl font-bold">00001</div>
                <p className="text-xs text-muted-foreground">
                  chaves ativas
                </p> */}
                {(data ? <DataTable columns={columns} data={data} /> : null)}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Criar nova chave
                </CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <Label htmlFor="userid">ID do Usuário</Label>
                {
                  creatingKey ? (
                    <div className="flex items-center justify-center text-center py-4">
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      <p>Criando chave...</p>
                    </div>
                  ) : (
                    <Input name="userid" className="mb-4" value={userId} onChange={handleUserIDChange} />
                  )
                }
                <Button onClick={createKeyForUser} disabled={creatingKey}>
                  {creatingKey && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Criar
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cancelar chave
                </CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <Label htmlFor="keyid">ID da chave</Label>
                {
                  deletingKey ? (
                    <div className="flex items-center justify-center text-center py-4">
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      <p>Cancelando chave...</p>
                    </div>
                  ) : (
                    <Input name="keyid" className="mb-4" value={keyID} onChange={handleKeyIDChange} />
                  )
                }
                <Button variant="destructive" disabled={deletingKey} onClick={cancelKeyForUser}>
                  {deletingKey && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Cancelar
                </Button>
              </CardContent>
            </Card>
          </div>
          {/* <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics" disabled>
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="reports" disabled>
                    Reports
                  </TabsTrigger>
                  <TabsTrigger value="notifications" disabled>
                    Notifications
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Revenue
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">
                          +20.1% from last month
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Subscriptions
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">
                          +180.1% from last month
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales</CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <path d="M2 10h20" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">+12,234</div>
                        <p className="text-xs text-muted-foreground">
                          +19% from last month
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Active Now
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">
                          +201 since last hour
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                      <CardHeader>
                        <CardTitle>Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="pl-2">
                        <Overview />
                      </CardContent>
                    </Card>
                    <Card className="col-span-3">
                      <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                        <CardDescription>
                          You made 265 sales this month.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RecentSales />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs> */}
        </div>
      </div >
    </>
  )
}

export default Home
