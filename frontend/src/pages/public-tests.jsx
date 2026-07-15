import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { axios } from "../api";

const PublicTests = () => {
  const [id, setId] = useState(0)

  const getAllTests = async () => {
    try {
      const response = await axios.get(`/api/public/test/get-all`)
      if(response.data.ok){
        setId(response.data.data.length)
        localStorage.setItem("publicTest", JSON.stringify(response.data.data))
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  useEffect(() => {
    getAllTests()
  }, [])

  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-teal-700 p-4">
      <div className="max-w-md w-full text-center shadow-xl p-8 rounded-2xl border border-teal-200 bg-white">
        <h1 className="text-3xl font-bold mb-4">Ommaviy Testga Xush Kelibsiz!</h1>
        <p className="text-base mb-6 text-teal-600">
          Bilimingizni sinab ko‘ring va natijangizni boshqalar bilan solishtiring.
        </p>
        <button disabled={localStorage.getItem("publicTests")} onClick={() => navigate(`/public-test/${id}`)} className="bg-teal-600 cursor-pointer active:bg-teal-900 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-2xl flex items-center justify-center mx-auto gap-2 transition-all duration-300">
          <FaPlay className="text-white" />
          Boshlash
        </button>
      </div>
    </div>
  )
}

export default PublicTests