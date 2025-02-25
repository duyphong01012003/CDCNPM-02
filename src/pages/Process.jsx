import React from 'react'
import { MdOutlineSearch } from "react-icons/md";
import { IoIosAdd, IoMdTrash } from "react-icons/io";
import { IoCloseSharp, IoEyeOutline, IoSad } from "react-icons/io5";
import { HiOutlinePencil } from "react-icons/hi2";
import { motion } from "framer-motion";
import Date from "../components/Datepicker"
import { Link, Outlet, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const linkData = [
    {
        label: "Nhóm dự án",
        link: "groups",
    },
    {
        label: "Dự án",
        link: "projects",
    },
    {
        label: "Công việc",
        link: "task",
    },
    {
        label: "Tiến độ công việc",
        link: "progress",
    },
];

const NavLink = ({ link }) => {
    const location = useLocation();
    const path = location.pathname.split("/")[2];

    return (
        <Link
            to={link.link}
            className={clsx("w-full text-[#464646] text-base hover:bg-[#1ca7562e]")}
        >
            <div
                className={clsx(
                    "text-center border-t !py-[10px] transition-all duration-300 ease-in-out",
                    path === link.link ? "border-[#1ca756] shadow-md shadow-[#1ca756]/50" : "border-[#C7C7CC] hover:border-[#1ca756] hover:shadow-md hover:shadow-[#1ca756]/50"
                )}
            >
                <span
                    className={clsx(
                        "transition-all duration-300 ease-in-out",
                        path === link.link ? "text-[#1ca756]" : "text-[#4B5563] hover:text-[#1ca756]"
                    )}
                >
                    {link.label}
                </span>
            </div>
        </Link>
    )
}
const Process = () => {
    return (
        <div className='h-full bg-white !m-[20px] shadow-2xl rounded-2xl'>
            <div className='h-[800px] !p-[16px]'>
                <div className='flex items-center justify-between'>
                    {
                        linkData.map((link, index) => (
                            <NavLink link={link} key={index} />
                        ))
                    }
                </div>
                <Outlet />
            </div>
        </div>
    )
}

export default Process