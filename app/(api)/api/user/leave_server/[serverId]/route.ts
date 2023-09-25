import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
    req:Request
){
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const {userId} = auth();

    if(!userId){
        return new NextResponse("Unauthorized", {status:401});
    }
    
    if(!serverId){
        return new NextResponse("No server code", {status:404});
    }

    const data = await prismadb.server.findUnique({
        where:{
            serverId
        },
        select:{
            users:true,
            ownerId:true,
        }
    });

    if(!data){
        return new NextResponse("No users in server", {status:400});
    }

    data.users = data.users.filter(user=>user.userId!==userId)

    if(userId==data.ownerId || (userId==data.ownerId && !data.users)){
        await prismadb.server.delete({
            where:{
                serverId
            }
        });
        return new NextResponse("Server has been removed", {status:200});
    }

    // Remove user from server
    await prismadb.server.update({
        where:{
            serverId
        },
        data:{
            users:{
                set: data.users
            }
        }
    });

    return new NextResponse("User removed", {status:200});
}