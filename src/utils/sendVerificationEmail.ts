import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail-template";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Aayush <onboarding@resend.dev>',
            to: [email], 
            subject: 'Anonymous-Chat | Verify your account',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { success: true, message: "verification email sent successfully" }
    } catch (emailError) {
        console.log("Error sending verification email:" + emailError);
        return { success: false, message: "failed to send verification email" }
    }
}