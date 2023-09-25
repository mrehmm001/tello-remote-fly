"use client";

import axios from "axios";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const InviteLinkPage = () => {
    const path = usePathname();
    const inviteCode = path.split("/")[2];
    const router = useRouter();
    useEffect(()=>{
        axios.post(`/api/user/join_server/${inviteCode}`, {inviteCode}).then(reponse=>{
            if(reponse.status==200){
                const {serverId} = reponse.data
                router.replace(`/server/${serverId}`)
            }
        }).catch(error=>{
            console.log(error);
        })
    },[inviteCode, router]);
    return ( 
        <div>
        </div>
     );
}
 
export default InviteLinkPage;