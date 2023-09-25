"use client";
import { Plus } from "lucide-react";
import Link from "next/link";

const CreateServer = () => {
    return ( 
        <Link href="/create-server">
            <div className="p-3 w-14 m-3 bg-secondary/10 flex flex-col justify-center items-center rounded-md cursor-pointer hover:bg-secondary/20">
                <Plus className="text-white"/>
            </div>
        </Link>
     );
}
 
export default CreateServer;