"use client";

import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DialogHeader } from "./ui/dialog";
import { useDeleteServerModal } from "@/hooks/use-delete-modal";
import { Button } from "./ui/button";
import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import qs from "query-string";
import toast from "react-hot-toast";

const DeleteServerModalProvider = () => {
    
    const useModal = useDeleteServerModal();
    const [loading, setLoading] = useState(false);
    const path = usePathname();
    const serverId = path.split("/")[2];
    const router = useRouter();
    
    // used for solving hydration errors
    const [isMounted, setIsMounted] = useState(false);
    useEffect(()=>{
        setIsMounted(true);
    },[]);
    if(!isMounted){
        return null;
    }
    
    const url = qs.stringifyUrl({
        url: `/api/servers/${serverId}`,
        query: {
            serverId,
        }
    })
    const deleteServer =async () => {
        setLoading(true);
        await axios.delete(url).then(response=>{
            if(response.status==200){
                toast.success("Server Deleted!");
                useModal.onClose();
                router.push("/");
            }
        }).catch(error=>{
            if(error.status==400){
                toast.error("Unauthorized");
            }
            setLoading(false);
        })
    }
    return ( 
        <div className="absolute">
            <Dialog open={useModal.isOpen} onOpenChange={useModal.onClose}>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your server
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex gap-x-2">
                        <Button onClick={()=>deleteServer()} variant="destructive" disabled={loading}>Delete <TrashIcon className="ml-2 w-4 fill-white"/></Button>
                        <Button onClick={()=>useModal.onClose()} disabled={loading}>Cancel</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        </div>
     );
}
 
export default DeleteServerModalProvider;