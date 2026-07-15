import React, { useEffect, useState } from "react";
import { axios } from "../api";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoad, hideLoad } from "../reducers/load";
import { toast } from "sonner";
import image67 from ".././assets/6-7.png"
import image89 from ".././assets/8-9.png"
import image1011 from ".././assets/10-11.png"
import image10112 from ".././assets/10-11-taabiiy.png"

import {
  FaRegCalendarAlt,
  FaPlayCircle,
  FaFileAlt,
  FaListAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Tests = () => {
  const navigate = useNavigate()
  const [tests, setTests] = useState([]);
  const dispatch = useDispatch();

  const getAllTests = async () => {
    dispatch(showLoad());
    try {
      const response = await axios.get("/api/test/get-all");
      if (response.data.ok) {
        setTests(response.data.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    dispatch(hideLoad());
  };

  const getImage = (num, type = "") => {
    if(num == "6-7"){
      return image67
    }else if(num == "8-9"){
      return image89
    }else if(num == "10-11" && type == "Aniq"){
      return image1011
    }else {
      return image10112
    }
  }

  useEffect(() => {
    getAllTests();
  }, []);

  return (
    <div className="w-full py-20 bg-teal-50 text-teal-900">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-teal-800 drop-shadow">
          Mavjud testlar ro‘yxati
        </h2>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
          {tests?.length ? tests?.map((test) => (
            <div
              key={test._id}
              className="bg-white rounded-sm overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
               <img
                src={getImage(test.forClass, test.testType)}
                alt={"test.title"}
                className="w-full h-44 my-3 object-fill"
              />
              <div className="space-y-3 p-2">
                <h3 className="text-xl font-bold text-teal-800 flex items-center gap-2">
                  <FaFileAlt /> Bilimingizni sinang!
                </h3>
                <div className="flex justify-between">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-teal-600 flex items-center gap-2">
                      <FaRegCalendarAlt />
                      {moment(test?.createdAt).format("DD MMMM, YYYY")}
                    </p>
                    <p className="text-sm text-teal-600 flex items-center gap-2">
                      <FaListAlt />
                      {test?.forClass}-sinflar uchun
                    </p>
                  </div>
                  <button
                    className="flex items-center cursor-pointer gap-2 mt-4 bg-teal-100 text-teal-700 px-4 py-2 rounded-md hover:bg-teal-200 text-sm transition"
                    onClick={() => navigate(`/test/${test._id}`)}
                  >
                    <FaPlayCircle className="text-lg" /> Bajarish
                  </button>
                </div>
              </div>
            </div>
          )) : <p className="text-center">Hozirda yangi topshiriqlar mavjud emas!</p>}
        </div>
      </div>
    </div>
  );
};

export default Tests;
