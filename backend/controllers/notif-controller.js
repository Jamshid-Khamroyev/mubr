const notfiModel = require("../models/notification-model")

class NewsController {
    async Create(req, res){
        try {
            const data = req.body
            if(!data){
                return res.status(400).json({ok: false, message: "Bildirishnomalar qo'shilmadi!"})
            }

            const notif = await notfiModel.create({description: data.description, owner: data?._id})
            if(!notif){
                return res.status(400).json({ok: false, message: "Bildirishnomalar qo'shilmadi!"})
            }

            res.json({ok: true, message: "Bildirishnoma qo'shildi!", data: notif})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async Delete(req, res){
        try {
            const notifId = req.params.id

            const Notif = await notfiModel.findByIdAndDelete(notifId, { new: true })
            if(!Notif){
                return res.status(400).json({ok: false, message: "Ma'lumotlar o'chirilmadi!"})
            }
            res.json({ok: true, message: "Ma'lumotlar ochirildi!", data: Notif})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async GetAll(req, res) {
        try {
            const { user } = req;
            const notifs = (await notfiModel.find().populate("owner", "username surname _id")).reverse();
            const data = notifs.filter(notif => 
                (notif.owner && notif.owner._id.toString() === user) || !notif.owner
            );
            res.status(200).json({ok: true, message: "Ma'lumotlar olindi!", data});
        } catch (error) {
            res.status(400).json({ok: false, message: error.message});
        }
    }
    
}

module.exports = new NewsController()