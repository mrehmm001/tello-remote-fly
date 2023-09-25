"use client";

import { UserButton } from "@clerk/nextjs";
import CreateServer from "./create-server";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ServerButton from "./server-button";

interface server{
    createdAt:string,
    id:string,
    inviteCode:string,
    ip:string,
    name:string,
    ownerId:string,
    port:string,
    serverId:string,
}

const Sidebar = () => {
    const [servers, setServers] = useState([] as server[]);
    const router = useRouter()
    useEffect(()=>{
        axios.get("/api/servers").then(response=>{
            const data = response.data as server[];
            setServers(data);
        }).catch(error=>{
            console.log(error);
        }).finally(()=>{
            router.refresh();
        })
    },[router,]);

    return ( 
        <div className="h-full w-full bg-primary flex flex-col justify-between">
            <div className="flex flex-col">
                <CreateServer/>
                {servers.map(server=>(
                    <ServerButton key={server.id} serverCode={server.serverId} name={server.name}/>
                ))}
            </div>
            <div className="flex justify-center items-center mb-5">
                <UserButton afterSignOutUrl='/sign-in'/>
            </div>
        </div>
     );
}
 
export default Sidebar;