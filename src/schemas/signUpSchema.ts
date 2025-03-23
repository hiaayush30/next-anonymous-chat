import { z } from 'zod';

export const usernameValidation = z
.string()
.min(2,"username must be atleast of 2 characters")
.max(20,"username must not exceed 20 characters")
.regex(/^[a-zA-Z0-9_]+$/,"username can only have letters,0-9 and _ as characters")

export const signUpSchema = z.object({
   username:usernameValidation,
   email:z.string().email({message:"invalid email address"}),
   password:z.string().min(3,{message:"password must have atleast 3 characters"}) 
})