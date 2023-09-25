import { Plus } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { getURL } from "next/dist/shared/lib/utils";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface props{
    serverCode:string,
    name:string,
}

const ServerButton = ({serverCode, name}:props) => {
    const splitName = name.split(" ");
    let initials = "";
    if(splitName.length>1){
        initials = splitName.map(i=>[i[0].toUpperCase()]).join("");
    }else{
        initials = name.substring(0,2).toUpperCase();
    }
    const pathName = usePathname();
    const isOnUrl = pathName == `/server/${serverCode}`;
    return ( 
        <Link href={`/server/${serverCode}`}>
            <Tooltip>
                <TooltipTrigger>
                    <div className={cn("p-3 w-14 m-3 relative bg-secondary/10 before:hover:bg-white before:right-16 before:hover:h-10 before:hover:w-2 before:absolute before:rounded-md before:animate-in flex flex-col justify-center items-center rounded-md cursor-pointer hover:bg-secondary/20", isOnUrl && "before:bg-white before:h-10 before:w-2")}>
                        <h1 className="text-2xl font-semibold text-white">{initials}</h1>
                    </div>
                    <TooltipContent side="right" className="bg-primary text-white border-0 z-50">
                        <p>{name}</p>
                    </TooltipContent>
                </TooltipTrigger>
            </Tooltip>
        </Link>
     );
}
 
export default ServerButton;