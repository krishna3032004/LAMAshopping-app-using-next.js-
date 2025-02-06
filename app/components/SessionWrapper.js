"use client"
import { SessionProvider } from "next-auth/react"
import ScrollHandler from "./ScrollHandler"

const SessionWrapper =({children })=>{
  return (
    <SessionProvider>
      <ScrollHandler />
      {children}
    </SessionProvider>
  )
}

export default SessionWrapper