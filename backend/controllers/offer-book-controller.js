const bookModel = require("../models/offer-book-model")
const siteModel = require("../models/site-model")
const cloudinary = require('../configure/cloud')

class OfferBookController {
    async Create(req, res){
        try {
            const siteId = req.site
            const data = req.body
            const image = req.imageUrl
            const imageId = req.publicId

            if(!image || !data || !imageId){
                return res.status(400).json({ok: false, message: "Ma'lumotlar yuklanmadi. Qayta urinib ko'ring!"})
            }

            const site = await siteModel.findById(siteId)
            if(!site){
                return res.status(400).json({ok: false, message: "Maktab aniqlanmai! Iltimos tiimga qayta kiring!"})
            }

            data.image = image
            const book = await bookModel.create({...data, imageId: imageId})
            if(!book){
                return res.status(400).json({ok: false, message: "Kitob qo'shilmadi!"})
            }

            site.localBooks.push(book._id)
            await site.save()
            res.json({ok: true, message: "Siz yangi kitob qo'shdingiz!", data: book})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async Delete(req, res){
        try {
            const siteId = req.site
            const { book } = req.params
            
            const site = await siteModel.findById(siteId)
            if(!site){
                return res.status(400).json({ok: false, message: "Maktab aniqlanmadi! Iltimos tizimga qayta kiring!"})
            }

            const getBook = await bookModel.findByIdAndDelete(book)
            if(!getBook){
                return res.status(400).json({ok: false, message: "So'rov xato yuborilgan!"})
            }

            if(getBook.imageId) {
              await cloudinary.uploader.destroy(getBook.imageId);
            }

            res.json({ok: true, message: "Kitob o'chirib tashlandi!", data: getBook})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async GetAll(req, res){
        try {
            const { site } = req

            const getSite = await siteModel.findById(site).populate("localBooks", "image _id title rating goal createdAt")
            if(!getSite){
                return res.status(400).json({ok: false, message: "Maktabingiz aniqlanmadi!"})
            }

            res.json({ok: true, message: "Barcha kitoblar keldi!", data: getSite.localBooks.reverse()})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async GetOne(req, res){
        try {
            const { site } = req
            const bookId = req.params.book

            const getSite = await siteModel.findById(site).populate("localBooks")
            if(!getSite){
                return res.status(400).json({ok: false, message: "Maktabingiz aniqlanmadi!"})
            }

            const book = getSite.localBooks.find(b => b._id.toString() === bookId)
            if(!book){
                return res.status(400).json({ok: false, message: "Kitob topilmadi!"})
            }

            res.json({ok: true, message: "Kitob keldi!", data: book})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async UpdateRating(req, res){
        try {
            const siteId = req.site
            const { book, rating } = req.params

            const getBook = await bookModel.findById(book)
            if(!getBook){
                return res.status(400).json({ok: false, message: "Kitob aniqlanmadi!"})
            }

            const site = await siteModel.findById(siteId)
            if(!site){
                return res.status(400).json({ok: false, message: "Maktab aniqlanmai! Iltimos qayta tizimga kiring!"})
            }

            if(!site.localBooks.includes(getBook._id)){
                return res.status(400).json({ok:false, message: `Kechirasiz! Sizning maktabingizda ${getBook.title} nomli kitob mab=vjud emas!`})
            }
            
            const rat = (getBook.rating + Number(rating)) / 2
            getBook.rating = rat
            await getBook.save()
            res.json({ok: true, message: "Fikringiz uchun tashakkur!", data: getBook})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }
}

module.exports = new OfferBookController()