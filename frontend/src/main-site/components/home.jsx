import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Image from '../assets/home.gif';
import LazyLoad from '../../components/lazyImage'

const HomePage = () => {
  return (
    <section className="md:h-[96vh] max-md:mt-[10vh] min-h-[90vh] relative flex max-md:flex-col max-md:gap-3 items-center justify-between overflow-hidden">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="md:w-1/2 w-full my-auto mx-4 bg-gradient-to-br from-indigo-500 to-purple-500  flex items-center justify-center gap-3 flex-col shadow-md p-5 rounded-sm"
      >
        <h2 className="md:text-3xl text-2xl Itim font-semibold">Bilimingizni Sinang</h2>
        <p className="opacity-80 max-md:text-center">Osondan murakkabgacha testlar, maxsus algoritm asosida.</p>
        <div className="w-full flex justify-center items-center gap-2">
          <Link to={'/login'} className="py-2 px-5 rounded-sm hover:bg-white hover:text-indigo-600 hover:border-white border">Testni boshlash</Link>
          <Link to={'/login'} className="py-2 px-5 rounded-sm hover:bg-white hover:text-indigo-600 hover:border-white border">Top testlar</Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
        className="flex items-center justify-center w-1/2"
      >
        <LazyLoad src={Image}/>
      </motion.div>

    </section>
  );
};

export default HomePage;
