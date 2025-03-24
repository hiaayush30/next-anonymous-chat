import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "@/model/User";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;

        if (!session || !user) {
            return Response.json({
                success: false,
                message: "Not Authenticated"
            }, { status: 401 })
        }
        const userId = user._id;
        const { acceptMessages } = await req.json();

        const updatedUser = await User.findByIdAndUpdate(userId, {
            isAcceptingMessages: acceptMessages
        }, { new: true })
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to update user accpeint messages status"
            }, { status: 400 })
        }
        else {
            return Response.json({
                success: true,
                message: "accepting message status updated successfully"
            }, { status: 200 })
        }
    } catch (error) {
        console.log("error in accept-message:" + error);
        return Response.json({
            success: false,
            message: "Error in toggling accept message"
        }, { status: 500 })
    }
}

export async function GET(req: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;
        if (!session || !user) {
            return Response.json({
                success: false,
                message: "Not Authenticated"
            }, { status: 401 })
        } else {
            const foundUser = await User.findOne({ _id: user._id });
            if (!foundUser) {
                Response.json({
                    success: false,
                    message: "user not found"
                }, { status: 400 })
            } else {
                Response.json({
                    success: true,
                    isAcceptingMessages: foundUser.isAcceptingMessages,
                    message: "accepting-messages status fetched"
                }, { status: 200 })
            }
        }
    } catch (error) {
        console.log("error in getting accept-messages:" + error);
        Response.json({
            success: false,
            message: "Error in getting status"
        }, { status: 500 })
    }
}