"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Log = string[]

export const columns: ColumnDef<Log>[] = [
  {
    accessorFn: item => `${new Date(item[2]).toLocaleString()}`,
    header: "Data",
  },
  {
    accessorFn: item => `${item[1].split(": ")[1]}`,
    header: "Registro",
  },
]
