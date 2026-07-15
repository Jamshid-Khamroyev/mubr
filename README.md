# MUBR - Maktablar uchun Interaktiv Test Tizimi

![MUBR](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

## 📖 Loyiha Haqida

**MUBR** - O'zbekiston maktablari uchun mo'ljallangan ko'p platformali ta'limiy test tizimi. Bu tizim o'quvchilarning bilimlarini sinash, jamoaviy musobaqalar o'tkazish va reyting tizimini yaratish imkoniyatini beradi. Loyiha Uzun tumani maktablari uchun ishlab chiqilgan bo'lib, boshqa tumanlar uchun ham moslashishi mumkin.

## ✨ Asosiy Xususiyatlar

### 👨‍🎓 O'quvchilar uchun

- **Ro'yxatdan o'tish va tizimga kirish**: Email va parol orqali xavfsiz ro'yxatdan o'tish
- **Test yechish**: Tasodifiy tartibda savollar bilan test yechish imkoniyati
- **Jamoa qo'shilish**: Jamoalarga qo'shilish va jamoaviy musobaqalarda ishtirok etish
- **Reyting tizimi**: Maktab ichida va jamoalar bo'yicha reytingni ko'rish
- **Profil boshqaruvi**: Shaxsiy ma'lumotlarni yangilash
- **Sertifikat olish**: Testlarni muvaffaqiyatli tugatgandan so'ng sertifikat olish
- **Yangiliklar**: Ta'limiy yangiliklarni o'qish
- **Kutubxona**: Elektron kitoblar va resurslarga kirish

### 👨‍💼 Administratorlar uchun

- **Foydalanuvchi boshqaruvi**: O'quvchilarni qo'shish, bloklash, o'chirish
- **Test yaratish**: Yangi testlar yaratish va mavjud testlarni boshqarish
- **Jamoa boshqaruvi**: Jamoalarni yaratish va boshqarish
- **Kontent boshqaruvi**: Yangiliklar va ta'limiy materiallarni joylashtirish
- **Maktab boshqaruvi**: Maktab ma'lumotlarini boshqarish
- **Sertifikat berish**: O'quvchilarga sertifikat berish
- **Statistika**: Tizim statistikasini ko'rish va tahlil qilish

### 📰 Manager/Press uchun

- **Umumiy statistika**: Barcha maktablar bo'yicha statistikani ko'rish
- **Yangiliklar boshqaruvi**: Umumiy yangiliklarni joylashtirish
- **Ta'lim markazlari**: Ta'lim markazlarini boshqarish
- **Reytinglar**: Umumiy reytinglarni kuzatish

## 🛠️ Texnologiyalar

### Backend
- **Node.js** - Runtime muhiti
- **Express.js** - Web framework
- **MongoDB** - Ma'lumotlar bazasi (ikki alohida database: Quiz va Public)
- **Mongoose** - MongoDB ODM
- **JWT** - Autentifikatsiya
- **Bcrypt** - Parol hashlash
- **Nodemailer** - Email yuborish
- **Multer** - Fayl yuklash
- **PDF-lib** - PDF generatsiya qilish
- **Node-cron** - Avtomatik vazifalar

### Frontend (O'quvchilar uchun)
- **React 19** - UI framework
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **TailwindCSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Icons** - Iconlar

### Admin Panel
- **React 19** - UI framework
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **TailwindCSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **React Toastify** - Notifications

### Manager Panel
- **React 19** - UI framework
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **TailwindCSS** - Styling
- **Recharts** - Chart library
- **React Router** - Routing
- **Axios** - HTTP client

### Telegram Bot
- **Node.js** - Runtime muhiti
- **Express.js** - Web server
- **node-telegram-bot-api** - Telegram bot API

## 🔧 O'rnatish va Sozlash

### Talablar

- Node.js (v18 yoki yuqori)
- MongoDB (lokal yoki cloud)
- Git
- NPM yoki Yarn

### Environment O'zgaruvchilari

#### Backend (.env)
```env
# Server
PORT=5000

# MongoDB
MONGO_URL_MAIN=mongodb://localhost:27017
MONGO_URL_SECONDARY=mongodb://localhost:27017

# JWT
JWT_SECRET=sizning_maxfiy_kalitingiz

# SMTP (Email uchun)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_GMAIL=sizning_emailingiz@gmail.com
SMTP_APP_PASSWORD=sizning_gmail_app_password
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

#### Admin (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

#### Manager (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

#### Bot (.env)
```env
BOT_TOKEN=sizning_telegram_bot_tokeningiz
```

### O'rnatish Qadamlari

1. **Repositoryni klonlash**
```bash
git clone <repository-url>
cd mubr
```

2. **Backendni o'rnatish**
```bash
cd backend
npm install
```

Backend uchun `.env` faylini yaratish va yuqoridagi o'zgaruvchilarni qo'shish.

3. **Frontendni o'rnatish**
```bash
cd ../frontend
npm install
```

Frontend uchun `.env` faylini yaratish va API URLni qo'shish.

4. **Admin panelni o'rnatish**
```bash
cd ../admin
npm install
```

Admin uchun `.env` faylini yaratish va API URLni qo'shish.

5. **Manager panelni o'rnatish**
```bash
cd ../manager
npm install
```

Manager uchun `.env` faylini yaratish va API URLni qo'shish.

6. **Botni o'rnatish**
```bash
cd ../bot
npm install
```

Bot uchun `.env` faylini yaratish va Telegram bot tokenini qo'shish.

## 🚀 Ishga Tushirish

### Development rejimda

1.MongoDB serverni ishga tushiring (lokal yoki cloud)

2. **Backendni ishga tushirish**
```bash
cd backend
npm run dev
```
Backend `http://localhost:5000` da ishlaydi.

3. **Frontendni ishga tushirish**
```bash
cd frontend
npm run dev
```
Frontend `http://localhost:5173` da ishlaydi.

4. **Admin panelni ishga tushirish**
```bash
cd admin
npm run dev
```
Admin panel `http://localhost:5174` da ishlaydi.

5. **Manager panelni ishga tushirish**
```bash
cd manager
npm run dev
```
Manager panel `http://localhost:5175` da ishlaydi.

6. **Botni ishga tushirish**
```bash
cd bot
npm run dev
```
Bot `http://localhost:4000` da ishlaydi.

### Production rejimda

Har bir komponent uchun:
```bash
npm run build
npm run preview
```

## 📊 Ma'lumotlar Bazasi Tuzilishi

Tizim ikkita MongoDB databasedan foydalanadi:

1. **Quiz Database** - Asosiy ma'lumotlar:
   - Foydalanuvchilar (Users)
   - Maktablar (Sites)
   - Testlar (Tests)
   - Jamoalar (Teams)
   - Yangiliklar (Notifications)
   - Shikoyatlar (Complaints)
   - Kitoblar (OfferBooks)
   - Albomlar (Albums)

2. **Public Database** - Umumiy ma'lumotlar:
   - Yangiliklar (News)
   - Ta'lim markazlari (EduCenters)
   - Ochiq testlar (PublicTests)
   - Faktlar (Facts)

## 🔐 Xavfsizlik

- JWT tokenlar asosida autentifikatsiya
- Parollar bcrypt yordamida hashlanadi
- Adminlar uchun email orqali 2FA (ikkki bosqichli tasdiqlash)
- API uchun rate limiting (har daqiqada 100 so'rov)
- CORS sozlamalari
- HTTP-only cookies

## 📅 Avtomatik Vazifalar (Cron Jobs)

Tizim quyidagi avtomatik vazifalarni bajaradi:

1. **Kunlik (har kuni soat 00:00)**:
   - 7 kundan oldgi shikoyatlarni o'chirish
   - 2 oydan beri tizimga kirmagan foydalanuvchilarni o'chirish
   - Muddati tugagan maktab litsenziyalariini bloklash

2. **Yillik (1-sentabr)**:
   - Barcha o'quvchilarning sinfini oshirish
   - 11-sinfni tugatgan o'quvchilarni o'chirish

## 🎯 Maqsadli Auditoriya

### 🏫 Maktablar
- **Direktorlar**: Maktabdagi o'quvchilarning bilim darajasini kuzatish
- **O'qituvchilar**: Testlar yaratish va o'quvchilarning natijalarini baholash
- **Administratorlar**: Tizimni boshqarish va statistikani kuzatish

### 👨‍🎓 O'quvchilar
- Bilimlarini mustahkamlash
- Jamoaviy musobaqalarda ishtirok etish
- Reytinglarda o'rnini ko'rish
- Sertifikatlar olish

### 🏢 Ta'lim Markazlari
- O'z markazlarini reklama qilish
- O'quvchilarga xizmat ko'rsatish
- Reytinglarda ko'rinib turish

## 💼 Marketing va Foydalanish

### Nega MUBR?

1. **Zamonaviy yondashuv**: An'anaviy test qog'ozlarini digitallashtirish
2. **Qulay foydalanish**: Har qanday qurilmadan (telefon, tablet, kompyuter) kirish mumkin
3. **Jamoa spiriti**: O'quvchilar jamoalarda ishlash o'rganadi
4. **Real vaqt statistikasi**: Natijalarni darhol ko'rish
5. **Motivatsiya**: Reytinglar va sertifikatlar orqali motivatsiya
6. **Xavfsizlik**: Ma'lumotlar to'liq himoyalangan

### Qanday yordam beradi?

**Maktablar uchun:**
- O'quvchilarning bilim darajasini obyektiv baholash
- Qog'oz va vaqtni tejash
- Avtomatik hisob-kitob
- Raqamli arxiv saqlash
- Ota-onalar bilan shaffof aloqa

**O'quvchilar uchun:**
- O'z bilimlarini sinash
- Qiziqarli musobaqalar
- Doimiy rivojlanish
- Sertifikatlar olish
- Jamoada ishlash ko'nikmalari

**Ta'lim tizimi uchun:**
- Digitallashtirishni qo'llab-quvvatlash
- Ma'lumotlarni tahlil qilish
- Sifatli ta'limni oshirish

## 📞 Aloqa

- **Muallif**: Jamshid Xamroyev
- **Loyiha**: MUBR
- **Hudud**: Uzun tumani

## 📄 Litsenziya

Bu loyiha ISC litsenziyasi ostida tarqatiladi.

## 🤝 Hissa qo'shish

Agar siz bu loyihaga hissa qo'shmoqchi bo'lsangiz:
1. Fork qiling
2. Feature branch yarating (`git checkout -b feature/AmazingFeature`)
3. Commit qiling (`git commit -m 'Add some AmazingFeature'`)
4. Push qiling (`git push origin feature/AmazingFeature`)
5. Pull Request yarating

## 📝 Eslatmalar

- Tizim hozirda faol rivojlanmoqda
- Yangi featurelar qo'shilmoqda
- Bug reportlarni qabul qilamiz
- Takliflarni kutib qolamiz

---

**MUBR** - Bilimni o'lchash oson! 🎓✨
