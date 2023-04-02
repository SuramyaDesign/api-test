import nodemailer from "nodemailer"
import { isEmail, isEmpty } from 'validator';
import { OTPDb } from "@/database/schemas/otp";

let AM = "POST";

async function sendOTP(email, otp) {

    let transporter = nodemailer.createTransport({
        host: "smtp.hostinger.in",
        port: 587,
        secure: false,
        auth: {
            user: "donotreply@suramya.co",
            pass: "jOXI4-iqYOTdG$k+",
        },
    });

    var text = "Here is your OTP for login with Suramya:"

    let info = await transporter.sendMail({
        from: 'Suramya Login OTP <donotreply@suramya.co>',
        to: email,
        subject: "Login OTP",
        html: text + ` <b style='font-size:22'>${otp}<b>`,
    });

    if (info.accepted.length > 0) {
        return true
    } else {
        return false
    }

}

async function addOtpToDB(email, otp) {

    try {

        await OTPDb.sync();

        const record = await OTPDb.findOne({ where: { email: email } })

        if (record) {
            await OTPDb.update({ otp }, { where: { email: email } })
        } else {
            await OTPDb.create({ email, otp })
        }

        return true

    } catch (error) {

        console.log(error)

        return false
    }


}

export default async function handler(req, res) {

    try {

        if (req.method != AM) {
            return res.status(405).json({ message: 'Method not allowed' });
        }

        const { email } = req.body;

        if (!email || isEmpty(email)) {
            return res.status(405).json({ message: 'Enter an email' });
        }

        if (!isEmail(email)) {
            return res.status(405).json({ message: 'Enter a valid email' });
        }

        const OTP = Math.floor(Math.random() * 900000) + 100000;
        await addOtpToDB(email, OTP)
        sendOTP(email, OTP)

        res.status(201).json({ message: "Check your email address for OTP." });

    } catch (error) {

        return res.status(405).json({ message: "Please try after sometime." });

    }


}
