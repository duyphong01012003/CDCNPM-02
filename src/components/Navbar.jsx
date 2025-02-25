import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NotificationPanel from './NotificationPanel';
import UserAvatar from './UserAvatar';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    return (
        <div className='flex justify-end items-center bg-white !pr-[32px] !py-[18px] sticky z-10 top-0'>
            <div className='flex gap-6 items-center'>
                <NotificationPanel />

                <UserAvatar />
            </div>
        </div>
    )
}

export default Navbar