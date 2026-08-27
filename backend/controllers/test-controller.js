const siteModel = require("../models/site-model")
const testModel = require("../models/test-model")
const userModel = require("../models/user-model")
const teamModel = require("../models/team-model")
const notificationModel = require("../models/notification-model")
const _ = require("lodash")
const { faker } = require('@faker-js/faker');

class TestController {
    async Create(req, res){
        try {
            const { site } = req
            const data = req.body

            const getSite = await siteModel.findById(site)
            if(!getSite){
                return res.status(400).json({ok: false, message: "Maktabingiz aniqlanmadi! Iltimos qayta tizimga kiring!"})
            }

            if(!data){
                return res.status(400).json({ok: false, message: "Siz barcha kataklarni o'ldirmadingiz!"})
            }

            if(data.questions.length < 2){
                return res.status(400).json({ok: false, message: "Siz 10 donadan kam test joylay olmaysiz!"})
            }

            const test = await testModel.create(data)
            if(!test){
                return res.status(400).json({ok: false, message: "Xatolik yuzaga keldi! Iltimos qayta urinib ko'ring!"})
            }  

            const notif = await notificationModel.create({description: `Assolomu Aleykum! Bugun ${new Date(test.createdAt).toISOString()} kuni ${test.forClass}-sinflar uchun yangi test yaratilindi! Siz ushb testni ishlashingiz mumkin!`})

            getSite.tests.push(test._id)
            await getSite.save()
            res.json({ok: true, message: "Yangi test yaratilindi!"})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }

    async Delete(req, res){
        try {
            const { test } = req.params
            const { site } = req

            const getSite = await siteModel.findById(site)
            if(!getSite){
                return res.status(400).json({ok: false, message: "Maktab aniqlanmadi! Iltimos qayta tizimga kiring!"})
            }

            const getTest = await testModel.findByIdAndDelete(test)
            if(!getTest){
                return res.status(400).json({ok: false, message: "Xatolik yuz berdi! Iltimos keyinroq urinib ko'ring"})
            }

            getSite.tests = getSite.tests.filter(t => t._id.toString() != test)
            await getSite.save()
            res.json({ok: true, message: "Test o'chirib tashlandi!"})
        } catch (error) {
            res.status(400).json({ok: false, message: error.message})
        }
    }


    async GetAll(req, res) {
        try {
            const { site, user } = req;

            const getUser = await userModel.findById(user);
            if (!getUser) {
                return res.status(400).json({ ok: false, message: "Foydalanuvchi aniqlanmadi!" });
            }

            const getSite = await siteModel.findById(site).populate("tests");

            const userClassNumber = parseInt(getUser.userClassNumber);
            const responseTests = getSite.tests
            .filter(test => test.forClass)
            .filter(test => {
                const [from, to] = test.forClass.split("-").map(Number);
                return userClassNumber >= from && userClassNumber <= to;
            })
            // .filter(test => !getUser?.lastTests?.includes(String(test._id)))
            .map(test => ({
                _id: test._id,
                forClass: test.forClass,
                testType: test.testType
            }));

            if (responseTests.length === 0) {
                return res.status(404).json({
                    message: `Siz uchun hozircha mos testlar topilmadi yoki allaqachon yechilgan.`,
                });
            }
            return res.json({ ok: true, message: "Mos testlar olindi!", data: responseTests });
        } catch (error) {
            res.status(400).json({ ok: false, message: error.message });
        }
    }
    
    async GetOne(req, res) {
        try {
            const { site, user } = req;
            const testId = req.params.test;
    
            const getSite = await siteModel.findById(site).populate("tests");
            if (!getSite) {
                return res.status(404).json({ ok: false, message: "Sayt topilmadi!" });
            }
    
            const getUser = await userModel.findById(user);
            if (!getUser) {
                return res.status(404).json({ ok: false, message: "Foydalanuvchi topilmadi!" });
            }
    
            const test = getSite.tests.find(t => t._id.toString() == testId);
            if (!test) {
                return res.status(404).json({ ok: false, message: "Test topilmadi!" });
            }
    
            // const isCompleted = getUser.lastTests.some(t => t._id.toString() === testId);
            // if (isCompleted) {
            //     return res.status(403).json({ ok: false, message: "Bu testni allaqachon bajargansiz!" });
            // }
    
            const shuffledQuestions = _.shuffle(
                test.questions.map(q => ({
                    _id: q._id,
                    name: q.name,
                    answers: _.shuffle(
                        q.answers.map(a => ({ name: a.name, _id: a._id }))
                    )
                }))
            );
    
            return res.json({
                ok: true,
                test: {
                    _id: test._id,
                    testType: test.testType,
                    forClass: test.forClass,
                    questions: shuffledQuestions
                }
            });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ ok: false, message: error.message });
        }
    }

    async CheckTest(req, res){
        try {
            const { site, user } = req;
            const testId = req.params.test;
            const  answers  = req.body;
    
            if (!answers || !Array.isArray(answers)) {
                return res.status(400).json({ ok: false, message: "Javoblar to'g'ri formatda emas!" });
            }
    
            const test = await testModel.findById(testId);
            if (!test) {
                return res.status(404).json({ ok: false, message: "Test topilmadi!" });
            }

            
            const getUser = await userModel.findById(user);
            if (!getUser) {
                return res.status(404).json({ ok: false, message: "Foydalanuvchi topilmadi!" });
            }
    
            let correct = 0;
            let total = test.questions.length;
    
            for (const q of test.questions) {
                const userAnswer = answers.find(a => a.questionId === q._id.toString());
                if (userAnswer) {
                    const foundAnswer = q.answers.find(ans => ans._id.toString() === userAnswer.answerId);
                    if (foundAnswer && foundAnswer.okay === true) {
                        correct += 0.7;
                    }
                }
            }

            correct = Math.round(correct)
    
            const alreadyDone = getUser.lastTests.some(t => t._id.toString() === testId);
            if (!alreadyDone) {
                getUser.lastTests.push(test._id);
                await getUser.save();
            }

            getUser.balls += correct
            await getUser.save()
            const team = await teamModel.findById(getUser.userTeam)
            if(team){
                team.balls += correct
                await team.save()
            }
    
            return res.json({
                ok: true,
                total,
                correct: Math.round(correct / 0.7).toFixed(0),
                incorrect: Math.round(total - (correct / 0.7)).toFixed(0),
                percentage: Math.round((((correct / 0.7) / total) * 100).toFixed(2))
            });
        } catch (error) {
            res.status(400).json({ ok: false, message: error.message });
        }
    }

    async GetAllAdmin(req, res){
        try {
            const { site } = req;
            const getSite = await siteModel.findById(site).populate("tests");
            return res.json({ ok: true, message: "Barcha testlar olindi!", data: getSite.tests });
        } catch (error) {
            res.status(400).json({ok: false, message: error.response.data.message})
        }
    }
}

module.exports = new TestController()