import {z} from 'zod';

export const signInSchema = z.object({
    email:z.string(),
    //identifier is frequently used instead on email or username in production
    password:z.string()
})