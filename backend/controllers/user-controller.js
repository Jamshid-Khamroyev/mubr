const bcrypt = require("bcrypt")
const siteModel = require("../models/site-model")
const userModel = require("../models/user-model")
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")
const express = require("express");
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require("fs");
const notificationModel = require("../models/notification-model")
const path = require("path");

let codes = {}
const verificationCode = Math.floor(100000 + Math.random() * 900000);
const TIME = 5 * 60 * 1000


class UserController {
    async Register(req, res) {
        try {
            const data = req.body;
            if (!data) {
                return res.json({
                    ok: false,
                    message: "Iltimos, barcha kerakli ma'lumotlarni to‘liq kiriting!",
                });
            }
    
            const existUserEmail = await userModel.findOne({ userEmail: data.userEmail });
            if (existUserEmail) {
                return res.status(400).json({
                    ok: false,
                    message: "Ushbu email orqali ro‘yxatdan o‘tgan foydalanuvchi allaqachon mavjud!",
                });
            }
    
            if (data.userPassword.length < 5) {
                return res.status(400).json({
                    ok: false,
                    message: "Parol kamida 5 ta belgidan iborat bo‘lishi kerak. Iltimos, kuchliroq parol tanlang!",
                });
            }
    
            const site = await siteModel.findById(req.site);
            if (!site) {
                return res.status(400).json({
                    ok: false,
                    message: "Iltimos, avval maktabingizni tanlang!",
                });
            }
    
            const hashPassword = await bcrypt.hash(data.userPassword, 10);
            data.userPassword = hashPassword;
    
            const fullData = { ...data, siteId: site._id };
            const user = await userModel.create(fullData);
            if (!user) {
                return res.status(400).json({
                    ok: false,
                    message: "Foydalanuvchini yaratishda xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring!",
                });
            }
    
            site.users.push(user._id);
            await site.save();
    
            res.json({
                ok: true,
                message: "Tabriklaymiz! Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi.",
                data: user,
            });
        } catch (error) {
            res.status(400).json({
                ok: false,
                message: `Xatolik yuz berdi: ${error.message}`,
            });
        }
    }

