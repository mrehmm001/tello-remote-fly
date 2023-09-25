import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    req:Request,
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

    const users = await prismadb.server.findUnique({
        where:{
            serverId
        },
        select:{
            users:true
        }
    });

    if(!users){
        return new NextResponse("No users in server", {status:400});
    }
    
    const server = await prismadb.server.findUnique({
        where:{
            serverId
        },
        select:{
            socket_url:true,
            name:true,
            ownerId:true,
            inviteCode:true,
            users:true
        }
    });

    const serverResponseData = {
        socket_url:server?.socket_url,
        name: server?.name,
        isOwner: server?.ownerId==userId,
        inviteCode: server?.inviteCode,
        users: server?.users
    }

    
    
    const hasUser = users.users.filter(user=>user.userId==userId);

    if(server?.ownerId!==userId && hasUser.length===0){
        return new NextResponse("Unauthorized", {status:401});
    }

    return NextResponse.json(serverResponseData, {status:200});
}

export async function PATCH(
    req:Request
){
    const { searchParams } = new URL(req.url);
    const body = await req.json();
    const {name, socket_url, serverId} = body;
    const {userId} = auth();

    console.log("SERVER ID ", body)

    if(!userId){
        return new NextResponse("Unauthorized", {status:401});
    }
    
    if(!serverId){
        return new NextResponse("No server code", {status:404});
    }

    await prismadb.server.update({
        where:{
            serverId
        },
        data:{
            name,
            socket_url
        }
    });

    return new NextResponse("Server deleted", {status:200});
}

export async function DELETE(
    req:Request
){
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const {userId} = auth();

    console.log("serverID ",serverId)

    if(!userId){
        return new NextResponse("Unauthorized", {status:401});
    }
    
    if(!serverId){
        return new NextResponse("No server code", {status:404});
    }

    await prismadb.server.delete({
        where:{
            serverId
        }
    });

    return new NextResponse("Server deleted", {status:200});
}