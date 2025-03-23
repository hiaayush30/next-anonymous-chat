import { MessageInterface } from "@/model/User";

//standardizing our api responses

export interface ApiResponse {
    success: boolean,
    message: string;
    isAcceptingMessages?: boolean
    messages ?: Array<MessageInterface>
}