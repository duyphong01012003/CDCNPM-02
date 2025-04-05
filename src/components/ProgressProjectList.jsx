import React, { use, useEffect, useState } from 'react'
import { MdOutlineSearch } from 'react-icons/md'
import { IoIosAdd, IoMdTrash, IoIosCloseCircleOutline } from "react-icons/io";
import { IoCloseSharp, IoEyeOutline, IoSad, IoCheckmarkOutline } from "react-icons/io5";
import { BsClipboardCheck } from "react-icons/bs";
import { HiOutlinePencil } from "react-icons/hi2";
import { motion } from "framer-motion";
import DateTime from "../components/Datepicker"
import axios from 'axios';
import API_BASE_URL from "../../api";
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const DocumentTable = ({ displayedItems, startIndex, user, taskProgress, setTaskProgress }) => {
    const [isModalSeenOpen, setIsModalSeenOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
        setSelectedGroup(group);
        setIsModalDeleteOpen(true)
    }

    // Xử lí chuyển đổi đã tạo => đang thực hiện
    const handleCheck = async (item) => {
        setIsLoading(true);
        try {
            const response = await axios.put(`${API_BASE_URL}/TaskCons/accept/${item.IdtaskCon}`, {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            setTaskProgress((prevTaskProgress) =>
                prevTaskProgress.map((progress) =>
                    progress.IdtaskCon === item.IdtaskCon ? response.data[0] : progress
                )
            )

            toast.success("Công việc con từ đã tạo sang đang thực hiện thành công!");
        } catch (error) {
            // toast.error(error.response?.data?.message || "Lỗi khi sửa cong viec con!");
            toast.error(error.response?.data?.message || error.message || "Lỗi khi chuyển trạng thái công việc con!");
        } finally {
            setIsLoading(false);
        }
    };

    // Xử lí chuyển đổi đang thực hiện => hoàn thành
    const handleComplete = async (item) => {
        setIsLoading(true);
        try {
            const response = await axios.put(`${API_BASE_URL}/TaskCons/complete/${item.IdtaskCon}`, {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            console.log(response.data);

            setTaskProgress((prevTaskProgress) =>
                prevTaskProgress.map((progress) =>
                    progress.IdtaskCon === item.IdtaskCon ? response.data[0] : progress
                )
            )

            toast.success("Công việc con từ đã tạo sang đang thực hiện thành công!");
        } catch (error) {
            // toast.error(error.response?.data?.message || "Lỗi khi sửa cong viec con!");
            toast.error(error.response?.data?.message || error.message || "Lỗi khi chuyển trạng thái công việc con!");
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Đã tạo":
                return "text-[#4B5563]";
            case "Đang thực hiện":
                return "text-[#4B77B6]";
            case "Đã hoàn thành":
                return "text-[#689F38]";
            case "Quá hạn":
                return "text-[#FF3B30]";
            default:
                return "text-gray-500";
        }
    };

    const TableRow = ({ item, num }) => (

        <tr className="text-center border-t border-[#1CA756] hover:bg-gray-100 dark:hover:bg-[#9ac898]">
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{startIndex + num + 1}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.CodeTankCon}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.TenTaskCon}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.NgayTao}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.Deadline}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.CodeTank}</td>
            <td className="!py-[5px] !px-[20px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#1CA756]">
                <div className={`bg-[#F0F0F0] rounded-[8px] ${getStatusColor(item.TrangThai)} !py-[2px] !px-[4px]`}>
                    {item.TrangThai}
                </div>
            </td>
            <td className="!py-[10px] flex justify-center items-center gap-x-[20px]">
                <button onClick={() => handleViewDetails(item)} className="text-green-500 hover:text-green-700 text-[20px] cursor-pointer">
                    <IoEyeOutline />
                </button>
                {
                    item.TrangThai === "Đã tạo" && (
                        <>
                            <button onClick={() => handeViewEdit(item)} className="text-green-500 hover:text-green-700 text-[20px] cursor-pointer">
                                <HiOutlinePencil />
                            </button>
                            <button onClick={() => handleCheck(item)} className="text-green-500 hover:text-green-700 text-[20px] cursor-pointer">
                                <IoCheckmarkOutline />
                            </button>

                        </>
                    )
                }
                {
                    (item.TrangThai === "Đang thực hiện" || item.TrangThai === "Quá hạn") && (
                        <button onClick={() => handleComplete(item)} className="text-green-500 hover:text-green-700 text-[20px] cursor-pointer">
                            <BsClipboardCheck />
                        </button>
                    )
                }
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
                        <th className="!p-3 border-r">Task ID</th>
                        <th className="!p-3 border-r">Tên công việc</th>
                        <th className="!p-3 border-r">Ngày tạo</th>
                        <th className="!p-3 border-r">Deadline</th>
                        <th className="!p-3 border-r">ID task cha</th>
                        <th className="!p-3 border-r">Tiến độ</th>
                        <th className="!p-3">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedItems?.map((item, index) => (
                        <TableRow item={item} key={index} num={index} />
                    ))}
                </tbody>
            </table>
            <ModalSeen isOpen={isModalSeenOpen} disabled={disable} selectedGroup={selectedGroup} user={user} onClose={() => setIsModalSeenOpen(false)} />
            <ModalEdit isOpen={isModalEditOpen} selectedGroup={selectedGroup} user={user} onClose={() => setIsModalEditOpen(false)} taskProgress={taskProgress} setTaskProgress={setTaskProgress} />
            <ModalDeltele isOpen={isModalDeleteOpen} setTaskProgress={setTaskProgress} selectedGroup={selectedGroup} onClose={() => setIsModalDeleteOpen(false)} />
        </>
    )
}

