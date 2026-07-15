import { useEffect, useState } from "react";
import { FaBell, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { axios } from "../api";
import { hideLoad, showLoad } from "../reducers/load";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);

  const dispatch = useDispatch()

  const getNotif = async () => {
    dispatch(showLoad())
    try {
      const response = await axios.get(`/api/notif/get-all`)
      if(response.data.ok){
        setNotifications(response.data.data)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  }

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n._id === id ? { ...n, read: true } : n)
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n._id !== id));
  };

  useEffect(() => {
    getNotif()
  },[])
  return (
    <div className="flex justify-center items-center min-h-screen bg-teal-50 p-6">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-teal-700 text-center mb-6">Bildirishnomalar</h2>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500">Hozircha bildirishnomalar yo'q.</p>
          ) : (
            notifications.map(notif => (
              <div key={notif._id} className="bg-white rounded-2xl shadow-md p-4 relative group transition hover:shadow-lg">
                <div className="flex items-start gap-3">
                  <FaBell className="text-teal-400 text-2xl mt-1" />
                  <div className="flex-1">
                    <p className="text-gray-500 p-2 text-sm">{notif.description}</p>
                    <p className="text-gray-400 px-2 text-xs mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="absolute top-3 right-3 flex gap-2 md:opacity-0 opacity-100 md:group-hover:opacity-100 transition">
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif._id)}
                      className="text-green-500 hover:text-green-600"
                      title="O'qildi sifatida belgilash"
                    >
                      <FaCheckCircle size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif._id)}
                    className="text-red-400 hover:text-red-500"
                    title="Bildirishnomani o'chirish"
                  >
                    <FaTimesCircle size={20} />
                  </button>
                </div>

                {!notif.read ? (
                  <span className="absolute top-3 left-3 bg-teal-400 text-white text-xs px-2 py-0.5 rounded-full">Yangi</span>
                ) : (
                  <span className="absolute top-3 left-3 bg-gray-300 text-gray-700 text-xs px-2 py-0.5 rounded-full">O'qilgan</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
