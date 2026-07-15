import { FaUser, FaSchool, FaMedal, FaUsers, FaCalendarAlt, FaCrown, FaShieldAlt, FaRocket, FaUserAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { axios } from "../api";
import { useParams } from "react-router-dom";
import { hideLoad, showLoad } from "../reducers/load";

export default function GetOneUser() {
    const {id} = useParams()
    const [user, setUser] = useState(null)
    const dispatch = useDispatch()

    const getOneUser = async () => {
      dispatch(showLoad())
        try {
            const response = await axios.get(`/api/user/get-one/${id}`)
            if(response.data.ok){
                setUser(response.data.data)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
        dispatch(hideLoad())
    }
        
    const getUserIcon = (balls) => {
        if (balls >= 150) {
        return <FaCrown className="text-yellow-400 md:text-7xl text-5xl p-1 md:mb-3 rounded-full border" />;
        } else if (balls >= 100) {
        return <FaShieldAlt className="text-teal-600 md:text-7xl text-5xl p-1 md:mb-3 rounded-full border" />;
        } else if (balls >= 50) {
        return <FaRocket className="text-green-500 md:text-7xl text-5xl p-1 md:mb-3 rounded-full border" />;
        } else {
        return <FaUserAlt className="md:text-7xl text-5xl p-1 md:mb-3 rounded-full border" />;
        }
    };

    useEffect(() => {
        getOneUser()
    }, [])

  return (
    <div className="flex justify-center items-center mt-16 min-h-screen bg-teal-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        <div className="flex flex-col items-center text-center mb-6">
          {getUserIcon(user?.balls)}
          <h2 className="text-2xl font-bold text-teal-700">{user?.username} {user?.surname}</h2>
          <p className="text-sm text-gray-500 mb-2">{user?.bio}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FaMedal className="text-teal-400 text-xl" />
            <span className="text-gray-700 font-semibold">Ballar:</span>
            <span className="text-gray-900">{user?.balls}</span>
          </div>

        <div className="flex items-center gap-3">
            <FaUser className="text-teal-400 text-xl" />
            <span className="text-gray-700 font-semibold">Sinfi:</span>
            <span className="text-gray-900">{user?.userClassNumber}-{user?.userClassName} sinf</span>
        </div>
          

          {user?.userTeam && (
            <div className="flex items-start gap-3">
              <FaUsers className="text-teal-400 text-xl mt-1" />
              <div>
                <p className="font-semibold text-gray-700"><span className="text-teal-700">{user?.userTeam?.title}</span> jamoasi a'zosi!</p>
                <p className="text-gray-500 text-sm">{user?.userTeam?.description}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <FaSchool className="text-teal-400 text-xl" />
            <span className="text-gray-700 font-semibold">So'nggi Testlar:</span>
          </div>
          {user?.lastTests && user?.lastTests?.length > 0 ?  user?.lastTests?.map((test) => (
            <div className="flex flex-col gap-2" key={test?._id}>
              <div className="text-gray-600 border p-1 rounded-sm border-teal-500 text-sm">
                <p><strong>Fan:</strong> {test?.testType}</p>
                <p className="flex items-center gap-1 mt-1">
                  <FaCalendarAlt className="text-teal-400" />
                  <span>{moment(test?.createdAt).format("DD-MMMM YYYY (HH:MM)")}</span>
                </p>
              </div>
            </div>
          )) : <p>Hali bironta ham test ishlanmagan!</p>}
        </div>
      </div>
    </div>
  );
}
