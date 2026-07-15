import { BrowserRouter, Route, Routes } from "react-router-dom"
import { lazy } from "react";
import { useSelector } from "react-redux"
import { Suspense } from "react"

const HomePage = lazy(() => import("./components/home"));
const Navbar = lazy(() => import("./components/navbar"));
const Advantage = lazy(() => import("./components/advantage"));
const Coment = lazy(() => import("./components/coment"));
const Login = lazy(() => import("./components/login"));
const Footer = lazy(() => import("./components/footer"));
const Loader = lazy(() => import("./components/loader"));
const NotFound = lazy(() => import("../components/not-found"));

import './index.modul.css'

const App = () => {
  const {load} = useSelector(state => state.load)
  return (
    <div id="body">
    <BrowserRouter>
    <Suspense fallback={<div className="fixed top-0 left-0 w-[100vw] h-[100vh] blur-2xl"></div>}>
      <Navbar />
      {load && <Loader />}
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/advantage" element={<Advantage />}/>
        <Route path="/coment" element={<Coment />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="*" element={<NotFound />}/>
      </Routes>
      <Footer />
      </Suspense>
    </BrowserRouter>
    </div>
  )
}

export default App