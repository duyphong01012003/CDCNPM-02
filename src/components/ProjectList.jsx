import React, { useEffect, useState } from 'react'
import { MdOutlineSearch } from 'react-icons/md'
import { IoIosAdd, IoMdTrash } from "react-icons/io";
import { IoCloseSharp, IoEyeOutline, IoSad } from "react-icons/io5";
import { HiOutlinePencil } from "react-icons/hi2";
import { motion } from "framer-motion";
import DateTime from "../components/Datepicker"
import axios from 'axios';
import API_BASE_URL from "../../api";
import { toast } from 'sonner';


const DocumentTable = ({ displayedItems, startIndex, project, setProject }) => {
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

    const handleDelete = (group) => {
        setIsModalDeleteOpen(true);
        setSelectedGroup(group);
    }

    const TableRow = ({ item, num }) => (

        <tr className="text-center border-t border-[#1CA756] hover:bg-gray-100 dark:hover:bg-[#9ac898]">
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{startIndex + num + 1}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.CodeDuAn}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.TenDuAn}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.NgayBatDau}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.NgayKetThuc}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.HoTenTruongNhom}</td>
            <td className="!py-[10px] flex justify-center items-center gap-x-[20px]">
                <button onClick={() => handleViewDetails(item)} className="text-green-500 hover:text-green-700 text-[20px] cursor-pointer">
                    <IoEyeOutline />
                </button>
                <button onClick={() => handeViewEdit(item)} className="text-green-500 hover:text-green-700 text-[20px] cursor-pointer">
                    <HiOutlinePencil />
                </button>
                <button onClick={() => handleDelete(item)} className="text-red-500 hover:text-red-700 text-[20px] cursor-pointer">
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
            <ModalEdit isOpen={isModalEditOpen} project={project} selectedGroup={selectedGroup} setProject={setProject} onClose={() => setIsModalEditOpen(false)} />
            <ModalDeltele isOpen={isModalDeleteOpen} setProject={setProject} selectedGroup={selectedGroup} onClose={() => setIsModalDeleteOpen(false)} />
        </>
    )
}

