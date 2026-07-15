const factModel = require("../models/fact-model")

class FactController {
    async Create(req, res){
        try {
            const data = req.body
            if(!data){
                return res.status(400).json({ok: false, message: "Ma'lumotlar kelmadi!"})
            }

            const fact = await factModel.create(data)
            if(!fact){
                return res.status(400).json({ok: false, message: "Sizning ma'lumotlaringiz saqlanmadi!"})
            }

            res.json({ok: true, message: "Barcha ma'lumotlaringiz qo'shildi!", data: fact})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async Delete(req, res){
        try {
            const factId = req.params.fact

            const fact = await factModel.findByIdAndDelete(factId) 
            if(!fact){
                return res.status(400).json({ok: false, message: "Factni o'chirishda xatolik yuzaga keldi!"})
            }

            res.json({ok: true, message: "Fact o'chirib tashlandi!"})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async Update(req, res){
        try {
            const factId = req.params.fact

            const data = req.body
            if(!data){
                return res.status(400).json({ok: false, message: "Ma'lumotlarni olishda xatolik yuzaga keldi!"})
            }
        
            const fact = await factModel.findByIdAndUpdate(factId, data, { new: true }) 
            if(!fact){
                return res.status(400).json({ok: false, message: "fact yangilashda xatolik bo'ldi. Qayta urinib ko'ring!"})
            }

            res.json({ok: true, message: "Fact yangilandi!", data: fact})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async GetOne(req, res){
        try {
            const factId = req.params.fact

            const fact = await factModel.findById(factId)  
            if(!fact){
                return res.status(400).json({ok: false, message: "Siz so'ragan fact topilmadi!"})
            }

            res.json({ok: true, message: "Barcha factlar olindi!", data: fact})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async GetAll(req, res){
        try {
            const { num } = req.params
            const facts = (await factModel.find()).reverse().slice(0, num)   
            res.json({ok: false, message: "Barcha factlar olindi!", data: facts})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }
}

module.exports = new FactController()