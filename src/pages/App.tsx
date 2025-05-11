import React from "react"
import { Header } from "../components/Header"
import { Outlet } from "react-router-dom"
import { Footer } from "../components/Footer"

export const App: React.FunctionComponent = () => {
  return (
    <div className="w-full min-h-screen bg-sky-950 text-sky-50 flex flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}