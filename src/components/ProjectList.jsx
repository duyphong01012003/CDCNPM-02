import React, { useState } from 'react'
import { MdOutlineSearch } from 'react-icons/md'
import { IoIosAdd, IoMdTrash } from "react-icons/io";
import { IoCloseSharp, IoEyeOutline, IoSad } from "react-icons/io5";
import { HiOutlinePencil } from "react-icons/hi2";
import { motion } from "framer-motion";
import Date from "../components/Datepicker"

const DocumentTable = ({ displayedItems, startIndex }) => {
    const [isModalSeenOpen, setIsModalSeenOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [disable, setDisable] = useState(false);


    const handleViewDetails = (group) => {
        setSelectedGroup(group);
        setIsModalSeenOpen(true);
        setDisable(true);
    }

    const handeViewEdit = (group) => {
        setSelectedGroup(group);
        setIsModalEditOpen(true);
    }

    const TableRow = ({ item, num }) => (

        <tr className="text-center border-t border-[#1CA756] hover:bg-gray-100">
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563]">{startIndex + num + 1}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563]">{item.id}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563]">{item.name}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563]">{item.member}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563]">{item.member}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563]">{item.lead}</td>
            <td className="!py-[10px] flex justify-center items-center gap-x-[20px]">
                <button onClick={() => handleViewDetails(item)} className="text-green-500 hover:text-green-700 text-[20px] cursor-pointer">
                    <IoEyeOutline />
                </button>
                <button onClick={() => handeViewEdit(item)} className="text-green-500 hover:text-green-700 text-[20px] cursor-pointer">
                    <HiOutlinePencil />
                </button>
                <button onClick={() => setIsModalDeleteOpen(true)} className="text-red-500 hover:text-red-700 text-[20px] cursor-pointer">
                    <IoMdTrash />
                </button>
            </td>
        </tr>
    )
    return (
        <>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-[#1CA756] text-white">
                        <th className="!p-3 border-r">STT</th>
                        <th className="!p-3 border-r">ID dự án</th>
                        <th className="!p-3 border-r">Tên dự án</th>
                        <th className="!p-3 border-r">Ngày bắt đầu</th>
                        <th className="!p-3 border-r">Ngày kết thúc</th>
                        <th className="!p-3 border-r">Tên người quản lý</th>
                        <th className="!p-3">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedItems?.map((item, index) => (
                        <TableRow item={item} key={index} num={index} />
                    ))}
                </tbody>
            </table>
            <ModalSeen isOpen={isModalSeenOpen} disabled={disable} selectedGroup={selectedGroup} onClose={() => setIsModalSeenOpen(false)} />
            <ModalEdit isOpen={isModalEditOpen} selectedGroup={selectedGroup} onClose={() => setIsModalEditOpen(false)} />
            <ModalDeltele isOpen={isModalDeleteOpen} onClose={() => setIsModalDeleteOpen(false)} />
        </>
    )
}

