import {z} from 'zod';

export const signInSchema = z.object({
    identifier:z.string(),
    //identifier is frequently used instead on email or username in production
    password:z.string()
})