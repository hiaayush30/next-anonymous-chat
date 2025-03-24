import dbConnect from "@/lib/dbConnect";
import { User } from "@/model/User";


export default async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, code } = await req.json();
        const decodedUsername = decodeURIComponent(username); //gets the unencoded version like removes %20 for spaces etc
        const user = await User.findOne({
            username: decodedUsername
        })
        if (!user) {
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 400 })
        } else {
            if (Number(user.verifyCodeExpiry) < Date.now()) {
                return Response.json({
                    success: false,
                    message: "verification code expired, please register again"
                }, { status: 400 })
            }
            else if (user.verifyCode !== code) {
                return Response.json({
                    success: false,
                    message: "incorrect verification code"
                }, { status: 400 })
            } 
            else {
                user.isVerified = true;
                await user.save();
                return Response.json({
                    success: false,
                    message: "user verified successfully"
                }, { status: 200 })
            }
        }
    } catch (error) {
        console.log("Error verifying user:" + error);
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, { status: 500 })
    }
}