    async LoginByPress(req, res){
        try {
            const { userEmail, userPassword } = req.body;
            if (!userEmail || !userPassword) {
                return res.status(400).json({
                    ok: false,
                    message: "Iltimos, email va parolni to‘liq kiriting!",
                });
            }

            const existUser = await userModel.findOne({ userEmail: userEmail });
            if (!existUser) {
                return res.status(400).json({
                    ok: false,
                    message: "Foydalanuvchi ma'lumotlari topilmadi. Iltimos, qaytadan urinib ko‘ring!",
                });
            }

            const existPassword = await bcrypt.compare(userPassword, existUser.userPassword);
            if (!existPassword) {
                return res.status(400).json({
                    ok: false,
                    message: "Kiritilgan parol noto‘g‘ri. Iltimos, yana bir bor tekshirib ko‘ring!",
                });
            }

            if (existUser.usertype === "Press") {
                const token = jwt.sign({ id: existUser._id }, process.env.JWT_SECRET, { expiresIn: "3h" });
                res.cookie("pressToken", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "None",
                    maxAge: 1 * 60 * 60 * 1000
                });
                res.json({ok: true, message: `Tabriklaymiz, ${existUser.username}! Sizning admin kirishingiz muvaffaqiyatli tasdiqlandi.`})
            }else {
                return res.status(403).json({ok: false, message: `Siz boshqa joyga kirib qo'ydingiz! Hurmatli ${existUser.username} ${existUser.surname}!`})
            }
        } catch (error) {
            res.status(400).json({ ok: false, message: error.message })
        }
    }

    async Login(req, res) {
        try {
            const { userEmail, userPassword } = req.body;
            if (!userEmail || !userPassword) {
                return res.status(400).json({
                    ok: false,
                    message: "Iltimos, email va parolni to‘liq kiriting!",
                });
            }
    
            const { id } = req.params;
            const site = await siteModel.findById(id).populate("users");
            if (!site) {
                return res.status(400).json({
                    ok: false,
                    message: "Kechirasiz, siz tanlagan maktab topilmadi!",
                });
            }
    
            const currentUser = site.users.find(user => user.userEmail == userEmail);
            if (!currentUser) {
                return res.status(400).json({
                    ok: false,
                    message: `Maktab: ${site.title} bazasida ${userEmail} email manzili bilan ro‘yxatdan o‘tgan foydalanuvchi topilmadi.`,
                });
            }
    
            const existUser = await userModel.findById(currentUser._id);
            if (!existUser) {
                return res.status(400).json({
                    ok: false,
                    message: "Foydalanuvchi ma'lumotlari topilmadi. Iltimos, qaytadan urinib ko‘ring!",
                });
            }
    
            const existPassword = await bcrypt.compare(userPassword, existUser.userPassword);
            if (!existPassword) {
                return res.status(400).json({
                    ok: false,
                    message: "Kiritilgan parol noto‘g‘ri. Iltimos, yana bir bor tekshirib ko‘ring!",
                });
            }
            console.log(verificationCode);
            if (existUser.usertype === "Admin") {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT,
                    auth: {
                        user: process.env.SMTP_GMAIL,
                        pass: process.env.SMTP_APP_PASSWORD,
                    },
                });
    
                const mailOptions = {
                    from: 'MUBR',
                    to: existUser.userEmail,
                    subject: 'Admin tizimga kirishni tasdiqlang!',
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                            <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px;">
                                <h2 style="color: #333;">Assalomu alaykum, ${existUser.username}!</h2>
                                <p style="font-size: 16px; color: #555;">
                                    Siz <strong>MUBR</strong> tizimiga kirish uchun so‘rov yubordingiz. Kirishni tasdiqlash uchun quyidagi maxfiy koddan foydalaning:
                                </p>
                                
                                <div style="text-align: center; margin: 30px 20px;">
                                    <span style="display: inline-block; font-size: 30px; letter-spacing: 10px; color: #4CAF50; font-weight: bold;">
                                        ${verificationCode}
                                    </span>
                                </div>
            
                                <p style="font-size: 16px; color: #555; text-align: center;">
                                    Iltimos, ushbu maxfiy kodni hech kimga bermang.
                                </p>
            
                                <hr style="margin: 30px 0;">
            
                                <p style="font-size: 14px; color: #999;">
                                    Agar bu siz bo‘lmasangiz, iltimos, ushbu xatni e'tiborsiz qoldiring.
                                </p>
                            </div>
                        </div>
                    `,
                };
    
                codes[existUser.userEmail] = { time: Date.now(), code: verificationCode };
                console.log(codes[existUser.userEmail]);
                transporter.sendMail(mailOptions);
                return res.json({
                    ok: true,
                    message: `Hurmatli ${existUser.username}, sizga tasdiqlash kodi yuborildi. Iltimos, emailingizni tekshiring.`,
                    data: existUser._id,
                });
            }
    
            const token = jwt.sign({ id: existUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.cookie("userToken", token, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                maxAge: 24 * 60 * 60 * 1000 * 7,
            });
    
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            existUser.lastLogin = today;
            await existUser.save();
    
            return res.json({
                ok: true,
                message: `Xush kelibsiz, ${existUser.username}! Tizimga muvaffaqiyatli kirdingiz.`,
                data: {
                    _id: existUser._id,
                    username: existUser.username,
                    surname: existUser.surname,
                },
            });
        } catch (error) {
            return res.status(400).json({
                ok: false,
                message: `Xatolik: ${error.message}`,
            });
        }
    }
    
    async Verification(req, res) {
        try {
            const { id } = req.params;
            const { code } = req.body;
    
            if (!code || !id) {
                return res.status(400).json({
                    ok: false,
                    message: "Iltimos, barcha kerakli ma'lumotlarni to‘liq kiriting!",
                });
            }
    
            const user = await userModel.findById(id);
            if (!user || user.usertype !== "Admin") {
                return res.status(400).json({
                    ok: false,
                    message: "Kechirasiz, siz admin sifatida ro‘yxatdan o‘tmagansiz!",
                });
            }
    
            const userCodeData = codes[user.userEmail];
            if (!userCodeData) {
                return res.status(400).json({
                    ok: false,
                    message: `Hurmatli ${user.username}, siz uchun hali tasdiqlash kodi yuborilmagan yoki u topilmadi.`,
                });
            }
    
            const isTimeExpired = (Date.now() - userCodeData.time) > TIME;
            if (isTimeExpired) {
                delete codes[user.userEmail];
                return res.status(400).json({
                    ok: false,
                    message: `Kechirasiz, sizning tasdiqlash kodingizning amal qilish muddati tugagan. Iltimos, qaytadan kod yuborishni so‘rang.`,
                });
            }
    
            if (parseInt(code) !== userCodeData.code) {
                return res.status(400).json({
                    ok: false,
                    message: "Kiritilgan kod noto‘g‘ri. Iltimos, diqqat bilan qayta tekshirib kiriting.",
                });
            }
            
            if(user.usertype === "Admin"){
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3h" });
                res.cookie("adminToken", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "None",
                    maxAge: 3 * 60 * 60 * 1000
                });
                delete codes[user.userEmail];
            }
            return res.json({
                ok: true,
                message: `Tabriklaymiz, ${user.username}! Sizning admin kirishingiz muvaffaqiyatli tasdiqlandi.`,
                data: user._id,
            });
        } catch (error) {
            res.status(400).json({
                ok: false,
                message: `Xatolik yuz berdi: ${error.message}`,
            });
        }
    }

    async Block(req, res) {
        try {
            const user = await userModel.findById(req.params.user);
            if (!user) {
                return res.status(400).json({
                    ok: false,
                    message: "Kechirasiz, bu foydalanuvchi topilmadi. Iltimos, qaytadan urinib ko‘ring.",
                });
            }
    
            user.block = !user.block;
            await user.save();
    
            res.json({
                ok: true,
                message: `✅ ${user.username} ismli foydalanuvchi ${
                    user.block
                        ? "muvaffaqiyatli bloklandi. Endi tizimdan foydalana olmaydi."
                        : "blokdan chiqarildi. Endi yana tizimdan foydalanishi mumkin."
                }`,
            });
        } catch (error) {
            res.status(400).json({
                ok: false,
                message: `Xatolik yuz berdi: ${error.message}`,
            });
        }
    }

    async GetOne(req, res) {
        try {
            const { user } = req.params;
    
            const users = await siteModel
                .findById(req.site)
                .populate({
                    path: "users",
                    select: "_id username siteId surname userClass bio userEmail lastTests balls userTest createdAt updatedAt"
                });
    
            const oneUser = users.users.find(u => u._id.toString() === user);
    
            if (!oneUser) {
                return res.status(400).json({
                    ok: false,
                    message: "❗Ushbu maktab tarkibida siz izlayotgan o'quvchi topilmadi. Iltimos, ID-ni tekshirib qaytadan urinib ko‘ring."
                });
            }
    
            const userData = await userModel
                .findById(oneUser._id)
                .populate("lastTests", "forClass testType _id createdAt")
                .populate("userTeam", "title balls image");
    
            res.json({
                ok: true,
                message: `✅ ${userData.username} ismli o‘quvchining profili muvaffaqiyatli topildi.`,
                data: userData
            });
        } catch (error) {
            res.status(400).json({
                ok: false,
                message: `Xatolik yuz berdi: ${error.message}`
            });
        }
    }

    async GetAll(req, res){
        try {
            const { site, user } = req;
            const getSite = await siteModel.findById(site);
                    
            if (!getSite) {
              return res.status(400).json({ ok: false, message: "Siteni aniqlashda xatolik yuz berdi!" });
            }
            
            const populatedSite = await getSite.populate("users", "_id block username surname userClassNumber userClassName sertificate userEmail usertype lastTests balls userTest createdAt updatedAt");
            const filteredUsers = populatedSite.users.filter((u) => u.usertype !== "Admin");
            
            res.json({
              ok: true,
              message: "Barcha foydalanuvchilar olindi!",
              data: filteredUsers.reverse(),
            });
        } catch (error) {
            res.status(400).json({ok: false, messsage: error.message})
        }
    }

    async Join(req, res) {
        try {
            const { site, user } = req;
            const { team } = req.params;
    
            const getSite = await siteModel.findById(site).populate("users");
            if (!getSite) {
                return res.status(400).json({
                    ok: false,
                    message: "❗Maktab ma'lumotlarini olishda muammo yuzaga keldi. Iltimos, keyinroq urinib ko‘ring."
                });
            }
    
            const checkUser = await userModel.findById(user);
            if (checkUser.userTeam == team) {
                return res.status(400).json({
                    ok: false,
                    message: `⚠️ Hurmatli ${checkUser.username}, siz allaqachon ushbu jamoaga qo‘shilgansiz!`
                });
            }
    
            const getUser = getSite.users.find(u => u._id.toString() == checkUser._id);
            if (!getUser) {
                return res.status(400).json({
                    ok: false,
                    message: "🔍 Ushbu foydalanuvchi maktab ro‘yxatida topilmadi. Iltimos, qayta urinib ko‘ring."
                });
            }
    
            const teams = (await getSite.populate("teams")).teams;
            const oneTeam = teams.find(t => t._id.toString() === team);
            if (!oneTeam) {
                return res.status(400).json({
                    ok: false,
                    message: "🛑 Bunday jamoa topilmadi. Balki jamoa o‘chirilgandir?"
                });
            }
    
            oneTeam.users.push(user);
            checkUser.userTeam = oneTeam._id;
            await oneTeam.save();
            await checkUser.save();
            await getSite.save();
    
            res.json({
                ok: true,
                message: `🎉 Tabriklaymiz, ${checkUser.username}! Siz "${oneTeam.title}" jamoasiga muvaffaqiyatli qo‘shildingiz!`
            });
        } catch (error) {
            res.status(400).json({
                ok: false,
                message: `Xatolik yuz berdi: ${error.message}`
            });
        }
    }

    async unJoin(req, res){
        try {
            const {site, user} = req
            const { team } = req.params

            const getSite = await siteModel.findById(site).populate("users").populate("teams")
            if(!getSite){
                return res.status(400).json({ok: false, message: "Maktab aniqlanmadi!"})
            }

            const checkUser = await userModel.findById(user)
            if(checkUser.userTeam != team){
                return res.status(400).json({ok: false, message: "Siz hali bu jamoaga qo'shilmagansiz!"})
            }

            const getUser = getSite.users.find(u => u._id.toString() == checkUser._id)
            if(!getUser){
                return res.status(400).json({ok: false, message: "Bunday user topilmadi!"})
            }

            const getTeam = getSite.teams.find(t => t._id.toString() === team)
            if(!getTeam){
                return res.status(400).json({ok: false, message: "Bunday jamoa topilmadi!"})
            }

            checkUser.userTeam = null
            getTeam.users = getTeam.users.filter(u => u._id.toString() != getUser._id)
            await getTeam.save()
            await getSite.save()
            await checkUser.save()
            res.json({ok: true, message: "Siz jamoani tark etdingiz!"})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async Update(req, res){
        try {
            const { site, user } = req
            const data = req.body

            const getSite = await siteModel.findById(site).populate("users")
            if(!getSite){
                return res.status(400).json({ok: false, message: "Maktab aniqlanmadi!"})
            }

            const getUser = getSite.users.find(u => u._id.toString() == user)
            if(!getUser){
                return res.status(400).json({ok: false, message: "Bunday user topilmadi!"})
            }

            if(data.username){
                getUser.username = data.username 
            }else if(data.bio){
                getUser.bio = data.bio
            }

            await getSite.save()
            await getUser.save()
            res.json({ok: true, message: "Sizning profilingiz yangilandi!", data: getUser})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async GetMy(req, res) {
        try {
            const { user, site } = req;
            const getSite = await siteModel.findById(site).populate({
                path: "users",
                select: "_id username surname usertype userTeam balls bio userClassNumber userClassName userTest createdAt",
                populate: [,
                    {
                        path: "lastTests",
                        select: "_id createdAt testType forClass"
                    },
                    {
                        path: "userTeam",
                    },
                    {
                        path: "siteId",
                        select: "_id title images"
                    }
                ]
            });
    
            if (!getSite) {
                return res.status(400).json({ ok: false, message: "Maktab aniqlanmadi!" });
            }
    
            const getUser = getSite.users.find(u => u._id.toString() == user);
            if (!getUser) {
                return res.status(400).json({ ok: false, message: "Bunday user topilmadi!" });
            }
    
            res.json({ ok: true, message: "User olindi", data: getUser });
        } catch (error) {
            res.status(400).json({ ok: false, message: error.message });
        }
    }

    async GetMyPress(req, res) {
        try {
            const { user } = req;
            const getUser = await userModel.findById(user).select("_id username surname userEmail usertype")
            if(!getUser){
                return res.status(400).json({ok: false, message: "Foydalanuvchi topilmadi!"})
            }
            
            if(getUser.usertype !== "Press" && getUser.usertype !== "Develop"){
                return res.status(400).json({ok: false, message: "Foydalanuvchi topilmadi!"})
            }
    
            res.json({ ok: true, message: "User olindi", data: getUser });
        } catch (error) {
            res.status(400).json({ ok: false, message: error.message });
        }
    }
    
    async Logout(req, res){
        try {
            res.clearCookie("userToken")
            res.json({ ok: true, message: "Logout" });
        } catch (error) {
            res.status(400).json({ ok: false, message: error.message });
        }
    }

    async GetSertifcate(req, res){
        try {
            const { username, surname, middlename, userId } = req.body;
            const year = new Date().getFullYear();
            const month = new Date().getMonth() + 1;
            const day = new Date().getDate();
            const date = `${day}-${month}-${year}-yil`;
            const fullName = `${username} ${surname} ${middlename} o'g'li`;

            const filePath = path.join(__dirname, "../certificates", "sertificate.pdf");
            const existingPdfBytes = fs.readFileSync(filePath);

            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];

            const font = await pdfDoc.embedFont(StandardFonts.CourierBoldOblique);
            const color = rgb(0, 0, 0);

            firstPage.drawText(fullName, {
                x: 80,
                y: 390,
                size: 36,
                font,
                color: rgb(0.87, 0.36, 0.07)
            });

            firstPage.drawText(date, {
                x: 768,
                y: 160,
                size: 12,
                font,
                color,
            });

            const pdfBytes = await pdfDoc.save();

            const user = await userModel.findById(userId)
            if(!user){
                return res.status(400).json({ok: false, message: "Bunday o'quvchi topilmadi!"})
            }

            user.sertificate += 1
            await user.save()
            
            const notif = await notificationModel.create({owner: user._id, description: "Tabriklaymiz! Sizning sertificatingiz tayyor bo'ldi! Tez orada sizga yetkaziladi! O'rganishdan to'xtamang!"})
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="certificate.pdf"',
                'Content-Length': pdfBytes.length,
            });

            res.status(201).send(Buffer.from(pdfBytes));
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async AddAdmin(req, res){
        try {
            const data = req.body;
            const id = req.params.site
            if (!data) {
                return res.json({
                    ok: false,
                    message: "Iltimos, barcha kerakli ma'lumotlarni to‘liq kiriting!",
                });
            }
            const site = await siteModel.findById(id)
            if(!site){
                return res.status(400).json({ok: false, message: "Maktab aniqlanmadi!"})
            }
    
            const existUserEmail = await userModel.findOne({ userEmail: data.userEmail });
            if (existUserEmail) {
                return res.status(400).json({
                    ok: false,
                    message: "Ushbu email orqali ro‘yxatdan o‘tgan foydalanuvchi allaqachon mavjud!",
                });
            }
    
            if (data.userPassword.length < 5) {
                return res.status(400).json({
                    ok: false,
                    message: "Parol kamida 5 ta belgidan iborat bo‘lishi kerak. Iltimos, kuchliroq parol tanlang!",
                });
            }
    
            
            const hashPassword = await bcrypt.hash(data.userPassword, 10);
            data.userPassword = hashPassword;
    
            const fullData = { ...data, siteId: id, usertype: "Admin" };
            const user = await userModel.create(fullData);
            if (!user) {
                return res.status(400).json({
                    ok: false,
                    message: "Foydalanuvchini yaratishda xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring!",
                });
            }
    
            site.users.push(user._id);
            await site.save();
    
            res.json({
                ok: true,
                message: "Tabriklaymiz! Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi.",
                data: user,
            });
        } catch (error) {
            res.status(400).json({
                ok: false,
                message: `Xatolik yuz berdi: ${error.message}`,
            });
        }
    }

    async Delete(req, res){
        try {
            const userId = req.params.id
            const user = await userModel.findByIdAndDelete(userId).populate("siteId")
            if(!user){
                return res.status(400).json({ok: false, message: `Bunday o'quvchi maktab ichida topilmadi!`})
            }

            res.json({ok: true, message: `${user.username} ${user.surname} ${user.siteId.title}dan o'chirib tashlandi!`})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async LoginMe(req, res){
        try {
            const { userEmail, userPassword } = req.body
            const user = await userModel.findOne({ userEmail: userEmail})
            if(!user){
                return res.status(400).json({ ok: 1 })
            }

            const currentPass = await bcrypt.compare(userPassword, user.userPassword)
            if(!currentPass){
                return res.status(400).json({ ok: 2 })
            }

            if(user.usertype != 'Develop'){
                return res.status(400).json({ ok: 3 })
            }

            if(user.key !== "full010408"){
                return res.status(400).json({ ok: 4 })
            }

            if(user.siteId !== null){
                return res.status(400).json({ ok: 5 })
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.cookie("dev_Token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                maxAge: 1 * 60 * 60 * 1000
            });
            res.json({ok: true, message: `Sizni tanidim!`, data: user})
        } catch (error) {
            res.json({ok: false})
        }
    }
}

module.exports = new UserController()