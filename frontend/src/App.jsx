import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { axios } from "./api"
import { Suspense, useEffect } from "react"
import { LoginUser } from './reducers/user'
import { hideLoad, showLoad } from "./reducers/load"
import { lazy } from "react";

// Components
const Navbar = lazy(() => import("./components/navbar"));
const Footer = lazy(() => import("./components/footer"));
const NotFound = lazy(() => import("./components/not-found"));
const Loader = lazy(() => import("./main-site/components/loader"));

// Get one page
const GetOnePublicTest = lazy(() => import("./components/get-one-public-test"));
const GetOneCenter = lazy(() => import("./components/get-one-center"));
const GetOneNew = lazy(() => import("./components/get-one-new"));
const GetOneBook = lazy(() => import("./components/get-one-book"));
const GetOneUser = lazy(() => import("./components/get-one-user"));
const GetOneTest = lazy(() => import("./components/get-one-test"));

// Pages
const HomePage = lazy(() => import("./pages/home-page"));
const Teams = lazy(() => import("./pages/teams"));
const Tests = lazy(() => import("./pages/tests"));
const PublicTests = lazy(() => import("./pages/public-tests"));
const Centers = lazy(() => import("./pages/centers"));
const Ratings = lazy(() => import("./pages/ratings"));
const Bests = lazy(() => import("./pages/bests"));
const News = lazy(() => import("./pages/news"));
const Books = lazy(() => import("./pages/books"));

// User's Pages
const Notification = lazy(() => import("./user's page/notification"));
const Profile = lazy(() => import("./user's page/profile"));
const MyTests = lazy(() => import("./user's page/my-tests"));
const Mystatistics = lazy(() => import("./user's page/my-statistics"));
const MyAchive = lazy(() => import("./user's page/my-achive"));
const Motivation = lazy(() => import("./user's page/motivation"));
const HappyWorld = lazy(() => import("./user's page/happy-world"));
const WriteCourse = lazy(() => import("./components/write-course"))

// Main App
const NewApp = lazy(() => import("./main-site/App"));


import './index.css'
import GetOneBest from "./components/get-one-best"

const App = () => {
  const {user} = useSelector(state => state.user)
  const { load } = useSelector(state => state.load)

  const dispatch = useDispatch()

  const getUser = async () => {
    dispatch(showLoad())
    try {
        const response = await axios.get(`/api/user/get-my`)
        if(response.data.ok){
          dispatch(LoginUser(response.data.data))
        }
    } catch (error) {
        dispatch(hideLoad())
    }
    dispatch(hideLoad())
  }

  window.addEventListener('unload', () => {
    localStorage.removeItem("publicTest")
  });

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user]);
  return (
    <Suspense fallback={<div className="fixed top-0 left-0 w-[100vw] h-[100vh] blur-2xl"></div>}>
      {user ? (
        <BrowserRouter>
        {load && <Loader />}
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/teams" element={<Teams />}/>
            <Route path="/tests" element={<Tests />}/>
            <Route path="/public-tests" element={<PublicTests />}/>
            <Route path="/centers" element={<Centers />}/>
            <Route path="/ratings" element={<Ratings />}/>
            <Route path="/bests" element={<Bests />}/>
            <Route path="/news" element={<News />}/>
            <Route path="/books" element={<Books />}/>
            {/* One pages */}

            <Route path="/center/:id" element={<GetOneCenter />}/>
            <Route path="/get-course/:id" element={<WriteCourse />}/>
            <Route path="/best/:id" element={<GetOneBest />}/>
            <Route path="/new/:id" element={<GetOneNew />}/>
            <Route path="/book/:id" element={<GetOneBook />}/>
            <Route path="/user/:id" element={<GetOneUser />}/>
            <Route path="/test/:id" element={<GetOneTest />}/>
            <Route path="/public-test/:id" element={<GetOnePublicTest />}/>
            {/* User Routers */}
            <Route path="/notification" element={<Notification />}/>
            <Route path="/profile" element={<Profile />}/>
            {user.balls > 149 && <Route path="/my-tests" element={<MyTests />}/>}
            <Route path="/my-achive" element={<MyAchive />}/>
            <Route path="/my-statistics" element={<Mystatistics />}/>
            <Route path="/motivation" element={<Motivation />}/>
            <Route path="/happy-world" element={<HappyWorld />}/>
            <Route path="*" element={<NotFound />}/> 
          </Routes>
          <Footer />
        </BrowserRouter>
      ) : (
        <NewApp />
      )}
    </Suspense >
  )
}

export default App