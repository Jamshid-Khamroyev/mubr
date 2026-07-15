const siteModel = require("../models/site-model")
const cloudinary = require('../configure/cloud');

class SiteController {
    async Create(req, res){
        try {
            const data = req.body
            if(!data){
                res.status(400).json({ok: false, message: "Ma'lumotlar to'liq emas!"})
            }

            data.images = req.imageUrls
            data.imagesId = req.publicIds

            const site = await siteModel.create(data)
            if(!site){
                res.status(400).json({ok: false, message: "Site yaratishda xatolik bo'ldi!"})
            }

            res.json({ok: true, message: "Site muvvofaqiyatli qo'shildi!", data: site})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async Delete(req, res){
        try {
            const siteId = req.params.site

            const site = await siteModel.findById(siteId)
            if(!site){
                return res.status(400).json({ok: false, message: "Maktab o'chirilmadi!"})
            }
            if (site.imagesId && site.imagesId.length > 0) {
                for (const publicId of site.imagesId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            }

            const siteDel = await siteModel.findByIdAndDelete(siteId, { new: true })
            res.status(200).json({ ok: true, message: "Muvaffaqiyatli o‘chirildi", data: siteDel });
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async Update(req, res){
        try {
            const siteId = req.params.site;
            const data = req.body;
            let images = {images: "", imagesId: ""}
    
            const newImageUrls = req.imageUrls || []
            const newPublicIds = req.publicIds || []
    
            const site = await siteModel.findById(siteId);
            if (!site) {
                return res.status(400).json({ ok: false, message: "Maktab aniqlanmadi!" });
            }
            
            if (newImageUrls.length > 0) {
                for (const publicId of site.imagesId) {
                    try {
                        await cloudinary.uploader.destroy(publicId);
                    } catch (err) {
                        console.warn(`Rasmni o‘chirishda xatolik: ${publicId}`, err.message);
                    }
                }
                
                images.images = newImageUrls;
                images.imagesId = newPublicIds;
            }
            
            let updatedSite = null

            if(data){
                updatedSite = await siteModel.findByIdAndUpdate(siteId, data, { new: true });
            }

            if(images){
                updatedSite = await siteModel.findByIdAndUpdate(siteId, images, { new: true });
            }
    
            res.status(200).json({ ok: true, message: "Maktab yangilandi!", data: updatedSite });
    
        } catch (error) {
            res.status(400).json({ ok: false, message: error.message });
        }
    }

    async GetAll(req, res){
        try {
            const sites = await siteModel.find()
            res.status(200).json({ok: true, message: "Barcha ma'lumotlar olindi!", data: sites})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async GetOne(req, res){
        try {
            const siteId = req.params.site

            const site = await siteModel.findById(siteId).populate("users", "username surname balls sertificate")
            if(!site){
                return res.status(400).json({ok: false, message: "Maktab aniqlanmadi!"})
            }

            if(site.block){
                return res.status(400).json({ok: false, message: "Maktab sayti vaqtinchalik ishlamayapti!"})
            }

            res.json({ok: true, message: "Ma'lumotlar keldi!", data: site})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async Block(req, res){
        try {
            const siteId = req.params.site
            const site = await siteModel.findById(siteId)
            if(!site){
                return res.status(400).json({ok: false, message: "Maktab aniqlanmadi!"})
            }

            site.block = !site.block
            await site.save()
            res.status(200).json({ok: true, message: `${site.title} ${site.block ? "bloklandi" : "blockdan chiqarildi"}!`})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async GetAllSiteForUser(req, res){
        try {
            const sites = await siteModel.find({}, { title: 1 }); // faqat title va _id
            res.status(200).json({ ok: true, message: "Barcha sitelar olindi!", data: sites });
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async Stats(req, res){
        try {
            const school = await siteModel.findById(req.params.id)
              .populate('users localBooks tests');
        
            if (!school) return res.status(404).json({ok: false, message: 'Maktab aniqlanmadi!' });
        
            const users = school.users || [];
            const sortedUsers = [...users].sort((a, b) => b.balls - a.balls);
            const today = new Date();
        
            const stats = {
              totalUsers: users.length,
              topUsers: users.filter(u => u.balls >= 150).length,
              bestUser: `${sortedUsers[0]?.username} ${sortedUsers[0]?.surname}` || "bo'sh",
              bestUserBalls: sortedUsers[0]?.balls || 0,
              avgBalls: users.length ? Math.round(users.reduce((s, u) => s + u.balls, 0) / users.length) : 0,
              books: school.localBooks.length,
              tests: school.tests.length,
            };
        
            res.json({ok: true, message: "Statistika olindi!", data: stats});
          } catch (err) {
            res.status(500).json({ ok: false, message: err.message });
          }
    }

    async Open(req, res){
        try {
            const { id } = req.params;
            const site = await siteModel.findById(id);
            if (!site) {
                return res.status(404).json({ ok: false, message: 'Maktab topilmadi' });
            }
            site.block = false;
            const now = new Date();
            const oneMonthLater = new Date(now.setMonth(now.getMonth() + 1));
            site.time = oneMonthLater;
            await site.save();
            res.status(200).json({ ok: true, message: `${site.title} ochildi va uning muddati 1 oyga uzaytirildi`, data: site });
        } catch (error) {
            res.status(500).json({ ok: false, message: error.message });
        }
    }

    async statsForAllSchools(req, res) {
        try {
          const schools = await siteModel.find().populate('users localBooks tests teams albums complaints notification');
          if (!schools || schools.length === 0) {
            return res.status(404).json({ ok: false, message: 'Maktablar topilmadi!' });
          }
      
          const today = new Date();
      
          const stats = schools.map(school => {
            const users = school.users || [];
            const sortedUsers = [...users].sort((a, b) => b.balls - a.balls);
      
            const usersByClass = users.reduce((acc, user) => {
              const cls = user.userClassNumber || 'unknown';
              acc[cls] = (acc[cls] || 0) + 1;
              return acc;
            }, {});
      
            return {
              schoolId: school._id,
              schoolName: school.title,
              totalUsers: users.length,
              topUsers: users.filter(u => u.balls >= 150).length,
              blockedUsers: users.filter(u => u.block).length,
              certifiedUsers: users.filter(u => u.sertificate > 0).length,
              newUsersLast7Days: users.filter(u => {
                const created = new Date(u.createdAt);
                const diffDays = (today - created) / (1000 * 60 * 60 * 24);
                return diffDays <= 7;
              }).length,
              usersByClass,
              usersWithTeam: users.filter(u => u.userTeam).length,
              bestUser: sortedUsers[0] ? `${sortedUsers[0]?.username} ${sortedUsers[0]?.surname}` : "bo'sh",
              bestUserBalls: sortedUsers[0]?.balls || 0,
              avgBalls: users.length ? Math.round(users.reduce((s, u) => s + u.balls, 0) / users.length) : 0,
              totalBooks: school.localBooks.length,
              totalTests: school.tests.length,
              totalTeams: school.teams.length,
              totalAlbums: school.albums.length,
              complaintsCount: school.complaints.length,
              notificationCount: school.notification.length,
              createdAt: school.createdAt,
              updatedAt: school.updatedAt,
              isBlocked: school.block,
              adminPhone: school.adminPhone
            };
          });
      
          return res.json({ ok: true, message: "Statistikalar muvaffaqiyatli olindi!", data: stats });
        } catch (err) {
          res.status(500).json({ ok: false, message: err.message });
        }
      };
      
}


module.exports = new SiteController()