import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { User } from "@/model/User";

export default async function GET() {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;
        if (!session || !user) {
            return Response.json({
                success: false,
                message: "not authenticated"
            }, { status: 401 })
        }
        const userId = new mongoose.Types.ObjectId(user._id);
        //in aggregation convert string to object id first as it can give errors
        const userMessages = await User.aggregate([
            { $match: { id: userId } },
            { $unwind: "$messages" },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])
        if (!userMessages) {
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 400 })
        }
        else {
              return Response.json({
                success:true,
                messages:userMessages[0].messages
              }) 
        }
    } catch (error) {
        console.log("error in get-messages:" + error);
        return Response.json({
            success: false,
            message: "Error in gettting messages"
        }, { status: 500 })
    }

}