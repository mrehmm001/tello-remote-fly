import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { server } from "@/lib/constants";
import { useUser } from "@clerk/nextjs";
import { ChevronDown, Copy, LogOut } from "lucide-react";

interface props{
    serverData:server,
    showSettings: ()=>void;
    getInviteCode: ()=>void;
    leaveServer: ()=>void;
}

const ServerMenuDropdown = ({serverData,showSettings,getInviteCode,leaveServer}:props) => {
    const user = useUser();
    return ( 
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
                <div className="w-full bg-primary/50 hover:bg-primary/30 cursor-pointer p-2 flex items-center text-white justify-between px-4">
                    <h1 className="text-xl">{serverData.name}</h1>
                    <ChevronDown className="text-xl"/>
                </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52 text-secondary border-none bg-primary">
            {serverData.isOwner && (
                <div>
                    <DropdownMenuItem onClick={()=>showSettings()}>Server settings</DropdownMenuItem>
                    <DropdownMenuSeparator className="" />
                </div>
            )}
            <DropdownMenuItem onClick={()=>getInviteCode()}>Get invite code<Copy className="text-white-700 w-4 ml-auto" /></DropdownMenuItem>
            <DropdownMenuSeparator className="" />
            <DropdownMenuItem onClick={()=>leaveServer()}>Leave server <LogOut className="text-red-700 w-4 ml-auto" /></DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
     );
}
 
export default ServerMenuDropdown;