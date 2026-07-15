const userModel = require("../models/user-model")
const publicTestModel = require("../models/public-test-model")
const siteModel = require("../models/site-model")


class PublicTestController {
    async Create(req, res){
        try {
            const { user, site } = req
            const data = req.body
            if(!data){
                return res.status(400).json({ok: false, message: "Siz barcha ma'lumotlarni kiritmadingiz!"})
            }

            const getUser = await userModel.findById(user)             
            if(!getUser){
                return res.status(400).json({ok: false, message: "Iltimos avval tizimga kiring!"})
            }

            if(getUser.balls < 149){
                return res.status(400).json({ok: false, message: "Siz test yaratishdan oldin sertifikat olishiniz kerak!"})
            }

            if(data.answers.length < 4 || data.answers.length > 4){
                return res.status(400).json({ok: false, message: "Siz to'rta javob variantini kiritishingiz kerak!"})
            }

            const puplicTest = await publicTestModel.create({...data, owner: user, ownerSite: site})
            if(!puplicTest){
                return res.status(400).json({ok: false, message: "Sizning testingiz qo'shilmadi!"})
            }
            
            getUser.userTest.push(puplicTest._id)
            await getUser.save()
            res.json({ok: true, message: "Sizning testingiz qo'shildi!", data: puplicTest})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async Update(req, res){
        try {
            const { user } = req
            const { test } = req.params
            const data = req.body

            const getTest = await publicTestModel.findById(test)
            if(!getTest){
                return res.status(400).json({ok: false, messsage: "Bunaqa test mavjud eams!"})
            }

            if(getTest.owner.toString() != user){
                return res.status(400).json({ok: false, messsage: "Testni faqat egasigina o'zgartira oladi!"})
            }

            const getTestUpd = await publicTestModel.findByIdAndUpdate(test, data, { new: true })
            if(!getTestUpd){
                return res.status(400).json({ok: false, messsage: "Bunaqa test mavjud eams!"})
            }

            res.json({ok: true, message: "Test yangilandi!", data: getTestUpd})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async Delete(req, res){
        try {
            const { user } = req
            const { test } = req.params

            const GetTest = await publicTestModel.findById(test)
            if(!GetTest){
                return res.status(400).json({ok: false, message: "Test topilmadi!"})
            }

            if(GetTest.owner.toString() != user){
                return res.status(400).json({ok: false, message: "Testni faqat egasi o'chira oladi!"})
            }

            const GetTestDel = await publicTestModel.findByIdAndDelete(test, { new: true })
            if(!GetTestDel){
                return res.status(400).json({ok: false, message: "Test topilmadi!"})
            }

            res.json({ok: true, message: "Test o'chirib tashlandi!", data: GetTestDel})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async GetAll(req, res){
        try {
            const { site } = req
            const tests = await publicTestModel.find()
            
            const filtTests = tests.filter(t => t.ownerSite !== site)
            res.json({ok: true, message: "Testlarni ko'rishingiz mumkin!", data: filtTests})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async GetAllForUser(req, res){
        try {
            const { user } = req
            const tests = await publicTestModel.find({owner: user})
            res.json({ok: true, message: "Testlarni ko'rishingiz mumkin!", data: tests})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }
}

module.exports = new PublicTestController()