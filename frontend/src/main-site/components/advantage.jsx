import axios from "axios";
import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  FaTrophy,
  FaChartBar,
  FaSchool,
  FaStar,
  FaLaptopCode,
  FaBolt,
  FaQuestionCircle, // FAQ ikonkasi uchun qo'shildi
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <FaTrophy size={28} className="text-indigo-300" />,
    title: "Reyting tizimi",
    desc: "Raqobatni kuchaytiruvchi reytinglar har bir testdan so‘ng yangilanadi.",
  },
  {
    icon: <FaChartBar size={28} className="text-purple-300" />,
    title: "Statistik tahlil",
    desc: "Yutuq va qiyin tomonlaringizni ko‘rsatib, o‘sishga yordam beradi.",
  },
  {
    icon: <FaSchool size={28} className="text-yellow-300" />,
    title: "Maktabga biriktirish",
    desc: "Har bir o‘quvchi o‘z maktab sahifasi orqali test ishlaydi.",
  },
  {
    icon: <FaStar size={28} className="text-pink-300" />,
    title: "Top testlar",
    desc: "Eng mashhur testlar orasidan sinovdan o‘ting va ball oling.",
  },
  {
    icon: <FaLaptopCode size={28} className="text-green-300" />,
    title: "Mobil va web versiya",
    desc: "Barcha qurilmalarda to‘liq ishlaydi — telefon, planshet va kompyuter.",
  },
  {
    icon: <FaBolt size={28} className="text-orange-300" />,
    title: "Tez va oson kirish",
    desc: "Login — Google yoki oddiy email orqali bir necha soniyada amalga oshiriladi.",
  },
];

const faq = [
  {
    question: "Qanday qilib ro‘yxatdan o‘tish mumkin?",
    answer: "Ro‘yxatdan o‘tish uchun email yoki Google hisobingizdan foydalanishingiz mumkin.",
  },
  {
    question: "Testlarni qanday qilib baholash mumkin?",
    answer: "Testni tugatgandan so‘ng, natijalar avtomatik ravishda reyting tizimiga qo‘shiladi.",
  },
  {
    question: "Testlarni qanday qilib tanlash mumkin?",
    answer: "Platformada mavjud testlar orasidan eng mashhur va yuqori reytingga ega bo‘lgan testlarni tanlashingiz mumkin.",
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const FeaturesSection = () => {
  const navigate = useNavigate()

  const getTeam = async() => {
    const res = await axios.get(`http://localhost:4000/api/team/get-all`, { withCredentials: true })
    console.log(res);
  }

  useEffect(() => {
    getTeam()
  }, [])
  return (
    <section className="w-full min-h-screen mb-12 pt-24 max-md:pt-32 px-4 bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Platforma afzalliklari</h2>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {features.map((item, i) => (
            <motion.div
              key={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={i}
              className="bg-white/10 backdrop-blur-md rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col gap-2"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </div>
              <p className="text-sm opacity-90 mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-6xl mx-auto mt-14">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Tez-tez so‘raladigan savollar</h2>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 shadow-lg">
          <ul className="space-y-6">
            {faq.map((item, i) => (
              <li key={i} className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <FaQuestionCircle size={28} className="text-blue-300" />
                  <h3 className="text-lg font-semibold">{item.question}</h3>
                </div>
                <p className="text-sm opacity-90 mt-1">{item.answer}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
