import React, { useEffect, useState } from 'react'
import { MdOutlineSearch } from 'react-icons/md'
import { IoIosAdd, IoMdTrash } from "react-icons/io";
import { IoCloseSharp, IoEyeOutline, IoSad } from "react-icons/io5";
import { HiOutlinePencil } from "react-icons/hi2";
import { motion } from "framer-motion";
import axios, { formToJSON } from 'axios';
import API_BASE_URL from "../../api";
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

const DocumentTable = ({ displayedItems, startIndex, setGroupProject, groupProject, user }) => {
    const [isModalSeenOpen, setIsModalSeenOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const handleViewDetails = (group) => {
        setSelectedGroup(group);
        setIsModalSeenOpen(true);
    }

    const handeViewEdit = (group) => {
        setSelectedGroup(group);
        setIsModalEditOpen(true);
    }

    const handleDelete = (group) => {
        setIsModalDeleteOpen(true);
        setSelectedGroup(group);
    }

    const TableRow = ({ item, num }) => (

        <tr className="text-center border-t border-[#1CA756] hover:bg-gray-100 dark:hover:bg-[#9ac898]">
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{startIndex + num + 1}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.CodeNhom}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.TenNhom}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.SoThanhVien}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.HoTenTruongNhom}</td>
            <td className="!py-[10px] flex justify-center items-center gap-x-[20px]">
                <button onClick={() => handleViewDetails(item)} className="text-green-500 hover:text-green-700 text-[20px] cursor-pointer">
                    <IoEyeOutline />
                </button>
                {
                    user.role !== "NhanVien" && (
                        <>
                            <button onClick={() => handeViewEdit(item)} className="text-green-500 hover:text-green-700 text-[20px] cursor-pointer">
                                <HiOutlinePencil />
                            </button>
                            <button onClick={() => handleDelete(item)} className="text-red-500 hover:text-red-700 text-[20px] cursor-pointer">
                                <IoMdTrash />
                            </button>
                        </>

                    )
                }
            </td>
        </tr>
    )
    return (
        <>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-[#1CA756] text-white">
                        <th className="!p-3 border-r">STT</th>
                        <th className="!p-3 border-r">ID nhóm</th>
                        <th className="!p-3 border-r">Tên nhóm</th>
                        <th className="!p-3 border-r">Số thành viên</th>
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
            <ModalSeen isOpen={isModalSeenOpen} selectedGroup={selectedGroup} onClose={() => setIsModalSeenOpen(false)} />
            <ModalEdit groupProject={groupProject} isOpen={isModalEditOpen} selectedGroup={selectedGroup} setGroupProject={setGroupProject} onClose={() => setIsModalEditOpen(false)} />
            <ModalDeltele isOpen={isModalDeleteOpen} selectedGroup={selectedGroup} setGroupProject={setGroupProject} onClose={() => setIsModalDeleteOpen(false)} />
        </>
    )
}

