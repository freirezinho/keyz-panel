"use client"

import { ColumnDef } from "@tanstack/react-table"

export type LogResponse = { 
  result: Log[]
}

export type Log = {
  id: string,
  message: string,
  created_at: string,
  updated_at: string
}

export const columns: ColumnDef<Log>[] = [
  {
    accessorFn: item => `${new Date(item.created_at).toLocaleString()}`,
    header: "Data",
  },
  {
    accessorFn: item => `${item.message.split(": ")[1]}`,
    header: "Registro",
  },
]
