import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaEye,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import moment from 'moment'
import { toast } from "sonner"
import { axios } from "../api/index";
import { useDispatch, useSelector } from "react-redux";
import { showLoad, hideLoad } from '../reducers/load'
import { LoginUser } from "../reducers/user";
import { FaShieldAlt, FaUserAlt, FaCrown, FaRocket } from "react-icons/fa";
import Modal from '../additional-pages/team-modal'
import LazyLoad from '../components/lazyImage'
import { useNavigate } from "react-router-dom";


const Teams = () => {
  const [teams, setTeams] = useState([])
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch()
  const { link } = useSelector(state => state.load) 
  const { user } = useSelector(state => state.user) 
  const navigate = useNavigate()

  const getUserIcon = (balls) => {
    if (balls >= 150) {
      return <FaCrown className="text-yellow-400 text-4xl p-1 rounded-full border" />;
    } else if (balls >= 100) {
      return <FaShieldAlt className="text-teal-600 text-4xl p-1 rounded-full border" />;
    } else if (balls >= 50) {
      return <FaRocket className="text-green-500 text-4xl p-1 rounded-full border" />;
    } else {
      return <FaUserAlt className="text-gray-400 text-4xl p-1 rounded-full border" />;
    }
  };

  const getAllTeams = async () => {
    dispatch(showLoad())
    try {
        const response = await axios.get(`/api/team/get-all`)
        if(response.data.ok){
          dispatch(hideLoad())
          return setTeams(response.data.data)
        }
    } catch (error) {
        toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  }

  const handleJoin = async(id) => {
    dispatch(showLoad())
    try {
      const response = await axios.put(`/api/user/join/${id}`)
      if(response.data.ok){
        dispatch(LoginUser({...user, userTeam: id}))
        getAllTeams()
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  }

  const handleUnjoin = async(id) => {
    dispatch(showLoad())
    try {
      const response = await axios.put(`/api/user/unjoin/${id}`)
      if(response.data.ok){
        dispatch(LoginUser({...user, userTeam: ''}))
        getAllTeams()
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  }

  const handleView = (team) => {
    setSelected(team);
    setModalOpen(true);
  };

  useEffect(() => {
    getAllTeams()
  }, [])
  return (
    <div className="w-full py-20 bg-teal-50 text-teal-900">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-teal-800 drop-shadow">
          {user?.siteId?.title}ning jamoalar ro'yxati
        </h2>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
          {teams.map((jamoa) => (
            <div
              key={jamoa._id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <LazyLoad src={`${link}/api/team-images/${jamoa.image}`} height="h-48"/>
              <div className="p-5 space-y-3">
                <h3 className="text-xl font-bold text-teal-800">{jamoa.title}</h3>
                <div className="flex items-center w-full justify-between gap-2 text-sm text-teal-600">
                  <div className="flex items-center justify-center gap-2">
                    <FaUsers /> A’zolar: {jamoa.users.length}
                  </div>
                  <p className="opacity-100 capitalize">Yaratilingan kun: <span className="text-gray-600">{moment(jamoa.createdAt).format("DD-MMMM")}</span></p>
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {user?.userTeam?._id === jamoa?._id ? (
                    <button
                      onClick={() => handleUnjoin(jamoa._id)}
                      className="flex items-center gap-2 cursor-pointer bg-red-100 text-red-700 px-4 py-1.5 rounded-sm hover:bg-red-200 text-sm transition"
                    >
                      <FaSignOutAlt /> Unjoin
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoin(jamoa._id)}
                      className="flex items-center gap-2 cursor-pointer bg-teal-100 text-teal-700 px-4 py-1.5 rounded-sm hover:bg-teal-200 text-sm transition"
                    >
                      <FaSignInAlt /> Join
                    </button>
                  )}
                  <button
                    onClick={() => handleView(jamoa)}
                    className="flex items-center gap-2 cursor-pointer bg-blue-100 text-blue-700 px-4 py-1.5 rounded-sm hover:bg-blue-200 text-sm transition"
                  >
                    <FaEye /> Ko‘rish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <h2 className="text-xl font-bold text-teal-800 mb-1">{selected?.title}</h2>
            <p className="mb-5">{selected.description}</p>
            <div className="flex items-center justify-between mt-5">
                <p className="text-sm text-gray-600">A’zolar soni: {selected?.users.length}</p>
              <p><span className="text-gray-900 mr-1">Jamoa sardori:</span> {selected.capitan}</p>
            </div>
            <div>
              <h2 className="text-center my-2 text-xl font-semibold">Jamoa a'zolari</h2>
                {selected?.users?.length > 0 && selected?.users?.map(currentUser => (
                  <div key={currentUser?._id} onClick={() => navigate(`/user/${currentUser._id}`)} className="p-3 cursor-pointer rounded-sm border border-teal-700 my-2 flex justify-between items-center">
                    <div className="text-center">
                      <div>
                        {getUserIcon(currentUser.balls)}
                      </div>
                      <p>{currentUser?.username}</p>
                    </div>

                    <div className="text-center">
                      <p>{currentUser?.userClassNumber}-{currentUser?.userClassName} o'quvchisi</p>
                      <p>{currentUser?.balls} ball</p>
                    </div>

                    <div className="text-center">
                      <p>{moment(currentUser?.createdAt).format("DD-MMMM")}</p>
                    </div>
                  </div>
                ))}
                <p className="text-sm w-full flex items-center justify-between text-gray-700 my-2">
                  <div>
                    Yaratilgan sana: {moment(selected?.createdAt).format("DD MMMM, YYYY")}
                  </div>
                    {user?.userTeam?._id == selected._id ? (
                        <button
                          onClick={() => handleUnjoin(selected._id)}
                          className="flex items-center gap-2 cursor-pointer bg-red-100 text-red-700 px-4 py-1.5 rounded-sm hover:bg-red-200 text-sm transition"
                        >
                          <FaSignOutAlt /> Unjoin
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoin(selected._id)}
                          className="flex items-center gap-2 cursor-pointer bg-teal-100 text-teal-700 px-4 py-1.5 rounded-sm hover:bg-teal-200 text-sm transition"
                        >
                          <FaSignInAlt /> Join
                        </button>
                      )}
                </p>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Teams;
