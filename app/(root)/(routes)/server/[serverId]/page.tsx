"use client";

import ServerMenuDropdown from "@/components/server-menu-dropdown";
import VideoStream from "@/components/video-stream";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { server } from "@/lib/constants";
import { useUser } from "@clerk/nextjs";
import { AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import { ChevronDown, Copy, Crown, LogOut } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import gameController from "@/lib/gameController";

const ServerPage = () => {
    const [serverData, setServerData] =  useState({} as server);
    const path = usePathname();
    const serverId = path.split("/")[2];
    const router = useRouter();
    
    useEffect( ()=>{
        const url = qs.stringifyUrl({
            url: `/api/servers/${serverId}`,
            query: {
                serverId,
            }
        })

        axios.get(url).then((reponse)=>{
            setServerData(reponse.data);
            console.log("TEEEST",reponse.data)
            if(reponse.data.isOwner){
                gameController(reponse.data.socket_url||"");
            }
        }).catch(error=>{
            if(error.response.status==401 || error.response.status==404){
                toast.error("Unauthorized access");
                router.push("/");
            }
            console.log(error);
        }).finally(()=>{
            router.refresh();
        })
    }, [serverId,router]);

    const showSettings = ()=>{
        router.push(path+"/settings");
    }

    const leaveServer = ()=>{
        const url = qs.stringifyUrl({
            url: `/api/user/leave_server/${serverId}`,
            query: {
                serverId,
            }
        })

        axios.delete(url).then((reponse)=>{
            if(reponse.status==200){
                toast.success("Left server");
                router.push("/");
            }
        }).catch(error=>{
            console.log(error);
        })
    }

    const getInviteCode = () =>{
        navigator.clipboard.writeText(`/invite/${serverData.inviteCode}`);
        toast.success("Invite url copied to clipboard");
    }

    return ( 
        <div className="h-full w-full flex">
            <div className="w-72 h-full bg-primary/90">
                <ServerMenuDropdown serverData={serverData} getInviteCode={getInviteCode} leaveServer={leaveServer} showSettings={showSettings}/>
                <div className="w-full p-3">
                    <div className="w-full h-72 p-2 overflow-y-auto">
                        <h2 className="text-secondary mb-3">Members</h2>
                        {serverData && serverData.users && serverData.users.map(user=>(
                            <div key={user.userId} className="flex items-center gap-x-2 mb-2">
                                <Avatar>
                                    <AvatarImage src={user.profileImageUrl} />
                                    <AvatarFallback>
                                        {user?.name?.charAt(0)}
                                        {user?.name?.charAt(1)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-secondary/50">{user.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex w-full flex-col p-4 gap-y-2">
                <div className="w-full flex-[10] bg-primary/90 rounded-md">
                    <VideoStream socket_url={serverData.socket_url ? serverData.socket_url  : "" }/>
                </div>
                <div className="w-full flex-1 bg-primary/90 rounded-md p-3">
                        <div className="w-full h-fulrounded-md overflow-y-auto bg-white/80 h-full p-2 text-black">
                            <h2 className="text-secondary mb-3 flex flex-col text-black">Telemetry</h2>
                            <div className="text-xs px-1">
                                {">.."}
                            </div>
                        </div>
                </div>
            </div>
        </div>
     );
}
 
export default ServerPage;