// Add Model
const ModalAdd = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#00000040] backdrop-blur-xs">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white !px-[20px] !py-[16px] rounded-lg w-[900px] shadow-xl"
            >
                <h2 className="text-[#1CA756] text-xl font-bold !mb-[18px]">Thêm mới dự án</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium text-[#4B5563]">ID dự án<span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            className="w-full border rounded !py-[8px] !px-[10px]"
                            placeholder="Nhập ID dự án"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Tên dự án<span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder="Nhập tên dự án"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Ngày bắt đầu<span className='text-red-600'>*</span></label>
                        <Date />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Ngày kết thúc<span className='text-red-600'>*</span></label>
                        <Date />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">ID nhóm thực hiện<span className='text-red-600'>*</span></label>
                        <select className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]">
                            <option>Chọn nhóm thực hiện</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Tên người quản lý <span className='text-red-600'>*</span></label>
                        <select className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]">
                            <option>Chọn người quản lý</option>
                            {data.map((item, index) => (
                                <option key={index} value={item.id}>
                                    {item.lead}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='col-span-2'>
                        <label className="block font-medium text-[#4B5563]">Mô tả dự án <span className='text-red-600'>*</span></label>
                        <textarea
                            className="w-full h-[250px] p-2 border !py-[8px] !px-[10px] border-gray-300 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 transition-all resize-none"
                            placeholder="Mô tả nhóm..."
                        />
                    </div>
                </div>
                <div className="flex justify-center gap-x-[30px] !mt-[15px]">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="!py-[8px] !px-[50px] border border-red-500 text-red-500 rounded hover:bg-red-100 cursor-pointer"
                        onClick={onClose}
                    >
                        Hủy
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="!py-[8px] !px-[50px] bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                    >
                        Lưu
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

// Seen Model
const ModalSeen = ({ isOpen, onClose, selectedGroup, disabled }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#00000040] backdrop-blur-xs">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white !px-[20px] !py-[16px] rounded-lg w-[900px] shadow-xl"
            >
                <div className='flex items-start justify-between'>
                    <h2 className="text-[#1CA756] text-xl font-bold !mb-[18px]">Xem chi tiết thông tin dự án</h2>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="!py-[8px] !px-[8px] border border-red-500 text-red-500 rounded hover:bg-red-100 cursor-pointer"
                        onClick={onClose}
                    >
                        <IoCloseSharp />
                    </motion.button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium text-[#4B5563]">ID dự án <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border rounded !py-[8px] !px-[10px]"
                            placeholder={selectedGroup.id}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Tên dự án <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.name}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Ngày bắt đầu <span className='text-red-600'>*</span></label>
                        <div>
                            <Date disable={disabled} />
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Ngày kết thúc <span className='text-red-600'>*</span></label>
                        <div>
                            <Date disable={disabled} />
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">ID nhóm thực hiện <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder="ID dự án được giao"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">ID người quản lý <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.lead}
                        />
                    </div>
                    <div className='col-span-2'>
                        <label className="block font-medium text-[#4B5563]">Mô tả nhóm <span className='text-red-600'>*</span></label>
                        <textarea
                            readOnly
                            className="w-full h-[250px] p-2 border !py-[8px] !px-[10px] border-gray-300 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 transition-all resize-none"
                            placeholder="Mô tả nhóm..."
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Edit Model
const ModalEdit = ({ isOpen, onClose, selectedGroup }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#00000040] backdrop-blur-xs">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white !px-[20px] !py-[16px] rounded-lg w-[900px] shadow-xl"
            >
                <h2 className="text-[#1CA756] text-xl font-bold !mb-[18px]">Chỉnh sửa thông tin nhóm dự án</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium text-[#4B5563]">ID dự án <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border rounded !py-[8px] !px-[10px]"
                            placeholder={selectedGroup.id}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Tên dự án <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.name}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Ngày bắt đầu <span className='text-red-600'>*</span></label>
                        <div>
                            <Date />
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Ngày kết thúc <span className='text-red-600'>*</span></label>
                        <div>
                            <Date />
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">ID nhóm thực hiện <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder="ID dự án được giao"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">ID người quản lý <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.lead}
                        />
                    </div>
                    <div className='col-span-2'>
                        <label className="block font-medium text-[#4B5563]">Mô tả nhóm <span className='text-red-600'>*</span></label>
                        <textarea
                            className="w-full h-[250px] p-2 border !py-[8px] !px-[10px] border-gray-300 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 transition-all resize-none"
                            placeholder="Mô tả nhóm..."
                        />
                    </div>
                </div>
                <div className="flex justify-center gap-x-[30px] !mt-[15px]">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="!py-[8px] !px-[50px] border border-red-500 text-red-500 rounded hover:bg-red-100 cursor-pointer"
                        onClick={onClose}
                    >
                        Hủy
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="!py-[8px] !px-[50px] bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                    >
                        Lưu
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

// Delete Model
const ModalDeltele = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#00000040] backdrop-blur-xs">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white !px-[20px] !py-[16px] rounded-lg w-[900px] shadow-xl"
            >
                <h2 className="text-[#1CA756] text-xl font-bold !mb-[18px]">Bạn có chắc chắn muốn xóa nhóm dữ liệu ?</h2>
                <div className="flex justify-center gap-x-[30px] !mt-[15px]">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="!py-[8px] !px-[50px] border border-red-500 text-red-500 rounded hover:bg-red-100 cursor-pointer"
                        onClick={onClose}
                    >
                        Quay lại
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="!py-[8px] !px-[50px] bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                    >
                        Đồng ý
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

const data = [
    {
        id: "G001",
        name: "Nhóm 001",
        member: "20",
        lead: "Nguyen Anh Tuan"
    },
    {
        id: "G002",
        name: "Nhóm 002",
        member: "20",
        lead: "Nguyen Anh Tuan"
    },
    {
        id: "G003",
        name: "Nhóm 003",
        member: "20",
        lead: "Nguyen Anh Tuan"
    },
    {
        id: "G004",
        name: "Nhóm 004",
        member: "20",
        lead: "Nguyen Anh Tuan"
    },
    {
        id: "G005",
        name: "Nhóm 005",
        member: "20",
        lead: "Nguyen Anh Tuan"
    },
    {
        id: "<ID Nhom>",
        name: "<Nhom>",
        member: "20",
        lead: "Nguyen Anh Tuan"
    },
    {
        id: "<ID Nhom>",
        name: "<Nhom>",
        member: "20",
        lead: "Nguyen Anh Tuan"
    },
    {
        id: "<ID Nhom>",
        name: "<Nhom>",
        member: "20",
        lead: "Nguyen Anh Tuan"
    },
    {
        id: "<ID Nhom>",
        name: "<Nhom>",
        member: "20",
        lead: "Nguyen Anh Tuan"
    },
    {
        id: "<ID Nhom>",
        name: "<Nhom>",
        member: "20",
        lead: "Nguyen Anh Tuan"
    },
];

const ProjectList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const itemPerPage = 5;

    const totalPages = Math.ceil(data.length / itemPerPage);
    const startIndex = (currentPage - 1) * itemPerPage;
    const displayedItems = data.slice(startIndex, startIndex + itemPerPage);
    return (
        <div className='!mt-[15px]'>
            <div className='h-[36px] flex items-center justify-between gap-x-[27px]'>
                <div className='w-64 flex flex-1 items-center !py-2 !px-3 gap-2 rounded-[8px] border-[1px] border-[#D3D3D3]'>
                    <MdOutlineSearch className='text-gray-500 text-xl' />
                    <input
                        type="text"
                        placeholder='Tìm kiếm theo tên dự án'
                        className='flex-1 outline-none bg-transparent placeholder:text-[#a6a6a6] text-[#343030]'
                    />
                </div>
                <button className='w-[105px] flex bg-[#1ca756] !p-[10px] rounded-[6px] cursor-pointer hover:bg-[#158f46] transition duration-300'>
                    <MdOutlineSearch className='text-[#e3f4e9] text-xl' />
                    <span className='text-[#e3f4e9] text-[14px] font-medium'>Tìm kiếm</span>
                </button>
            </div>
            <div className='!my-[20px] flex items-center justify-between gap-x-[27px]'>
                <h1 className='font-semibold text-[20px] text-[#1CA756] uppercase'>Danh sách dự án</h1>
                <button onClick={() => setIsModalOpen(true)} className='w-[105px] flex bg-[#1ca756] !p-[10px] rounded-[6px] cursor-pointer hover:bg-[#158f46] transition duration-300'>
                    <IoIosAdd className='text-[#e3f4e9] text-xl' />
                    <span className='text-[#e3f4e9] text-[14px] font-medium'>Thêm mới</span>
                </button>
            </div>
            <div>
                <div className='overflow-hidden rounded-[12px] border border-[#1CA756] !mb-[18px]'>
                    <DocumentTable displayedItems={displayedItems} startIndex={startIndex} />
                </div>
                {/* Papagination */}
                <div className="flex justify-end items-center gap-x-[10px]">
                    <button
                        className={`px-3 py-1 cursor-pointer ${currentPage === 1 ? "text-gray-400" : "text-[#1CA756] hover:text-green-800"}`}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        «
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            className={`!px-[8px] !py-[4px] cursor-pointer rounded-md ${currentPage === i + 1 ? "bg-[#1CA756] text-white" : "text-green-600 hover:bg-green-200"}`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className={`px-3 py-1 cursor-pointer ${currentPage === totalPages ? "text-gray-400" : "text-[#1CA756] hover:text-green-800"}`}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        »
                    </button>
                </div>
            </div>
            <ModalAdd isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}

export default ProjectList