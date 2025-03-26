import dbConnect from "@/lib/dbConnect";
import { User } from "@/model/User";
import bcrypt from 'bcrypt';

import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const { username, email, password } = await req.json();
        const usernameExisting = await User.findOne({
            username,
            isVerified: true
        });
        if (usernameExisting) {
            return NextResponse.json({
                success: false,
                message: "Username taken"
            }, { status: 400 })
        }
        const exisitngUserByEmail = await User.findOne({ email });
        const verifyCode = Math.floor(Math.random() * 100000 + 100000).toString();
        if (exisitngUserByEmail) {
            if (exisitngUserByEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "email already registered"
                })
            } else {
                const hashedPassword = bcrypt.hashSync(password, 10);
                exisitngUserByEmail.password = hashedPassword;
                exisitngUserByEmail.verifyCode = verifyCode;
                exisitngUserByEmail.verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);
                await exisitngUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            await User.create({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate
            })
        }
        //send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        console.log(emailResponse);
        if (!emailResponse.success) {
            return NextResponse.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        } else {
            return NextResponse.json({
                success: true,
                message: "user registered successfully.Please verify your email"
            }, { status: 201 })
        }
    } catch (error) {
        console.log("Error registering user:" + error);
        return NextResponse.json({
            success: false,
            message: "Error in registering user"
        }, {
            status: 500
        })
    }
}