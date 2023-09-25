"use client";

import Sidebar from "@/components/sidebar"
import axios from "axios";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(()=>{
    axios.post("/api/user/add_user")
    .then(data=>{
      console.log(data)
      if(data.status==200){
        console.log("User is verified!")
      }
    })
    .catch(error=>{
      console.log(error);
    })
}, []);
  return (
    <div className="h-full">
      <div className="hidden md:flex w-20 flex-col fixed inset-y-0">
        <Sidebar/>
      </div>
      <main className="md:pl-20 h-full bg-primary/80">
        {children} 
      </main>
    </div>
  )
}