// Add Model 
const ModalAdd = ({ isOpen, onClose, groupProject, setGroupProject }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        groupProjectName: "",
        groupProjectMember: "",
        managerId: "",
        // projectId: "",
        // projectName: "",
        desc: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const requestData = {
        SoThanhVien: formData.groupProjectMember,
        IdnguoiQuanLy: formData.managerId,
        TenNhom: formData.groupProjectName,
        MoTaNhom: formData.desc,
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/NhomLamViecs`, requestData, {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            toast.success("Nhom đã được thêm thành công!");

            setGroupProject((prevGroups) => {
                const updatedGroups = [...prevGroups, response.data];
                console.log("Danh sách Nhom sau khi thêm:", updatedGroups);
                return updatedGroups;
            });

            setFormData({ groupProjectName: "", groupProjectMember: "", managerId: "", desc: "" });

            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi thêm Nhom!");
        } finally {
            setIsLoading(false);
        }
    };

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
                <h2 className="text-[#1CA756] text-xl font-bold !mb-[18px]">Thêm mới nhóm dự án</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium text-[#4B5563]">ID nhóm <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                readOnly
                                className="w-full border rounded !py-[8px] !px-[10px]"
                                placeholder="ID nhóm tự động"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Tên nhóm <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                name="groupProjectName"
                                value={formData.groupProjectName}
                                onChange={handleChange}
                                className="w-full border !py-[8px] !px-[10px] rounded"
                                placeholder="Nhập tên nhóm"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Số thành viên <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                name="groupProjectMember"
                                value={formData.groupProjectMember}
                                onChange={handleChange}
                                className="w-full border !py-[8px] !px-[10px] rounded"
                                placeholder="Số thành viên"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Tên người quản lý <span className='text-red-600'>*</span></label>
                            <select
                                name="managerId"
                                value={formData.managerId}
                                onChange={handleChange}
                                className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]"
                            >
                                <option>Chọn người quản lý</option>
                                {groupProject.map((item, index) => (
                                    <option key={index} value={item.IdtruongNhom}>
                                        {item.HoTenTruongNhom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* <div>
                        <label className="block font-medium text-[#4B5563]">ID dự án được giao <span className='text-red-600'>*</span></label>
                        <select
                            name="projectId"
                            value={formData.projectId}
                            onChange={handleChange}
                            className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]"
                        >
                            <option>Id dự án</option>
                            {groupProject.map((item, index) => (
                                <option key={index} value={item?.DuAn[0]?.IdduAn}>
                                    {item?.DuAn[0]?.CodeDuAn}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Dự án <span className='text-red-600'>*</span></label>
                        <select
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]"
                        >
                            <option>Tên dự án</option>
                            {groupProject.map((item, index) => (
                                <option key={index} value={item?.DuAn[0]?.TenDuAn}>
                                    {item?.DuAn[0]?.TenDuAn}
                                </option>
                            ))}
                        </select>
                    </div> */}
                        <div className='col-span-2'>
                            <label className="block font-medium text-[#4B5563]">Mô tả nhóm <span className='text-red-600'>*</span></label>
                            <textarea
                                name="desc"
                                value={formData.desc}
                                onChange={handleChange}
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
                            type='submit'
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="!py-[8px] !px-[50px] bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                        >
                            {isLoading ? "Đang lưu" : "Lưu"}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// Seen Model
const ModalSeen = ({ isOpen, onClose, selectedGroup }) => {

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
                    <h2 className="text-[#1CA756] text-xl font-bold !mb-[18px]">Xem chi tiết thông tin nhóm dự án</h2>
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
                        <label className="block font-medium text-[#4B5563]">ID nhóm <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border rounded !py-[8px] !px-[10px]"
                            placeholder={selectedGroup.CodeNhom}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Tên nhóm <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.TenNhom}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Số thành viên <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.SoThanhVien}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Tên người quản lý <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.HoTenTruongNhom}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">ID dự án được giao <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup?.DuAn[0]?.CodeDuAn || "Chưa thêm dự án"}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Tên dự án <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup?.DuAn[0]?.TenDuAn || "Chưa thêm dự án"}
                        />
                    </div>
                    <div className='col-span-2'>
                        <label className="block font-medium text-[#4B5563]">Mô tả nhóm <span className='text-red-600'>*</span></label>
                        <textarea
                            className="w-full h-[250px] p-2 border !py-[8px] !px-[10px] border-gray-300 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 transition-all resize-none"
                            placeholder={selectedGroup.MoTaNhom}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Edit Model
const ModalEdit = ({ isOpen, onClose, selectedGroup, groupProject, setGroupProject }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        groupProjectName: "",
        groupProjectMember: "",
        managerId: "",
        // projectId: "",
        // projectName: "",
        desc: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const requestData = {
        IdnhomLamViec: selectedGroup?.IdnhomLamViec,
        SoThanhVien: formData.groupProjectMember,
        IdnguoiQuanLy: formData.managerId,
        TenNhom: formData.groupProjectName,
        MoTaNhom: formData.desc,
    }

    // console.log(formData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.put(`${API_BASE_URL}/NhomLamViecs/${selectedGroup.IdnhomLamViec}`, requestData, {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            toast.success("Nhom đã được sua thành công!");

            console.log(response.data)

            setGroupProject((prevGroups) =>
                prevGroups.map((group) =>
                    group.IdnhomLamViec === selectedGroup.IdnhomLamViec ? response.data[0] : group
                )
            );

            setFormData({ groupProjectName: "", groupProjectMember: "", managerId: "", desc: "" });

            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi sua Nhom!");
        } finally {
            setIsLoading(false);
        }
    };

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
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium text-[#4B5563]">ID nhóm <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                readOnly
                                className="w-full border rounded !py-[8px] !px-[10px]"
                                placeholder={selectedGroup.CodeNhom}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Tên nhóm <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                name='groupProjectName'
                                value={formData.groupProjectName}
                                onChange={handleChange}
                                className="w-full border !py-[8px] !px-[10px] rounded"
                                placeholder={selectedGroup.TenNhom}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Số thành viên <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                name='groupProjectMember'
                                value={formData.groupProjectMember}
                                onChange={handleChange}
                                className="w-full border !py-[8px] !px-[10px] rounded"
                                placeholder={selectedGroup.SoThanhVien}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Tên người quản lý <span className='text-red-600'>*</span></label>
                            <select
                                name="managerId"
                                value={formData.managerId}
                                onChange={handleChange}
                                className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]"
                            >
                                <option>Chọn người quản lý</option>
                                {groupProject.map((item, index) => (
                                    <option key={index} value={item.IdtruongNhom}>
                                        {item.HoTenTruongNhom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* <div>
                        <label className="block font-medium text-[#4B5563]">ID dự án được giao <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder="ID dự án được giao"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Tên dự án <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder="Tên dự án"
                        />
                    </div> */}
                        <div className='col-span-2'>
                            <label className="block font-medium text-[#4B5563]">Mô tả nhóm <span className='text-red-600'>*</span></label>
                            <textarea
                                name="desc"
                                value={formData.desc}
                                onChange={handleChange}
                                className="w-full h-[250px] p-2 border !py-[8px] !px-[10px] border-gray-300 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 transition-all resize-none"
                                placeholder={selectedGroup.MoTaNhom}
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
                            type='submit'
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="!py-[8px] !px-[50px] bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                        >
                            {isLoading ? "Đang lưu" : "Lưu"}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// Delete Model
const ModalDeltele = ({ isOpen, onClose, selectedGroup, setGroupProject }) => {
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        if (deleteId !== null) {
            axios.delete(`${API_BASE_URL}/NhomLamViecs/${deleteId}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                }
            })
                .then(() => {
                    console.log(`Xóa nhom ${deleteId} thành công!`);
                    setGroupProject(prevGroup => prevGroup.filter(group => group.IdnhomLamViec !== deleteId))
                    onClose();
                })
                .catch(error => console.error("Lỗi khi xóa tài liệu:", error))
                .finally(() => setDeleteId(null));
        }
    }, [deleteId])

    const handleDelete = (id) => {
        setDeleteId(id)
    }

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
                        onClick={() => handleDelete(selectedGroup.IdnhomLamViec)}
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

