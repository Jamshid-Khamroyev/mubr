import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from './components/home'
import SideBar from "./components/sidebar"
import { useEffect, useState } from "react"
import { axios } from './api/index';
import Loader from "./components/loader"
import Login from "./components/login"
import { useDispatch, useSelector } from "react-redux"
import { hideLoad, showLoad } from "./reducers/load"
import { loginUser } from './reducers/user'
import Dashboard from "./components/dashboard"
import Tests from './components/tests'
import Schools from "./components/schools"
import School from "./components/school"

const App = () => {
  const { user } = useSelector(state => state.user)
  const { load } = useSelector(state => state.load)
  const dispatch = useDispatch()

  const getUser = async () => {
    dispatch(showLoad())
    try {
        const response = await axios.get(`/api/user/get-my/press`)
        if(response.data.ok){
          dispatch(loginUser(response.data.data))
        }
    } catch (error) {
        dispatch(hideLoad())
        return
    }
    dispatch(hideLoad())
  }

  useEffect(() => {
    if(!user){
      getUser()
    }
  }, [])
  return (
    <BrowserRouter>
        {load && <Loader />}
        <>
          {user ? (
            <div className="w-full flex justify-start gap-3">
              <SideBar />
              <Routes>
                <Route path="/" element={<HomePage />}/>
                <Route path="/dashboard" element={<Dashboard />}/>
                <Route path="/schools" element={<Schools />}/>
                <Route path="/school/:id" element={<School />}/>
                <Route path="/tests" element={<Tests />}/>
              </Routes>
            </div>
          ) : (
            <Login getMy={getUser}/>
          )}
        </>
    </BrowserRouter>
  )
}

export default App