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

const Message = mongoose.model<MessageInterface>('message', messageSchema);

export interface UserInterface extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified:boolean;
    isAccepting: boolean;
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
    isAccepting:{
        type:Boolean,
        default:true
    },
    messages:[messageSchema]
})

export const User = mongoose.models.User as mongoose.Model<UserInterface> || mongoose.model<UserInterface>('User',userSchema);
//check if User is created or not in db and if not then create

