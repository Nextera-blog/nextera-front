import React from "react"
import { Header } from "../components/Header"
import { Outlet } from "react-router-dom"
import { Footer } from "../components/Footer"

export const App: React.FunctionComponent = () => {
  return (
    <div className="w-full h-full bg-sky-950 text-sky-50">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}