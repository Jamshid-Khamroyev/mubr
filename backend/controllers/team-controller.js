const siteModel = require("../models/site-model")
const teamModel = require("../models/team-model")
const fs = require("fs")
const path = require("path")

class TeamController {
    async Create(req, res){
        try {
            const siteId = req.site
            const data = req.body
            const image = req.file.filename
            if(!image){
                const filePath = path.join(__dirname, '../team-images', image);
                fs.unlink(filePath, (fsErr) => {
                    if (fsErr) console.error('Multer xatosidan keyin faylni o‘chirishda xato:', fsErr);
                });
                return res.status(400).json({ok: false, message: "Siz rasm kiritmadingiz!"})
            }

            if(!data){
                const filePath = path.join(__dirname, '../team-images', image);
                fs.unlink(filePath, (fsErr) => {
                    if (fsErr) console.error('Multer xatosidan keyin faylni o‘chirishda xato:', fsErr);
                });
                return res.status(400).json({ok: false, message: "Siz ma'lumot kiritmadingiz!"})
            }

            const site = await siteModel.findById(siteId).populate("teams")
            if(!site){
                const filePath = path.join(__dirname, '../team-images', image);
                fs.unlink(filePath, (fsErr) => {
                    if (fsErr) console.error('Multer xatosidan keyin faylni o‘chirishda xato:', fsErr);
                });
                return res.status(400).json({ok: false, message: "Sizning saytingizni topishda xatolik bo'ldi! Iltimos qaytadan tizimga kirib ko'ring!"})
            }
            
            data.image = image
            const team = await teamModel.create(data)
            if(!team){
                const filePath = path.join(__dirname, '../team-images', image);
                fs.unlink(filePath, (fsErr) => {
                    if (fsErr) console.error('Multer xatosidan keyin faylni o‘chirishda xato:', fsErr);
                });
                return res.status(400).json({ok: false, message: "Jamoa yaratishda xatolik yuz berdi iltimos keyinroq yana bir urinib ko'ring!!"})
            }

            site.teams.push(team._id)
            await site.save()
            res.json({ok: true, message: "Yangi Jamoa qo'shildi!", data: team})
        } catch (error) {
            const filePath = path.join(__dirname, '../team-images', req.file.filename);
            fs.unlink(filePath, (fsErr) => {
                if (fsErr) console.error('Multer xatosidan keyin faylni o‘chirishda xato:', fsErr);
            });
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async Delete(req, res){
        try {
            const siteId = req.site
            const { team } = req.params

            const site = await siteModel.findById(siteId).populate("teams")
            if(!site){
                return res.status(400).json({ok: false, message: "Sizning saytingizni topishda xatolik bo'ldi! Iltimos qaytadan tizimga kirib ko'ring!"})
            }

            const checkTeam = site.teams.find(t => t._id.toString() == team)
            if(!checkTeam){
                return res.status(400).json({ok: false, message: "Bu maktabda ushbu jamoa topilmadi"})
            }

            const Team = await teamModel.findByIdAndDelete(team)
            if(!Team){
                return res.status(400).json({ok: false, message: "Bu maktabda ushbu jamoa topilmadi"})
            }

            
            site.teams = site.teams.filter(t => t._id.toString() != Team._id)
            await site.save()

            const filePath = path.join(__dirname, '../team-images', Team.image);
            fs.unlink(filePath, (fsErr) => {
                if (fsErr) console.error('Multer xatosidan keyin faylni o‘chirishda xato:', fsErr);
            });
            res.json({ok: true, message: "Jamoa o'chirib tashlandi!", data: Team})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async GetAll(req, res){
        try {
            const { site } = req
            const getSite = await siteModel
            .findById(site)
            .populate({
                path: "teams",
                populate: {
                    path: "users",
                    select: "_id username balls surname userClassNumber userClassName bio createdAt"
                }
            });
            if(!getSite){
                return res.status(400).json({ok: false, message: "Ushbu maktab topilmadi!"})
            }   

            res.json({ok: true, message: "Barcha jamoalar olindi", data: getSite.teams})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async GetOne(req, res){
        try {
            const { site } = req
            const id = req.params.team

            const getSite = await siteModel.findById(site).populate("teams")
            if(!getSite){
                return res.status(400).json({ok: false, message: "Ushbu maktab topilmadi!"})
            }

            const team = getSite.teams.find(t => t._id == id)
            if(!team){
                return res.status(400).json({ok: false, message: "Sizning maktabingizda unaqa jamoa yo'q!"})
            }
            res.json({ok: true, message: "Barcha jamoalar olindi", data: team})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }
}

module.exports = new TeamController()