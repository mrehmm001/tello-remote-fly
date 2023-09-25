import * as z from "zod";

export const formSchema = z.object({
    name: z.string().min(1,{
        message:"Name is required"
    }),
    socket_url: z.string().min(1,{
        message:"Ip is required"
    }),
});