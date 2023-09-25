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
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import qs from "query-string"
import { server } from "@/lib/constants"
import { TrashIcon } from "lucide-react"
import { useDeleteServerModal } from "@/hooks/use-delete-modal"

export default function ServerSettings() {
    const [loading, setLoading] = useState(false);
    const path = usePathname();
    const serverId = path.split("/")[2];
    const router = useRouter();
    const useModal = useDeleteServerModal();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
            defaultValues:{
                name:"",
                socket_url:"",
            }
    });
    
    const url = qs.stringifyUrl({
        url: `/api/servers/${serverId}`,
        query: {
            serverId,
        }
    })
    useEffect( ()=>{

        axios.get(url).then((response)=>{
            form.setValue("name",response.data.name)
            form.setValue("socket_url",response.data.socket_url)
        }).catch(error=>{
            console.log(error);
        })
    }, [url, form]);



    const onSubmit = async (values:z.infer<typeof formSchema>)=>{
        setLoading(true);
        await axios.patch(`/api/servers/${serverId}`,{...values,serverId}).then(response=>{
            if(response.status==200){
                toast.success("Server Updated!");
            }
        }).catch(error=>{
            if(error.status==400){
                toast.error("Unauthorized");
            }
            setLoading(false);
        }).finally(()=>{
            setLoading(false);
        });
    }

    const deleteServer =async () => {
        useModal.onOpen();
    }


  return (
    <div className="px-10 max-w-2xl">
        <Header
            title="SERVER SETTINGS"
            description="Change your server settings here"
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
                        Enter the drone websocket address
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="flex gap-x-2">
                    <Button disabled={loading} type="submit">Update</Button>
                    <Button type="button" onClick={()=>deleteServer()} variant="destructive" disabled={loading}>Delete <TrashIcon className="ml-2 w-4 fill-white"/></Button>
                </div>
            </form>
        </Form>
    </div>
  )
}
