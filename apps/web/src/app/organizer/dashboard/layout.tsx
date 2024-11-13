import { AdminSidebar } from "@/components/sidebar/page";
import { ReactNode } from "react";

export default function DashboardLayout ({children}: any){
    return(
        <main className="flex">
            <div className="w-1/5 px-4">
                <AdminSidebar/>
            </div>
          
            <div className="w-4/5 ">
                {children}
            </div>
        </main>
    )
}