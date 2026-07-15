const eduCenterModel = require("../models/local-center-model")
const path = require("path")
const fs = require("fs")

class EduCenterController {
    async Create(req, res){
        try {
            const images = req.files.map(image => image.filename)
            const data = req.body
            if(!data || !images){
                return res.status(400).json({ok: false, message: "Ma'lumotlar to'liq emas!"})
            }

            const fullData = {...data, images}
            const eduCenter = await eduCenterModel.create(fullData)
            if(!eduCenter){
                return res.status(400).json({ok: false, message: "O'quv Markazi qo'shilmadi!"})
            }

            res.json({ok: true, message: "Yangi Markaz qo'shildi!", data: eduCenter})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async Delete(req, res){
        try {
            const eduId = req.params.edu

            const edu = await eduCenterModel.findByIdAndDelete(eduId)
            if(!edu){
                return res.status(400).json({ok: false, message: "Markaz o'chirilmadi! Qayta urinib ko'ring!"})
            }

            edu.images.forEach((filename) => {
                const filePath = path.join(__dirname, "..", "local-centers-images", filename);
                fs.access(filePath, fs.constants.F_OK, (err) => {
                  if (!err) {
                    fs.unlink(filePath, (err) => {
                      if (err) {
                        console.error(`❌ ${filename} faylini o‘chirishda xatolik:`, err.message);
                      } else {
                        console.log(`🗑️ ${filename} muvaffaqiyatli o‘chirildi`);
                      }
                    });
                  } else {
                    console.warn(`⚠️ ${filename} topilmadi`);
                  }
                });
              });
            res.json({ok: true, message: "Center o'chirilib tashlandi!"})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async Update(req, res){
        try {
            const eduId = req.params.edu
            const data = req.body

            const edu = await eduCenterModel.findByIdAndUpdate(eduId, data, { new: true })
            if(!edu){
                return res.status(400).json({ok: false, message: "Markaz yagilanmadi!"})
            }

            res.json({ok: true, message: "Ma'lumotlar yangilandi!", data: edu})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }


    async GetAll(req, res){
        try {
            const { num } = req.params

            const eduCenters = (await eduCenterModel.find()).reverse().slice(0, Number(num)) 
            if(!eduCenters){
                return res.status(400).json({ok: false, message: "Ma'lumotlarni olishda xatolik bo'ldi!"})
            }

            res.json({ok: true, message: "Barcha ma'lumotlar olindi!", data: eduCenters})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async GetOne(req, res){
        try {
            const eduId = req.params.edu

            const edu = await eduCenterModel.findById(eduId)
            if(!eduId){
                return res.status(400).json({ok: false, message: "Ma'lumotlar aniqlanmadi!"})
            }

            res.json({ok: true, message: "Ma'lumotlar olindi!", data: edu})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }
}

module.exports = new EduCenterController()