//this is for when you want to show if username available when user is typing
import dbConnect from '../../../lib/dbConnect';
import { usernameValidation } from '../../../schemas/signUpSchema'
import { User } from '../../../model/User';

export async function GET(req: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);   //localhost:3000/api/cuu?username=aayush?ejhvg=evjb
        const queryParam = {
            username: searchParams.get('username')
        }
        const result = usernameValidation.safeParse(queryParam.username);
        if (!result.success) {
            console.log(result.error.format())
            const usernameErrors = result.error.format()._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'invalid query parameters'
            }, { status: 400 })
        }
        console.log(result.data)
        const username = result.data
        const existingVerifiedUser = await User.findOne({ username, isVerified: true })
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        } else {
            return Response.json({
                success: true,
                message: "username available"
            }, { status: 200 })
        }
    } catch (error) {
        console.log("Error in checking username:" + error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 })
    }
}