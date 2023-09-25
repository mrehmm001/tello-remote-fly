import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
){
    const body = await req.json();
    const {inviteCode} = body;
    const {userId} = auth();

    if(!userId){
        return new NextResponse("Unauthorized", {status:401});
    }

    const user = await prismadb.user.findUnique({
        where:{
            userId
        }
    });

    if(!user){
        return new NextResponse("Unauthorized", {status:401});
    }

    const users = (await prismadb.server.findUnique({
        where:{
            inviteCode
        },
        select:{
            users:true
        }
    }))!.users;
    

    const server = await prismadb.server.findUnique({
        where:{
            inviteCode
        },
    });
    
    const hasUser = users.includes(user!);
    const serverId = server!.serverId;
    if(hasUser){
        return NextResponse.json({serverId:serverId},{status:200})
    }
    
    users.push(user!);
    // Add user to server
    await prismadb.server.update({
        where:{
            inviteCode
        },
        data:{
            users:{
                set:users
            }
        }
    });
    
    return NextResponse.json({serverId:serverId},{status:200})
}