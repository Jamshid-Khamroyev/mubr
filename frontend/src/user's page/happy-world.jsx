import { useEffect, useState } from "react";
import { FaLightbulb, FaGlobe, FaBrain, FaArrowRight } from "react-icons/fa";
import { facts } from '../components/helpers'

export default function HappyWorld() {
  const [fact, setFact] = useState("");
  const [get, setGet] = useState("")

  useEffect(() => {
      const randomQuote = facts[Math.floor(Math.random() * facts.length)];
      setFact(randomQuote);
  }, [get]);

  return (
    <div className="flex mt-16 flex-col gap-4 justify-center items-center h-[80vh] bg-gradient-to-r from-blue-100 to-teal-100 p-6">
      <h2 className="Itim md:text-4xl text-2xl text-teal-900 font-bold">Qiziqarli Dunyo!</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          <div key={fact} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition group">
            <div className="flex items-center gap-4 mb-4">
              <FaLightbulb className="text-yellow-400 text-3xl group-hover:rotate-12 transition" />
              <h3 className="text-lg font-bold text-teal-700">Qiziqarli Fakt</h3>
            </div>
            <p className="text-gray-600">{fact}</p>
            <button onClick={() => setGet(fact)} className="py-1.5 px-4 border w-full my-2 group rounded-sm border-teal-400 text-teal-600 hover:bg-teal-600 hover:text-white cursor-pointer duration-300 flex items-center justify-center gap-2">
              <p>Keyingisi</p> 
              <FaArrowRight className="group-hover:translate-x-4 duration-300"/></button>
          </div>
      </div>
    </div>
  );
}
