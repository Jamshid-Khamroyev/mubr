const complaintModel = require("../models/complaint-model")
const siteModel = require("../models/site-model")

class ComplaintController {
    async Add(req, res) {
        try {
            const { user, site } = req;
            const { id } = req.params;
            const { data } = req.body;
    
            const getSite = await siteModel.findById(site);
            if (!getSite) {
                return res.status(404).json({ ok: false, message: "Hups! Biz izlayotgan maktabni topa olmadik." });
            }
    
            if (!data) {
                return res.status(400).json({ ok: false, message: "Hech narsa yozilmagan. Iltimos, fikringizni qoldiring!" });
            }
    
            const complaint = await complaintModel.create({ description: data, sender: user, test: id });
            if (!complaint) {
                return res.status(400).json({ ok: false, message: "Shikoyatni qabul qilishda muammo yuz berdi. Qayta urinib ko‘ring." });
            }
    
            getSite.complaints.push(complaint._id);
            await getSite.save();
    
            res.status(200).json({
                ok: true,
                message: "Shikoyatingiz qabul qilindi! Buni ko‘rib chiqamiz, xabaringizni kuting."
            });
        } catch (error) {
            res.status(500).json({ ok: false, message: `Xatolik yuz berdi: ${error.message}. Iltimos, keyinroq qayta urinib ko‘ring.` });
        }
    }

    async Delete(req, res) {
        try {
            const { site, user } = req;
            const complaintId = req.params.complaint;
    
            const complaint = await complaintModel.findById(complaintId);
            if (!complaint) {
                return res.status(404).json({ ok: false, message: "Shikoyat topilmadi. Ehtimol, u allaqachon o‘chirildi?" });
            }
    
            const getSite = await siteModel.findById(site);
            if (!getSite) {
                return res.status(404).json({ ok: false, message: "Kutilgan maktabni topa olmadik. Iltimos, qaytadan tekshirib ko‘ring." });
            }
    
            if (complaint.sender.toString() !== user) {
                return res.status(403).json({ ok: false, message: "Bu shikoyatni faqat uning egasi o‘chirishi mumkin. O‘zingizni xursand qilmang!" });
            }
    
            const complaintDel = await complaintModel.findByIdAndDelete(complaintId);
            if (!complaintDel) {
                return res.status(404).json({ ok: false, message: "Shikoyatni o‘chirishda muammo yuz berdi. Qaytadan urinib ko‘ring." });
            }
    
            getSite.complaints = getSite.complaints.filter(c => c._id != complaint._id);
            await getSite.save();
    
            res.status(200).json({
                ok: true,
                message: "Shikoyatingiz muvaffaqiyatli o‘chirildi! Yangi boshlanishlar kutyapti.",
                data: complaintDel
            });
        } catch (error) {
            res.status(500).json({ ok: false, message: `Xatolik yuz berdi: ${error.message}. Iltimos, keyinroq qayta urinib ko‘ring.` });
        }
    }

    async GetAll(req, res) {
        try {
            const { site } = req;
    
            const getSite = await siteModel.findById(site).populate({
                path: "complaints",
                populate: [
                    {
                        path: "sender",
                        select: "username surname balls sertificate bio createdAt userTeam userEmail"
                    },
                    {
                        path: "test",
                        select: "image _id title forClass testType"
                    }
                ]
            });
    
            if (!getSite) {
                return res.status(404).json({ ok: false, message: "Maktabni topa olmadik. Iltimos, qaytadan tekshirib ko‘ring." });
            }
    
            if (getSite.complaints.length === 0) {
                return res.status(200).json({ ok: true, message: "Shikoyatlar hozircha mavjud emas. Barchani ko‘rish uchun yangi shikoyatlar yuborilishi kerak!" });
            }
    
            res.status(200).json({
                ok: true,
                message: "Barcha shikoyatlarni muvaffaqiyatli ko‘rish mumkin!",
                data: getSite.complaints
            });
        } catch (error) {
            res.status(500).json({ ok: false, message: `Xatolik yuz berdi: ${error.message}. Iltimos, keyinroq qayta urinib ko‘ring.` });
        }
    }
}

module.exports = new ComplaintController()