import { isEmail, isEmpty, isNumeric } from 'validator';
import { OTPDb } from "@/database/schemas/otp";
import Jwt from 'jsonwebtoken';

let AM = "POST";

async function checkInDB(email, otp) {

    try {

        await OTPDb.sync();

        const record = await OTPDb.findOne({ where: { email: email, otp: otp } })

        if (record) {

            await OTPDb.destroy({ where: { email: email } })

            return true
        }
        else {
            return false
        }

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

        const { email, otp } = req.body;

        if (!email || isEmpty(email)) {
            return res.status(405).json({ message: 'Enter an email' });
        }

        if (!isEmail(email)) {
            return res.status(405).json({ message: 'Enter a valid email' });
        }

        if (!otp || isEmpty(otp) || otp.length != 6) {
            return res.status(405).json({ message: 'Enter an OTP of 6 digits you received in the mail.' });
        }

        if (!isNumeric(otp)) {
            return res.status(405).json({ message: 'Enter a valid OTP' });
        }

        let check = await checkInDB(email, parseInt(otp))

        if (check) {
            const token = Jwt.sign({ email: email }, process.env.hospitalityToken, { expiresIn: '90d' });
            return res.status(201).json({ message: "Login successful", token: token });
        }

        res.status(405).json({ message: "Invalid email/otp. Please try again." });

    } catch (error) {

        return res.status(405).json({ message: "Please try after sometime." });
    }


}
