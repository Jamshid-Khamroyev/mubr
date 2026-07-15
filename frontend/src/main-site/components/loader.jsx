import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

const Loader = () => {
  return (
    <div className={`min-h-[100vh] fixed top-0 left-0 w-full z-[432342384982374982798] flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="text-white text-5xl"
      >
        <FaSpinner className="animate-spin" />
      </motion.div>
    </div>
  );
};

export default Loader;
