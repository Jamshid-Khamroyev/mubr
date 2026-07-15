import { useState } from "react";
import { FaPaperPlane, FaInfoCircle } from "react-icons/fa"; // Ikonalar uchun import
import { toast } from "react-toastify";
import { axios1 } from '../api/api';

const Helps = () => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message) {
      toast.error("Iltimos, xabarni kiriting!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios1.post("/api/helps", {
        message,
      });

      if (response.data.ok) {
        toast.success("Xabar muvaffaqiyatli yuborildi!");
        setMessage(""); // Formani tozalash
      } else {
        toast.error("Xatolik yuz berdi, iltimos qaytadan urinib ko'ring.");
      }
    } catch (error) {
      toast.error(error.response ? error.response.data.message : "Xatolik yuz berdi");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="w-full mx-auto p-6 bg-slate-800 rounded-sm shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Dispacher bilan bog'lanish</h2>
        <p className="text-sm text-white">
          Agar sizda kichik muammolar bo'lsa, iltimos, bizga yubormang. Biz faqat katta muammolarni hal qilishda yordam bera olishimiz mumkin. Iltimos, muammongizni aniq bayon qiling, biz sizga tezda yordam beramiz.
        </p>
      </div>

      <div className="mb-6 p-4 bg-slate-900 rounded-sm shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <FaInfoCircle className="text-teal-500 text-xl" />
          <h4 className="font-semibold text-teal-500">Dispacher bilan bog'lanish shartlari:</h4>
        </div>
        <ul className="list-disc pl-5 text-smtext-gray-300">
          <li>Faoliyatni to'liq va aniq bayon qilish kerak.</li>
          <li>Yuqori darajadagi muammolarni hal qilishda yordam bera olamiz.</li>
          <li>Kichik savollar yoki texnik yordam uchun boshqa kanallarni ishlating.</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <input
          type="text"
          className="w-full p-3 bg-gray-100 text-slate-800 outline-none border-4 border-transparent focus:border-teal-600 rounded-md"
          placeholder="Muammongizni bayon qiling"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-teal-500 text-white p-3 rounded-md hover:bg-teal-600 transition-colors flex items-center gap-2"
          disabled={isSubmitting}
        >
          <FaPaperPlane className="text-lg" />
          {isSubmitting ? "Yuborilmoqda..." : "Yuborish"}
        </button>
      </form>
    </div>
  );
};

export default Helps;
