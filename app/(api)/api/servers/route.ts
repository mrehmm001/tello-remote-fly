import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(
    req:Request
){
    const body = await req.json();
    const {name, socket_url} = body.values;
    const {userId} = auth();
    
    if(!userId){
        return new NextResponse("Unauthorized", {status:400});
    }
    
    const server = await prismadb.server.findFirst({where:{
        name,
    }})
    
    if(!server){
        const server = await prismadb.server.create({
            data:{
                name,
                socket_url,
                ownerId:userId!,
                controllerUserId:""
            }
        })

        const servers = await prismadb.user.findUnique({
            where:{
                userId
            },
            select:{
                servers:true
            }
        });

        await prismadb.user.update({
            where:{
                userId
            },
            data:{
                servers:{
                    set: [...servers!.servers,server]
                }
            }
        });
        
        return new NextResponse("Server created", {status:200});
    }else{
        return new NextResponse("Server already created", {status:401});
    }
}


export async function GET(){
    const {userId} = auth();
    
    if(!userId){
        return new NextResponse("Unauthorized", {status:400});
    }

    const user = await prismadb.user.findUnique({
        where:{
            userId
        }
    })

    if(!user){
        return new NextResponse("Unauthorized", {status:400});
    }
    
    const servers = await prismadb.server.findMany({where:{
        OR:[
            { ownerId:userId},
            {users:{
                some:user!
            }}
        ]
    }})

    
    return NextResponse.json(servers || []);
}