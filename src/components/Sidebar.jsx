import React from 'react';
import {
    IoIosHome,
    IoMdDocument,
    IoMdPeople,
    IoMdTrendingUp,
    IoIosContact,
    IoMdBusiness,
    IoIosArrowForward,
} from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { setOpenSidebar } from '../redux/slices/authSlice';
import clsx from "clsx";

const linkData = [
    {
        label: "Trang chủ",
        link: "home",
        icon: <IoIosHome size={24} style={{ color: "rgba(28, 167, 86, 1)" }} />,
    },
    {
        label: "Quản lí tài liệu",
        link: "document",
        icon: <IoMdDocument size={24} style={{ color: "rgba(28, 167, 86, 1)" }} />,
    },
    {
        label: "Quản lí nhân viên",
        link: "employee",
        icon: <IoMdPeople size={24} style={{ color: "rgba(28, 167, 86, 1)" }} />,
    },
    {
        label: "Quản lí công việc",
        link: "process",
        icon: <IoMdTrendingUp size={24} style={{ color: "rgba(28, 167, 86, 1)" }} />,
    },
    {
        label: "Quản lí tài khoản",
        link: "user",
        icon: <IoIosContact size={24} style={{ color: "#1ca756" }} />,
    },
];

const Sidebar = () => {
    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const location = useLocation();


    const path = location.pathname.split("/")[1];
    const sideRole = linkData.filter(link => link.label !== "Quản lí tài khoản")

    const sidebarLinks = user?.role === "NhanVien" ? sideRole : linkData;


    const closeSidebar = () => {
        dispatch(setOpenSidebar(false));
    };

    const NavLink = ({ link }) => {
        return (
            <Link
                to={link.link}
                onClick={closeSidebar}
                className={clsx(
                    "w-full flex gap-2 justify-between rounded-full items-center text-[#464646] text-base hover:bg-[#1ca7562e] !pl-[30px] !py-[16px] ",
                    path === link.link.split("/")[0] ? "bg-green-200 text-neutral-100 dark:bg-[#1ca7562e]" : ""
                )}
            >
                <div className='flex items-center gap-x-2'>
                    {link.icon}
                    <span className='hover:text-[#1ca756] text-[#464646] dark:text-white'>{link.label}</span>
                </div>
                <IoIosArrowForward style={{ color: "rgba(70, 70, 70, 1)" }} />
            </Link>
        )
    }
    return (
        <div className='w-full h-full flex flex-col gap-18 p-5'>
            <h1 className='flex gap-2 items-center !pt-[50px] !pl-[30px]'>
                <p className='bg-[#1CA756] p-2 rounded-full'>
                    <IoMdBusiness color='white' size={30} />
                </p>
                <span className='text-2xl font-bold text-[#1CA756]'>Quản lí doanh nghiệp</span>
            </h1>
            <div className='flex-1 flex flex-col'>
                {
                    sidebarLinks.map((link) => (
                        <NavLink link={link} key={link.label} />
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar