import { useState,useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import { ToastContainer } from 'react-toastify';
import Tostadas from "../zSharedComponents/Tostadas";

const AdminAddUsers = () => {

    return (
        <div className="flex">
            <div className="fixed top-0 left-0 w-72 h-screen">
                <AdminSidebar />
            </div>
            
        </div>
    );

};

export default AdminAddUsers;