// Add Model
const ModalAdd = ({ isOpen, onClose, project, setProject }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        projectName: '',
        startDate: '',
        endDate: '',
        groupId: '',
        managerId: '',
        desc: '',
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const seen = new Set();
    const uniqueProjects = project.filter(item => {
        if (seen.has(item.IdnhomLamViec)) {
            return false;
        }
        seen.add(item.IdnhomLamViec);
        return true;
    });

    const mana = new Set();
    const uniqueManage = project.filter(item => {
        if (mana.has(item.IdtruongNhom)) {
            return false;
        }
        mana.add(item.IdtruongNhom);
        return true;
    });

    // Xử date 
    const selectedStartDate = formData.startDate ? new Date(formData.startDate) : null;
    const formattedStartDate = selectedStartDate instanceof Date && !isNaN(selectedStartDate)
        ? `${selectedStartDate.getFullYear()}-${String(selectedStartDate.getMonth() + 1).padStart(2, '0')}-${String(selectedStartDate.getDate()).padStart(2, '0')}`
        : '';

    const selectedEndDate = formData.endDate ? new Date(formData.endDate) : null;
    const formattedEndDate = selectedEndDate instanceof Date && !isNaN(selectedEndDate)
        ? `${selectedEndDate.getFullYear()}-${String(selectedEndDate.getMonth() + 1).padStart(2, '0')}-${String(selectedEndDate.getDate()).padStart(2, '0')}`
        : '';

    const requestData = {
        TenDuAn: formData.projectName,
        NgayBatDau: formattedStartDate,
        NgayKetThuc: formattedEndDate,
        MoTaDuAn: formData.desc,
        IdnguoiQuanLy: formData.managerId,
        IdnhomLamViec: formData.groupId,
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/DuAns`, requestData, {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            toast.success("Du an đã được thêm thành công!");

            setProject((prevProjects) => {
                const updatedDocuments = [...prevProjects, response.data];
                console.log("Danh sách Du an sau khi thêm:", updatedDocuments);
                return updatedDocuments;
            });

            setFormData({ projectName: "", startDate: "", endDate: "", groupId: "", managerId: "", desc: "", });

            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi thêm Du an!");
        } finally {
            setIsLoading(false);

        }
    };

    // console.log(project);
    // console.log(formData);
    // console.log(requestData);
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
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium text-[#4B5563]">ID dự án<span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                readOnly
                                className="w-full border rounded !py-[8px] !px-[10px]"
                                placeholder="ID dự án tự động"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Tên dự án<span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                name='projectName'
                                value={formData.projectName}
                                onChange={handleChange}
                                className="w-full border !py-[8px] !px-[10px] rounded"
                                placeholder="Nhập tên dự án"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Ngày bắt đầu<span className='text-red-600'>*</span></label>
                            <DateTime
                                value={formData.startDate}
                                datePlc="Ngày bắt đầu"
                                onChange={(date) => setFormData({ ...formData, startDate: date })}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Ngày kết thúc<span className='text-red-600'>*</span></label>
                            <DateTime
                                value={formData.endDate}
                                datePlc="Ngày kết thúc"
                                onChange={(date) => setFormData({ ...formData, endDate: date })}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">ID nhóm thực hiện<span className='text-red-600'>*</span></label>
                            <select
                                name='groupId'
                                value={formData.groupId}
                                onChange={handleChange}
                                className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]"
                            >
                                <option>Chọn nhóm thực hiện</option>
                                {uniqueProjects.map((item, index) => (
                                    <option key={index} value={item.IdnhomLamViec}>
                                        {item.CodeNhom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Tên người quản lý <span className='text-red-600'>*</span></label>
                            <select
                                name='managerId'
                                value={formData.managerId}
                                onChange={handleChange}
                                className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]">
                                <option>Chọn người quản lý</option>
                                {uniqueManage.map((item, index) => (
                                    <option key={index} value={item.IdtruongNhom}>
                                        {item.HoTenTruongNhom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='col-span-2'>
                            <label className="block font-medium text-[#4B5563]">Mô tả dự án <span className='text-red-600'>*</span></label>
                            <textarea
                                name='desc'
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
                            placeholder={selectedGroup.CodeDuAn}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Tên dự án <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.TenDuAn}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Ngày bắt đầu <span className='text-red-600'>*</span></label>
                        <div>
                            <DateTime disable={disabled} datePlc={selectedGroup.NgayBatDau} />
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Ngày kết thúc <span className='text-red-600'>*</span></label>
                        <div>
                            <DateTime disable={disabled} datePlc={selectedGroup.NgayKetThuc} />
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">ID nhóm thực hiện <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.CodeNhom}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">ID người quản lý <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.HoTenTruongNhom}
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
const ModalEdit = ({ isOpen, onClose, selectedGroup, setProject, project }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        projectName: '',
        startDate: '',
        endDate: '',
        groupId: '',
        managerId: '',
        desc: '',
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Xử date 
    const selectedStartDate = formData.startDate ? new Date(formData.startDate) : null;
    const formattedStartDate = selectedStartDate instanceof Date && !isNaN(selectedStartDate)
        ? `${selectedStartDate.getFullYear()}-${String(selectedStartDate.getMonth() + 1).padStart(2, '0')}-${String(selectedStartDate.getDate()).padStart(2, '0')}`
        : '';

    const selectedEndDate = formData.endDate ? new Date(formData.endDate) : null;
    const formattedEndDate = selectedEndDate instanceof Date && !isNaN(selectedEndDate)
        ? `${selectedEndDate.getFullYear()}-${String(selectedEndDate.getMonth() + 1).padStart(2, '0')}-${String(selectedEndDate.getDate()).padStart(2, '0')}`
        : '';

    const requestData = {
        IdduAn: selectedGroup?.IdduAn,
        TenDuAn: formData.projectName,
        NgayBatDau: formattedStartDate,
        NgayKetThuc: formattedEndDate,
        MoTaDuAn: formData.desc,
        IdnguoiQuanLy: formData.managerId,
        IdnhomLamViec: formData.groupId,
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.put(`${API_BASE_URL}/DuAns/${selectedGroup.IdduAn}`, requestData, {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            toast.success("Du an đã được thêm thành công!");

            setProject((prevProjects) =>
                prevProjects.map((project) =>
                    project.IdduAn === selectedGroup.IdduAn ? response.data : project
                )
            );

            setFormData({ projectName: "", startDate: "", endDate: "", groupId: "", managerId: "", desc: "", });

            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi thêm Du an!");
        } finally {
            setIsLoading(false);

        }
    };

    // console.log(project);
    // console.log(formData);
    // console.log(requestData);
    // console.log(selectedGroup);
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
                            <label className="block font-medium text-[#4B5563]">ID dự án <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                readOnly
                                className="w-full border rounded !py-[8px] !px-[10px]"
                                placeholder={selectedGroup.CodeDuAn}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Tên dự án<span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                name='projectName'
                                value={formData.projectName}
                                onChange={handleChange}
                                className="w-full border !py-[8px] !px-[10px] rounded"
                                placeholder="Nhập tên dự án"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Ngày bắt đầu<span className='text-red-600'>*</span></label>
                            <DateTime
                                value={formData.startDate}
                                datePlc="Ngày bắt đầu"
                                onChange={(date) => setFormData({ ...formData, startDate: date })}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Ngày kết thúc<span className='text-red-600'>*</span></label>
                            <DateTime
                                value={formData.endDate}
                                datePlc="Ngày kết thúc"
                                onChange={(date) => setFormData({ ...formData, endDate: date })}

                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">ID nhóm thực hiện<span className='text-red-600'>*</span></label>
                            <select
                                name='groupId'
                                value={formData.groupId}
                                onChange={handleChange}
                                className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]"
                            >
                                <option>Chọn nhóm thực hiện</option>
                                {project.map((item, index) => (
                                    <option key={index} value={item.IdnhomLamViec}>
                                        {item.CodeNhom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Tên người quản lý <span className='text-red-600'>*</span></label>
                            <select
                                name='managerId'
                                value={formData.managerId}
                                onChange={handleChange}
                                className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]">
                                <option>Chọn người quản lý</option>
                                {project.map((item, index) => (
                                    <option key={index} value={item.IdtruongNhom}>
                                        {item.HoTenTruongNhom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='col-span-2'>
                            <label className="block font-medium text-[#4B5563]">Mô tả nhóm <span className='text-red-600'>*</span></label>
                            <textarea
                                name='desc'
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

// Delete Model
const ModalDeltele = ({ isOpen, onClose, selectedGroup, setProject }) => {
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        if (deleteId !== null) {
            axios.delete(`${API_BASE_URL}/DuAns/${deleteId}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                }
            })
                .then(() => {
                    console.log(`Xóa du an ${deleteId} thành công!`);
                    setProject(prevProject => prevProject.filter(project => project.IdduAn !== deleteId))
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
                        onClick={() => handleDelete(selectedGroup.IdduAn)}
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
    const [project, setProject] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const itemPerPage = 10;

    const totalPages = Math.ceil(project.length / itemPerPage);
    const startIndex = (currentPage - 1) * itemPerPage;
    const displayedItems = project.slice(startIndex, startIndex + itemPerPage);

    // Render UI nhóm dự án
    useEffect(() => {
        axios.get(`${API_BASE_URL}/DuAns`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json",
            }
        })
            .then(response => setProject(response.data))
            .catch(error => console.error("Loi khi goi API:", error));
    }, [])

    // Search dự án
    const handleSearch = async () => {
        if (!searchInput.trim()) return;
        try {
            const response = await axios.get(`${API_BASE_URL}/DuAns/by-name/${searchInput}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
            });
            setProject(response.data);
        } catch (error) {
            console.error("Lỗi khi gọi API :", error);
        }
    }

    // console.log(project);

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
                <h1 className='font-semibold text-[20px] text-[#1CA756] uppercase'>Danh sách dự án</h1>
                <button onClick={() => setIsModalOpen(true)} className='w-[105px] flex bg-[#1ca756] !p-[10px] rounded-[6px] cursor-pointer hover:bg-[#158f46] transition duration-300'>
                    <IoIosAdd className='text-[#e3f4e9] text-xl' />
                    <span className='text-[#e3f4e9] text-[14px] font-medium'>Thêm mới</span>
                </button>
            </div>
            <div>
                <div className='overflow-hidden rounded-[12px] border border-[#1CA756] !mb-[18px]'>
                    <DocumentTable displayedItems={displayedItems} startIndex={startIndex} project={project} setProject={setProject} />
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
            <ModalAdd isOpen={isModalOpen} setProject={setProject} project={project} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}

export default ProjectList