import {z} from 'zod';

export const messageSchema = z.object({
    content:z.string().min(10,{message:"Content must have alteast 10 characters"}).max(300)
})