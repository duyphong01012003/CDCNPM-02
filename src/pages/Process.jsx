import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useSelector } from 'react-redux';

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
        label: "Công việc con",
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
    const { user } = useSelector((state) => state.auth);
    const taskRole = linkData.filter((link) => link.label !== "Dự án");
    const taskRoleAdmin = linkData.filter((link) => link.label !== "Công việc con");

    const taskNav = user?.role === "NhanVien" ? taskRole : taskRoleAdmin;

    return (
        <div className='h-full bg-white !m-[20px] shadow-2xl rounded-2xl dark:bg-gray-900'>
            <div className='h-[800px] !p-[16px]'>
                <div className='flex items-center justify-between'>
                    {
                        taskNav.map((link, index) => (
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