const GroupProjectList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupProject, setGroupProject] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const { user } = useSelector((state) => state.auth);
    const itemPerPage = 10;

    // const totalPages = Math.ceil(groupProject.length / itemPerPage);
    const startIndex = (currentPage - 1) * itemPerPage;
    const displayedItems = groupProject.slice(startIndex, startIndex + itemPerPage);
    const filteredGroup = user.role === "NhanVien" ? displayedItems.filter(emp => emp.TenNhom === user.nhom) : displayedItems;

    const totalPages = user.role === "NhanVien" ? Math.ceil(filteredGroup.length / itemPerPage) : Math.ceil(groupProject.length / itemPerPage);

    // Render UI nhóm dự án
    useEffect(() => {
        axios.get(`${API_BASE_URL}/NhomLamViecs`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json",
            }
        })
            .then(response => setGroupProject(response.data))
            .catch(error => console.error("Loi khi goi API:", error));
    }, [])

    // console.log(groupProject);

    // Search nhóm dự án
    const handleSearch = async () => {
        if (!searchInput.trim()) return;
        try {
            const response = await axios.get(`${API_BASE_URL}/NhomLamViecs/by-name/${searchInput}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
            });
            setGroupProject(response.data);
        } catch (error) {
            console.error("Lỗi khi gọi API :", error);
        }
    }

    // console.log(groupProject)

    return (
        <div className='!mt-[15px]'>
            <div className='h-[36px] flex items-center justify-between gap-x-[27px]'>
                <div className='w-64 flex flex-1 items-center !py-2 !px-3 gap-2 rounded-[8px] border-[1px] border-[#D3D3D3]'>
                    <MdOutlineSearch className='text-gray-500 text-xl' />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder='Tìm kiếm theo tên dự án'
                        className='flex-1 outline-none bg-transparent placeholder:text-[#a6a6a6] text-[#343030]'
                    />
                </div>
                <button className='w-[105px] flex bg-[#1ca756] !p-[10px] rounded-[6px] cursor-pointer hover:bg-[#158f46] transition duration-300'>
                    <MdOutlineSearch className='text-[#e3f4e9] text-xl' />
                    <span onClick={handleSearch} className='text-[#e3f4e9] text-[14px] font-medium'>Tìm kiếm</span>
                </button>
            </div>
            <div className='!my-[20px] flex items-center justify-between gap-x-[27px]'>
                <h1 className='font-semibold text-[20px] text-[#1CA756] uppercase'>Danh sách nhóm dự án</h1>
                {
                    user.role !== "NhanVien" && (
                        <button onClick={() => setIsModalOpen(true)} className='w-[105px] flex bg-[#1ca756] !p-[10px] rounded-[6px] cursor-pointer hover:bg-[#158f46] transition duration-300'>
                            <IoIosAdd className='text-[#e3f4e9] text-xl' />
                            <span className='text-[#e3f4e9] text-[14px] font-medium'>Thêm mới</span>
                        </button>
                    )
                }
            </div>
            <div>
                <div className='overflow-hidden rounded-[12px] border border-[#1CA756] !mb-[18px]'>
                    <DocumentTable user={user} displayedItems={filteredGroup} groupProject={groupProject} startIndex={startIndex} setGroupProject={setGroupProject} />
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
            <ModalAdd groupProject={groupProject} setGroupProject={setGroupProject} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}

export default GroupProjectList