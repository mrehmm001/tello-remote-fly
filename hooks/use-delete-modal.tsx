import {create} from "zustand";

interface useDeleteServerModalStore {
    isOpen:boolean;
    onOpen: ()=>void;
    onClose: ()=>void;
}

export const useDeleteServerModal = create<useDeleteServerModalStore>((set)=>({
    isOpen:false,
    onOpen:()=>set({isOpen:true}),
    onClose:()=>set({isOpen:false})
}))