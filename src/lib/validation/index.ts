// import { Tag } from "lucide-react"
import { z } from "zod"
// import { zodResolver } from "@hookform/resolvers/zod"

export const SignupValidation = z.object({
    name: z.string().min(2, {message: "Too Short"}).max(50),
    username: z.string().min(2).max(50),
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(8, {message: "Password must be at least  characters"}),
})

export const SigninValidation = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(8, {message: "Password must be at least  characters"}),
})

export const PostValidation = z.object({
    caption : z.string().min(5).max(2200),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(100),
    tags: z.string(),
})


