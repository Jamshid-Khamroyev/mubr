const albumModel = require("../models/album-model")
const cloudinary = require('../configure/cloud')
const userModel = require("../models/user-model")
const siteModel = require("../models/site-model")

class AlbumController {
    async Create(req, res) {
        try {
            const { username } = req.body;
            const image = req.imageUrl;
            const imageId = req.publicId;
            const siteId = req.site;
    
            const site = await siteModel.findById(siteId);
            if (!site) {
                return res.status(400).json({ ok: false, message: "Tanlangan maktab topilmadi." });
            }
    
            if (!image || !username || !imageId) {
                return res.status(400).json({ ok: false, message: "Barcha ma'lumotlar to‘liq yuborilmadi. Iltimos, qaytadan urinib ko‘ring." });
            }
    
            const user = await userModel.findOne({ username });
            if (!user) {
                return res.status(400).json({ ok: false, message: "Kiritilgan foydalanuvchi nomi bo‘yicha hech qanday foydalanuvchi topilmadi." });
            }
    
            const album = await albumModel.create({ user: user._id, image, imageId });
            if (!album) {
                return res.status(400).json({ ok: false, message: "Yangi albomni yaratishda xatolik yuz berdi." });
            }
    
            site.albums.push(album._id);
            await site.save();
    
            res.status(200).json({ ok: true, message: "Albom muvaffaqiyatli qo‘shildi!", data: album });
        } catch (error) {
            res.status(500).json({ ok: false, message: `Serverda xatolik: ${error.message}` });
        }
    }

    async Delete(req, res) {
        try {
            const albumId = req.params.album;
    
            const album = await albumModel.findByIdAndDelete(albumId);
            if (!album) {
                return res.status(404).json({ ok: false, message: "Ushbu ID bo‘yicha albom topilmadi." });
            }
    
            if (album.imageId) {
                await cloudinary.uploader.destroy(album.imageId);
            }
    
            res.status(200).json({ ok: true, message: "Albom muvaffaqiyatli o‘chirildi.", data: album });
        } catch (error) {
            res.status(500).json({ ok: false, message: `Serverda xatolik: ${error.message}` });
        }
    }

    async GetAll(req, res) {
        try {
            const { num } = req.params;
            const siteId = req.site;
    
            const site = await siteModel.findById(siteId).populate({
                path: "albums",
                select: "_id image user",
                populate: {
                    path: "user",
                    select: "_id username surname userClass balls"
                }
            });
    
            if (!site) {
                return res.status(404).json({ ok: false, message: "Maktab topilmadi." });
            }
    
            const limitedAlbums = site.albums.reverse().slice(0, Number(num));
    
            res.status(200).json({
                ok: true,
                message: `Oxirgi ${limitedAlbums.length} ta albom muvaffaqiyatli olindi.`,
                data: limitedAlbums
            });
        } catch (error) {
            res.status(500).json({ ok: false, message: `Serverda xatolik: ${error.message}` });
        }
    }

    async GetOne(req, res) {
        try {
            const siteId = req.site;
            const albumId = req.params.album;
    
            const site = await siteModel.findById(siteId).populate({
                path: "albums",
                select: "_id image user",
                populate: {
                    path: "user",
                    select: "_id username surname userClass balls"
                }
            });
    
            if (!site) {
                return res.status(404).json({ ok: false, message: "Maktab topilmadi." });
            }
    
            const album = site.albums.find(a => a._id.toString() === albumId);
            if (!album) {
                return res.status(404).json({ ok: false, message: "So‘ralgan albom topilmadi." });
            }
    
            res.status(200).json({
                ok: true,
                message: "Albom ma'lumotlari muvaffaqiyatli olindi.",
                data: album
            });
        } catch (error) {
            res.status(500).json({ ok: false, message: `Serverda xatolik: ${error.message}` });
        }
    }
    
}

module.exports = new AlbumController() 