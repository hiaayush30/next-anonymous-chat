import dbConnect from "@/lib/dbConnect";
import { MessageInterface, User } from "@/model/User";

export default async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, content } = await req.json();
        const user = await User.findOne({ username });
        if (!user || !user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "user not found or not accepting messages"
            }, { status: 404 })
        } else {
            const newMessage = {
                content,
                createdAt: new Date()
            }
            user.messages.push(newMessage as MessageInterface);
            await user.save();
            return Response.json({
                success: true,
                message: "message sent"
            }, { status: 200 })
        }
    } catch (error) {
        console.log("error in sending message:" + error);
        return Response.json({
            success: false,
            message: "message could not be sent"
        }, { status: 500 })
    }
}