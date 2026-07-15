import { useEffect, useState } from "react";
import { axios1 } from '../api/api'; // Agar kerak bo'lsa, axios import qiling
import { toast } from "react-toastify";
import { showLoad, hideLoad } from '../reducers/load'
import { useDispatch } from "react-redux";
import { FaUserAlt, FaFileAlt, FaCertificate, FaStar } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { MdAccessTime } from "react-icons/md";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const dispatch = useDispatch()

  const getComplaints = async () => {
    dispatch(showLoad())
    try {
      const response = await axios1.get("/api/complaint/get-all"); 
      if (response.data.ok) {
        setComplaints(response.data.data); 
      }
    } catch (error) {
      toast.error(error.response ? error.response.data.message : "Xatolik yuz berdi");
    }
    dispatch(hideLoad())
  };

  useEffect(() => {
    getComplaints(); 
  }, []);

  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-2 items-start lg:grid-cols-3 gap-6 mt-6">
      {complaints?.length === 0 ? (
        <p className="text-center text-lg text-gray-500">Shikoyatlar mavjud emas</p>
      ) : (
        complaints?.map((complaint) => (
          <div
              key={complaint._id}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex flex-col"
            >
              <div className="flex items-center gap-4">
                <FaUserAlt className="text-blue-500 text-3xl" />
                <div>
                  <h4 className="text-white text-sm font-semibold">
                    {complaint.sender.username} {complaint.sender.surname}
                  </h4>
                  <p className="text-xs text-white flex items-center gap-1">
                    <HiMail className="text-sm" />
                    {complaint.sender.userEmail}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-white">{complaint.description}</p>

              <div className="mt-4 space-y-1 text-xs text-white">
                <p className="flex items-center gap-2">
                  <MdAccessTime />
                  Kelib chiqqan vaqt: {new Date(complaint.createdAt).toLocaleString()}
                </p>
                <p className="flex items-center gap-2">
                  <FaFileAlt />
                  Test turi: <span className="font-semibold">{complaint.test.testType}</span> ({complaint.test.forClass}-sinf)
                </p>
                <p className="flex items-center gap-2">
                  <FaStar />
                  Ballar: <span className="font-semibold">{complaint.sender.balls}</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaCertificate />
                  Sertifikatlar soni: {complaint.sender.sertificate}
                </p>
              </div>
            </div>
        ))
      )}
    </div>
  );
};

export default Complaints;
