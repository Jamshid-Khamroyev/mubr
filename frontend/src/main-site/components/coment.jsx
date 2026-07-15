import { motion } from "framer-motion";
import {
  FaTrophy,
  FaChartBar,
  FaSchool,
  FaStar,
  FaLaptopCode,
  FaBolt,
  FaQuestionCircle,
  FaUserAlt,
  FaHandPointRight,
  FaSignInAlt,
  FaStar as FaStarIcon, // Sharxlar uchun yulduz
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Platforma afzalliklari
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

// FAQ bo'limi
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

// Sharxlar (Reviews)
const reviews = [
  {
    user: "Shahzod T.",
    comment: "Platforma juda foydali, tezda ro‘yxatdan o‘tib, testlarni o‘zim uchun baholash imkoniyatiga ega bo‘ldim.",
    rating: 5,
  },
  {
    user: "Nodira Q.",
    comment: "Maktabga biriktirish xususiyati juda yaxshi. O‘quvchilarni kuzatish va ularning rivojlanishini ko‘rish qulay.",
    rating: 4,
  },
  {
    user: "Azizbek N.",
    comment: "Yuqori reytingga ega testlar bilan o‘zimni sinab ko‘rdim, juda foydali bo‘ldi.",
    rating: 5,
  },
];

// Carousel
const carouselItems = [
  "platforma foydalanuvchilari uchun o‘quv dasturlari",
  "eng mashhur testlar",
  "barcha qurilmalarda ishlash",
  "statistik tahlil imkoniyatlari",
  "reyting tizimi",
];

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const Coment = () => {
  const navigate = useNavigate()
  return (
    <section className="w-full py-5 px-4 max-md:pt-32 min-h-screen pt-24 bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
      {/* Sharxlar (Reviews) */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Foydalanuvchi sharxlari</h2>
        <div className="space-y-6">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={i}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg flex gap-4 items-center"
            >
              <FaUserAlt size={40} className="text-indigo-300" />
              <div className="flex flex-col">
                <h3 className="font-semibold">{review.user}</h3>
                <p className="text-sm opacity-90">{review.comment}</p>
                <div className="flex gap-1 mt-2">
                  {Array.from({ length: review.rating }, (_, i) => (
                    <FaStarIcon key={i} size={16} className="text-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Coment;