// Add Model
const ModalAdd = ({ isOpen, onClose, taskProgress, user, setTaskProgress }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        idTask: "",
        nameProgress: "",
        status: "",
        startDay: "",
        deadline: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Xử date 
    const selectedStartDay = formData.startDay ? new Date(formData.startDay) : null;
    const formattedStartDay = selectedStartDay instanceof Date && !isNaN(selectedStartDay)
        ? `${selectedStartDay.getFullYear()}-${String(selectedStartDay.getMonth() + 1).padStart(2, '0')}-${String(selectedStartDay.getDate()).padStart(2, '0')}`
        : '';

    const selectedDeadline = formData.deadline ? new Date(formData.deadline) : null;
    const formattedDeadline = selectedDeadline instanceof Date && !isNaN(selectedDeadline)
        ? `${selectedDeadline.getFullYear()}-${String(selectedDeadline.getMonth() + 1).padStart(2, '0')}-${String(selectedDeadline.getDate()).padStart(2, '0')}`
        : '';

    const requestData = {
        IdtaskCha: formData.idTask,
        TenTaskCon: formData.nameProgress,
        TrangThai: formData.status,
        NgayTao: formattedStartDay,
        Deadline: formattedDeadline,
        IdNguoiTaoTask: user.IdnhanVien,
    }

    const mana = new Set();
    const uniqueManage = taskProgress.filter(item => {
        if (mana.has(item.Idtask)) {
            return false;
        }
        mana.add(item.Idtask);
        return true;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/TaskCons`, requestData, {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            toast.success("Công việc con đã được thêm thành công!");

            setTaskProgress((prevTaskProgress) => {
                const updatedTaskProgress = [...prevTaskProgress, response.data[0]];
                console.log("Danh sách cong viec sau khi thêm:", updatedTaskProgress);
                return updatedTaskProgress;
            });

            setFormData({
                idTask: "",
                nameProgress: "",
                status: "",
                startDay: "",
                deadline: "",
            });
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi thêm cong viec con!");
        } finally {
            setIsLoading(false);
        }
    };

    // console.log(formData)
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
                <h2 className="text-[#1CA756] text-xl font-bold !mb-[18px]">Thêm mới task con</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium text-[#4B5563]">ID task con <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                readOnly
                                className="w-full border rounded !py-[8px] !px-[10px] bg-[#F5F5F5]"
                                placeholder="Hệ thống tự gen"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">ID task cha <span className='text-red-600'>*</span></label>
                            <select
                                name='idTask'
                                value={formData.idTask}
                                onChange={handleChange}
                                className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]"
                            >
                                <option>Chọn ID task cha</option>
                                {uniqueManage.map((item, index) => (
                                    <option key={index} value={item.Idtask}>
                                        {item.CodeTank}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Tên công việc <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                name='nameProgress'
                                value={formData.nameProgress}
                                onChange={handleChange}
                                className="w-full border !py-[8px] !px-[10px] rounded"
                                placeholder="Nhập tên công việc"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Trạng thái <span className='text-red-600'>*</span></label>
                            <select
                                name='status'
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]"
                            >
                                <option>Chọn trạng thái</option>
                                {status.map((item, index) => (
                                    <option key={index} value={item.statusName}>
                                        {item.statusName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Ngày tạo <span className='text-red-600'>*</span></label>
                            <DateTime
                                value={formData.startDay}
                                onChange={(date) => setFormData({ ...formData, startDay: date })}
                                datePlc="Chọn ngày/tháng năm"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Deadline <span className='text-red-600'>*</span></label>
                            <DateTime
                                value={formData.deadline}
                                onChange={(date) => setFormData({ ...formData, deadline: date })}
                                datePlc="Chọn ngày/tháng năm"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">ID tài khoản tạo task con <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                className="w-full border !py-[8px] !px-[10px] rounded bg-[#F5F5F5]"
                                placeholder={user.ten}
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
const ModalSeen = ({ isOpen, onClose, selectedGroup, disabled, user }) => {
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
                    <h2 className="text-[#1CA756] text-xl font-bold !mb-[18px]">Xem chi tiết thông tin công việc con</h2>
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
                        <label className="block font-medium text-[#4B5563]">ID task con <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border rounded !py-[8px] !px-[10px]"
                            placeholder={selectedGroup.CodeTankCon}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">ID task cha <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.CodeTank}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Tên công việc <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.TenTaskCon}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Trạng thái <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.TrangThai}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Ngày tạo <span className='text-red-600'>*</span></label>
                        <div>
                            <DateTime disable={disabled} datePlc={selectedGroup.NgayTao} />
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Deadline <span className='text-red-600'>*</span></label>
                        <div>
                            <DateTime disable={disabled} datePlc={selectedGroup.Deadline} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Edit Model
const ModalEdit = ({ isOpen, onClose, selectedGroup, taskProgress, setTaskProgress, user }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        idTask: "",
        nameProgress: "",
        startDay: "",
        deadline: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Xử date 
    const selectedStartDay = formData.startDay ? new Date(formData.startDay) : null;
    const formattedStartDay = selectedStartDay instanceof Date && !isNaN(selectedStartDay)
        ? `${selectedStartDay.getFullYear()}-${String(selectedStartDay.getMonth() + 1).padStart(2, '0')}-${String(selectedStartDay.getDate()).padStart(2, '0')}`
        : '';

    const selectedDeadline = formData.deadline ? new Date(formData.deadline) : null;
    const formattedDeadline = selectedDeadline instanceof Date && !isNaN(selectedDeadline)
        ? `${selectedDeadline.getFullYear()}-${String(selectedDeadline.getMonth() + 1).padStart(2, '0')}-${String(selectedDeadline.getDate()).padStart(2, '0')}`
        : '';

    const requestData = {
        IdtaskCon: selectedGroup?.IdtaskCon,
        IdtaskCha: formData.idTask === "" ? selectedGroup?.CodeTank : formData.idTask,
        TenTaskCon: formData.nameProgress === "" ? selectedGroup?.TenTaskCon : formData.nameProgress,
        NgayTao: formattedStartDay === "" ? selectedGroup?.NgayTao : formattedStartDay,
        Deadline: formattedDeadline === "" ? selectedGroup?.Deadline : formattedDeadline,
        IdNguoiTaoTask: user.IdnhanVien,
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.put(`${API_BASE_URL}/TaskCons/${selectedGroup.IdtaskCon}`, requestData, {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            toast.success("Công việc con đã sửa thêm thành công!");

            setTaskProgress((prevTaskProgress) =>
                prevTaskProgress.map((progress) =>
                    progress.IdtaskCon === selectedGroup.IdtaskCon ? response.data : progress
                )
            )

            setFormData({
                idTask: "",
                nameProgress: "",
                startDay: "",
                deadline: "",
            });
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi sửa cong viec con!");
        } finally {
            setIsLoading(false);
        }
    };

    // console.log(requestData)

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
                            <label className="block font-medium text-[#4B5563]">ID task con <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                readOnly
                                className="w-full border rounded !py-[8px] !px-[10px] bg-[#F5F5F5]"
                                placeholder={selectedGroup.CodeTankCon}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">ID task cha <span className='text-red-600'>*</span></label>
                            <select
                                name='idTask'
                                value={formData.idTask}
                                onChange={handleChange}
                                className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]"
                            >
                                <option>{selectedGroup.CodeTank}</option>
                                {taskProgress.map((item, index) => (
                                    <option key={index} value={item.Idtask}>
                                        {item.CodeTank}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Tên công việc <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                name='nameProgress'
                                value={formData.nameProgress}
                                onChange={handleChange}
                                className="w-full border !py-[8px] !px-[10px] rounded"
                                placeholder={selectedGroup.TenTaskCon}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Trạng thái <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                readOnly
                                className="w-full border !py-[8px] !px-[10px] rounded"
                                placeholder={selectedGroup.TrangThai}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Ngày tạo <span className='text-red-600'>*</span></label>
                            <DateTime
                                value={formData.startDay}
                                onChange={(date) => setFormData({ ...formData, startDay: date })}
                                datePlc={selectedGroup.NgayTao}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Deadline <span className='text-red-600'>*</span></label>
                            <DateTime
                                value={formData.deadline}
                                onChange={(date) => setFormData({ ...formData, deadline: date })}
                                datePlc={selectedGroup.Deadline}
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
const ModalDeltele = ({ isOpen, onClose, selectedGroup, setTaskProgress }) => {
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        if (deleteId !== null) {
            axios.delete(`${API_BASE_URL}/TaskCons/${deleteId}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                }
            })
                .then(() => {
                    toast.success("Xóa công việc con thành công!");
                    setTaskProgress(prevTaskProgress => prevTaskProgress.filter(process => process.IdtaskCon !== deleteId))
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
                        onClick={() => handleDelete(selectedGroup.IdtaskCon)}
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

const status = [
    {
        statusName: "Đã tạo",
    },
    {
        statusName: "Đang thực hiện",
    },
    {
        statusName: "Đã hoàn thành",
    },
    {
        statusName: "Quá hạn",
    },

];

const ProgressProjectList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskProgress, setTaskProgress] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const { user } = useSelector((state) => state.auth);
    const itemPerPage = 10;

    // const totalPages = Math.ceil(taskProgress.length / itemPerPage);
    // const startIndex = (currentPage - 1) * itemPerPage;
    // const displayedItems = taskProgress.slice(startIndex, startIndex + itemPerPage);

    // const startIndex = (currentPage - 1) * itemPerPage;
    // const displayedItems = taskProgress.slice(startIndex, startIndex + itemPerPage);
    // const filteredGroup = user.role === "NhanVien" ? displayedItems.filter(task => task.IdnhanVien === user.IdnhanVien) : displayedItems;

    // const totalPages = user.role === "NhanVien" ? Math.ceil(filteredGroup.length / itemPerPage) : Math.ceil(taskProgress.length / itemPerPage);
    const filteredTaskProgress = user.role === "NhanVien"
        ? taskProgress.filter(task => task.IdnhanVien === user.IdnhanVien)
        : taskProgress;

    const totalPages = Math.ceil(filteredTaskProgress.length / itemPerPage);

    const startIndex = (currentPage - 1) * itemPerPage;
    const displayedItems = filteredTaskProgress.slice(startIndex, startIndex + itemPerPage);


    // console.log(filteredGroup);

    // Render UI công việcviệc
    useEffect(() => {
        axios.get(`${API_BASE_URL}/TaskCons`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json",
            }
        })
            .then(response => setTaskProgress(response.data))
            .catch(error => console.error("Loi khi goi API:", error));
    }, [])

    // Search công việc
    const handleSearch = async () => {
        if (!searchInput.trim()) return;
        try {
            const response = await axios.get(`${API_BASE_URL}/TaskCons/by-name/${searchInput}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
            });
            setTaskProgress(response.data);
        } catch (error) {
            console.error("Lỗi khi gọi API :", error);
        }
    }

    // console.log(taskProgress);

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
                <h1 className='font-semibold text-[20px] text-[#1CA756] uppercase'>Danh sách công việc con đã có</h1>
                <button onClick={() => setIsModalOpen(true)} className='w-[105px] flex bg-[#1ca756] !p-[10px] rounded-[6px] cursor-pointer hover:bg-[#158f46] transition duration-300'>
                    <IoIosAdd className='text-[#e3f4e9] text-xl' />
                    <span className='text-[#e3f4e9] text-[14px] font-medium'>Thêm mới</span>
                </button>
            </div>
            <div>
                <div className='overflow-hidden rounded-[12px] border border-[#1CA756] !mb-[18px]'>
                    <DocumentTable displayedItems={displayedItems} startIndex={startIndex} user={user} taskProgress={taskProgress} setTaskProgress={setTaskProgress} />
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
            <ModalAdd isOpen={isModalOpen} taskProgress={taskProgress} setTaskProgress={setTaskProgress} user={user} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}

export default ProgressProjectList