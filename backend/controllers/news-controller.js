const newsModel = require("../models/news-model")
const fs = require("fs")
const path = require("path")

class NewsController {
    async Create(req, res){
        try {
            const image = req.file.filename
            if(!image){
                return res.status(400).json({ok: false, message: "Rasm yuklanmadi!"})
            }

            const data = req.body
            if(!data){
                return res.status(400).json({ok: false, message: "Ma'lumotlar yuklanmadi!"})
            }
            data.image = image
            const New = await newsModel.create(data)
            if(!New){
                return res.status(400).json({ok: false, message: "Ma'lumot qo'shilmadi!"})
            }

            res.json({ok: true, message: "Ma'lumot qo'shildi!", data: New})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async Update(req, res) {
        try {
            const data = req.body;
            const image = req.file?.filename;
            const newId = req.params.new;
    
            const existing = await newsModel.findById(newId);
            if (!existing) {
                return res.status(404).json({ ok: false, message: "Yangilik topilmadi!" });
            }
    
            if (image && existing.image) {
                const filePath = path.join(__dirname, '../news-images', existing.image);
                fs.unlink(filePath, (fsErr) => {
                    if (fsErr) console.error('Faylni o‘chirishda xato:', fsErr);
                });
            }
    
            if (image) {
                data.image = image;
            }
    
            const updated = await newsModel.findByIdAndUpdate(newId, data, { new: true });
    
            res.json({ ok: true, message: "Ma'lumot yangilandi!", data: updated });
    
        } catch (error) {
            console.error("Yangilashda xatolik:", error);
            res.status(500).json({ ok: false, message: error.message });
        }
    }
    
    async Delete(req, res){
        try {
            const newId = req.params.new

            const New = await newsModel.findByIdAndDelete(newId, { new: true })
            if(!New){
                return res.status(400).json({ok: false, message: "Ma'lumotlar o'chirilmadi!"})
            }

            if(New.image){
                const filePath = path.join(__dirname, '../news-images', New.image);
                fs.unlink(filePath, (fsErr) => {
                    if (fsErr) console.error('Multer xatosidan keyin faylni o‘chirishda xato:', fsErr);
                });
            }

            res.json({ok: true, message: "Ma'lumotlar ochirildi!", data: New})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async GetOne(req, res){
        try {
            const newId = req.params.new

            const New = await newsModel.findById(newId)
            if(!New){
                return res.status(400).json({ok: false, message: "Ma'lumot kelmadi!"})
            }

            res.status(200).json({ok: true, message: "Ma'lumotlar keldi!", data: New})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async GetAll(req, res){
        try {
            const {num} = req.params
            const news = (await newsModel.find()).reverse().slice(0, num)
            res.status(200).json({ok: true, message: "Ma'lumotlar olindi!", data: news})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }
}

module.exports = new NewsController()