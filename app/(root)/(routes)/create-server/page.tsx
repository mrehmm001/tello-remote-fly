"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { formSchema } from "./constants"
import Header from "@/components/header"
import axios from "axios";
import toast from "react-hot-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateServer() {
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
            defaultValues:{
                name:"",
                socket_url:""
            }
    });

    const onSubmit = async (values:z.infer<typeof formSchema>)=>{
        setLoading(true);
        console.log("test")
        await axios.post("/api/servers",{values}).then(response=>{
            if(response.status==200){
                toast.success("Server created!");
                form.reset();
            }
        }).catch(error=>{
            if(error.status==400){
                toast.error("Unauthorized");
            }
            if(error.status==401){
                toast.error("Server already exists");
            }
            setLoading(false);
            console.log(error)
        }).finally(()=>{
            setLoading(false);
        });
    }


  return (
    <div className="px-10 max-w-2xl">
        <Header
            title="ADD SERVER"
            description="Add your drone server here"
        />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-white">Server name</FormLabel>
                        <FormControl>
                            <Input placeholder="name" {...field} />
                        </FormControl>
                        <FormDescription className="text-white/80">
                            Enter the drone server name
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                name="socket_url"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-white">Socket url</FormLabel>
                    <FormControl>
                        <Input placeholder="ws://" {...field} />
                    </FormControl>
                    <FormDescription className="text-white/80">
                        Enter the drone server websocket address
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button disabled={loading} type="submit">Submit</Button>
            </form>
        </Form>
    </div>
  )
}
