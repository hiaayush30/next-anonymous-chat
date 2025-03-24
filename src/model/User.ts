import mongoose, { Document } from 'mongoose';

export interface MessageInterface extends Document {
    content: string;
    createdAt: Date;
}

const messageSchema = new mongoose.Schema<MessageInterface>({
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

export interface UserInterface extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified:boolean;
    isAcceptingMessages: boolean;
    messages: MessageInterface[]
}

const userSchema = new mongoose.Schema<UserInterface>({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'please use a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    verifyCode: {
        type: String,
        required:true
    },
    verifyCodeExpiry:{
        type:Date,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true
    },
    messages:[messageSchema]
})

//check if User is created or not in db and if not then create
export const User = mongoose.models.User as mongoose.Model<UserInterface> || mongoose.model<UserInterface>('User',userSchema);
export const Message = mongoose.models.Message as mongoose.Model<MessageInterface> || mongoose.model<MessageInterface>('Message',userSchema);
