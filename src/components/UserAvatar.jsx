import React, { useState, Fragment } from 'react';
import { FaUser, FaUserLock } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';


const UserAvatar = () => {
    const [open, setOpen] = useState(false);
    const [openPassword, setOpenPassword] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        console.log("logout");
    };

    return (
        <>
            <div>
                <Menu as='div' className="relative inline-block text-left">
                    <div>
                        <MenuButton className='flex items-center gap-x-2 cursor-pointer'>
                            <div class="w-[30px] h-[30px] rounded-full overflow-hidden">
                                <img src="https://via.placeholder.com/30" alt="Avatar" class="w-full h-full object-cover" />
                            </div>
                            <span className='text-[#4A4A4A]'>{user?.name}</span>
                            <IoIosArrowDown style={{ color: "rgba(70, 70, 70, 1)" }} />
                        </MenuButton>
                    </div>
                    <Transition
                        as={Fragment}
                        enter='transition ease-out duration-100'
                        enterFrom='transform opacity-0 scale-95'
                        enterTo='transform opacity-100 scale-100'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform opacity-100 scale-100'
                        leaveTo='transform opacity-0 scale-95'
                    >
                        <MenuItems className='absolute right-0 mt-2 w-56 origin-top-right divide-gray-100 rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none'>
                            <div className='!px-[8px] !py-[8px]'>
                                <MenuItem className='!pb-[8px] cursor-pointer'>
                                    {({ active }) => (
                                        <button
                                            onClick={() => setOpen(true)}
                                            className='text-gray-700 group flex w-full items-center rounded-md gap-2 text-base'
                                        >
                                            <FaUser className='mr-2' aria-hidden='true' />
                                            Profile
                                        </button>
                                    )}
                                </MenuItem>
                                <MenuItem className='cursor-pointer'>
                                    {({ active }) => (
                                        <button
                                            onClick={logoutHandler}
                                            className={`text-red-600 group flex w-full items-center rounded-md gap-2 text-base`}
                                        >
                                            <IoLogOutOutline className='mr-2' aria-hidden='true' />
                                            Logout
                                        </button>
                                    )}
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </Transition>
                </Menu>
            </div>
        </>
    )
}

export default UserAvatar