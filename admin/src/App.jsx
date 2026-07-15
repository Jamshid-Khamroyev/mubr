import { BrowserRouter, Route, Routes, data, useNavigate } from "react-router-dom"
import Users from './pages/users'
import Login from './pages/login'
import SideBar from './components/side-bar'
import Teams from "./pages/teams"
import { useDispatch, useSelector } from "react-redux"
import Tests from "./pages/tests"
import Library from "./pages/library"
import NotFound from "./components/notFound"
import Loader from "./components/loader"
import { toast } from "react-toastify"
import { axios1 } from "./api/api"
import { LoginUser } from './reducers/user'
import { showLoad, hideLoad } from './reducers/load'
import { useEffect } from "react"
import Bests from "./pages/bests"
import Helps from "./pages/helps"
import Prize from "./pages/prize"
import Complaints from "./pages/complaints"
import Statistics from "./pages/statistics"

const App = () => {
  const { load } = useSelector(state => state.load)
  const { user } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const getMy = async () => {
    dispatch(showLoad())
    try {
      const response = await axios1.get(`/api/user/get-my/admin`)
      if(response.data.ok){
        dispatch(LoginUser(response.data.data))
      }
    } catch (error) {
      
    }
    dispatch(hideLoad())
  }

  useEffect(() => {
    getMy()
  }, [])
  
  return (
    <BrowserRouter>
      <div className="w-full flex justify-start gap-2 bg-slate-900 text-white">
        {load && <Loader />}
        <SideBar />
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Users />}/>
              <Route path="/teams" element={<Teams />}/>
              <Route path="/tests" element={<Tests />}/>
              <Route path="/library" element={<Library />}/>
              <Route path="/bests" element={<Bests />}/>
              <Route path="/helps" element={<Helps />}/>
              <Route path="/prize" element={<Prize />}/>
              <Route path="/complaints" element={<Complaints />}/>
              <Route path="/statistics" element={<Statistics />}/>
            </>
          ) : (
            <Route path="/" element={<Login getMy={getMy}/>}/>
          )}
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App