import prismadb from "@/lib/prismadb";
import { auth, clerkClient } from "@clerk/nextjs";
import {NextResponse} from "next/server";
export async function POST(
    req:Request
){
    const {userId} = await auth();
    const userData = await clerkClient.users.getUser(userId!);
    if(!userId){
        return new NextResponse("Unauthorized", {status:401})
    }
    
    const user = await prismadb.user.findUnique({where:{
        userId
    }})

    if(!user){
        await prismadb.user.create(
            {data:{
                userId,
                profileImageUrl:userData.imageUrl!,
                name: userData.firstName + " "+userData.lastName
            }}
        )
        return new NextResponse("User created", {status:200})
    }
    return new NextResponse("User already created", {status:200})
}