import React, { use, useEffect, useState } from 'react'
import { MdOutlineSearch } from 'react-icons/md'
import { IoIosAdd, IoMdTrash, IoIosCloseCircleOutline } from "react-icons/io";
import { IoCloseSharp, IoEyeOutline, IoSad, IoCheckmarkOutline } from "react-icons/io5";
import { HiOutlinePencil } from "react-icons/hi2";
import { motion } from "framer-motion";
import DateTime from "../components/Datepicker"
import axios from 'axios';
import API_BASE_URL from "../../api";
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const DocumentTable = ({ displayedItems, startIndex, user, taskProject, setTaskProject }) => {
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

    const handeDelete = (group) => {
        setSelectedGroup(group);
        setIsModalDeleteOpen(true);
    }


    // Xử lí chuyển đổi đã tạo => đã được giao
    const handleCheck = async (item) => {
        setIsLoading(true);
        try {
            const response = await axios.put(`${API_BASE_URL}/Tasks/accept/${item.Idtask}`, {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            console.log(response.data);
            setTaskProject((prevTaskProject) =>
                prevTaskProject.map((project) =>
                    project.Idtask === item.Idtask ? response.data : project
                )
            )

            toast.success("Công việc con từ đã tạo sang đang thực hiện thành công!");
        } catch (error) {
            // toast.error(error.response?.data?.message || "Lỗi khi sửa cong viec con!");
            toast.error(error.response?.data?.message || error.message || "Lỗi khi chuyển trạng thái công việc!");
        } finally {
            setIsLoading(false);
        }
    };

    // Xử lí chuyển đổi đã tạo => từ chối
    const handleRefuse = async (item) => {
        setIsLoading(true);
        try {
            const response = await axios.put(`${API_BASE_URL}/Tasks/decline/${item.Idtask}`, {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            console.log(response.data);

            setTaskProject((prevTaskTask) =>
                prevTaskTask.map((task) =>
                    task.Idtask === item.Idtask ? response.data : task
                )
            )

            toast.success("Công việc bị từ chối!");
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Lỗi khi chuyển trạng thái công việc!");
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Đã tạo":
                return "text-[#4B5563[";
            case "Đã được giao":
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
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item?.CodeTank}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.TenTask}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.NgayGiaoTask}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.NgayKetThucTask}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.CodeDuAn}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.HoTenNhanVien}</td>
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
                    user.role === "NhanVien" ? (
                        <>
                            {item.TrangThai === "Đã tạo" && (
                                <>
                                    <button onClick={() => handleCheck(item)} className="text-green-500 hover:text-green-700 text-[20px] cursor-pointer">
                                        <IoCheckmarkOutline />
                                    </button>
                                    <button onClick={() => handleRefuse(item)} className="text-[#FDAF17] hover:text-[#ffd176] text-[20px] cursor-pointer">
                                        <IoIosCloseCircleOutline />
                                    </button>
                                </>
                            )}

                        </>
                    ) : (
                        <>
                            {user.role !== "Admin" && (

                                <button onClick={() => handeViewEdit(item)} className="text-green-500 hover:text-green-700 text-[20px] cursor-pointer">
                                    <HiOutlinePencil />
                                </button>
                            )
                            }
                            <button onClick={() => handeDelete(item)} className="text-red-500 hover:text-red-700 text-[20px] cursor-pointer">
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
                        <th className="!p-3 border-r">Task ID</th>
                        <th className="!p-3 border-r">Tên Task</th>
                        <th className="!p-3 border-r">Ngày bắt đầu</th>
                        <th className="!p-3 border-r">Ngày kết thúc</th>
                        <th className="!p-3 border-r">ID dự án</th>
                        <th className="!p-3 border-r">ID nhân viên nhận</th>
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
            <ModalSeen isOpen={isModalSeenOpen} disabled={disable} selectedGroup={selectedGroup} onClose={() => setIsModalSeenOpen(false)} />
            <ModalEdit isOpen={isModalEditOpen} user={user} taskProject={taskProject} setTaskProject={setTaskProject} selectedGroup={selectedGroup} onClose={() => setIsModalEditOpen(false)} />
            <ModalDeltele isOpen={isModalDeleteOpen} setTaskProject={setTaskProject} selectedGroup={selectedGroup} onClose={() => setIsModalDeleteOpen(false)} />
        </>
    )
}

// Add Model
const ModalAdd = ({ isOpen, onClose, taskProject, setTaskProject, user }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        taskName: '',
        startDate: '',
        endDate: '',
        employeeTaskId: '',
        deadline: '',
        projectId: '',
        desc: '',
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const seen = new Set();
    const uniqueProjects = taskProject.filter(item => {
        if (seen.has(item.IdduAn)) {
            return false;
        }
        seen.add(item.IdduAn);
        return true;
    });

    const mana = new Set();
    const uniqueManage = taskProject.filter(item => {
        if (mana.has(item.IdnhanVien)) {
            return false;
        }
        mana.add(item.IdnhanVien);
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

    const selectedDeadline = formData.deadline ? new Date(formData.deadline) : null;
    const formattedDeadline = selectedDeadline instanceof Date && !isNaN(selectedDeadline)
        ? `${selectedDeadline.getFullYear()}-${String(selectedDeadline.getMonth() + 1).padStart(2, '0')}-${String(selectedDeadline.getDate()).padStart(2, '0')}`
        : '';

    const requestData = {
        TenTask: formData.taskName,
        NgayGiaoTask: formattedStartDate,
        NgayKetThucTask: formattedEndDate,
        IdnguoiTaoTask: user.IdtruongNhom,
        IdnhanVienNhanTask: formData.employeeTaskId,
        Deadline: formattedDeadline,
        IdduAn: formData.projectId,
        MoTaCongViec: formData.desc,
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/Tasks`, requestData, {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            toast.success("Công việc đã được thêm thành công!");

            setTaskProject((prevTaskProjects) => {
                const updatedTaskProjects = [...prevTaskProjects, response.data];
                console.log("Danh sách cong viec sau khi thêm:", updatedTaskProjects);
                return updatedTaskProjects;
            });

            setFormData({
                taskName: '',
                startDate: '',
                endDate: '',
                employeeTaskId: '',
                deadline: '',
                projectId: '',
                desc: '',
            });

            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi thêm cong viec!");
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
                <h2 className="text-[#1CA756] text-xl font-bold !mb-[18px]">Thêm mới công việc</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium text-[#4B5563]">Tên Task <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                name='taskName'
                                value={formData.taskName}
                                onChange={handleChange}
                                className="w-full border rounded !py-[8px] !px-[10px]"
                                placeholder="Tên task"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">ID quản lý giao dự án <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                readOnly
                                className="w-full border !py-[8px] !px-[10px] rounded bg-[#F5F5F5]"
                                placeholder="Hệ thống tự lấy theo ID tài khoản đang tạo"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Ngày tạo task <span className='text-red-600'>*</span></label>
                            <div>
                                <DateTime
                                    value={formData.startDate}
                                    datePlc="Ngày được giao task"
                                    onChange={(date) => setFormData({ ...formData, startDate: date })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Ngày kết thúc <span className='text-red-600'>*</span></label>
                            <div>
                                <DateTime
                                    value={formData.endDate}
                                    datePlc="Ngày kết thúc"
                                    onChange={(date) => setFormData({ ...formData, endDate: date })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">ID dự án <span className='text-red-600'>*</span></label>
                            <select
                                name='projectId'
                                value={formData.projectId}
                                onChange={handleChange}
                                className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]"
                            >
                                <option>Chọn dự án</option>
                                {uniqueProjects.map((item, index) => (
                                    <option key={index} value={item.IdduAn}>
                                        {item.CodeDuAn}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">ID nhân viên nhận task <span className='text-red-600'>*</span></label>
                            <select
                                name='employeeTaskId'
                                value={formData.employeeTaskId}
                                onChange={handleChange}
                                className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]"
                            >
                                <option>Chọn nhân viên</option>
                                {uniqueManage.map((item, index) => (
                                    <option key={index} value={item.IdnhanVien}>
                                        {item.HoTenNhanVien}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Tiến độ công việc <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                readOnly
                                className="w-full border !py-[8px] !px-[10px] rounded bg-[#F5F5F5]"
                                placeholder="Đã tạo"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Deadline <span className='text-red-600'>*</span></label>
                            <div>
                                <DateTime
                                    value={formData.deadline}
                                    datePlc="Deadline"
                                    onChange={(date) => setFormData({ ...formData, deadline: date })}
                                />
                            </div>
                        </div>
                        <div className='col-span-2'>
                            <label className="block font-medium text-[#4B5563]">Mô tả nhóm <span className='text-red-600'>*</span></label>
                            <textarea
                                name='desc'
                                value={formData.desc}
                                onChange={handleChange}
                                className="w-full h-[250px] p-2 border !py-[8px] !px-[10px] border-gray-300 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 transition-all resize-none"
                                placeholder="Mô tả"
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
                    <h2 className="text-[#1CA756] text-xl font-bold !mb-[18px]">Xem chi tiết thông tin công việc</h2>
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
                        <label className="block font-medium text-[#4B5563]">Task ID <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border rounded !py-[8px] !px-[10px]"
                            placeholder={selectedGroup.CodeTank}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">ID quản lý giao dự án <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.HoTenTruongNhom}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Ngày tạo task <span className='text-red-600'>*</span></label>
                        <div>
                            <DateTime disable={disabled} datePlc={selectedGroup.NgayGiaoTask} />
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Ngày kết thúc <span className='text-red-600'>*</span></label>
                        <div>
                            <DateTime disable={disabled} datePlc={selectedGroup.NgayKetThucTask} />
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">ID dự án <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.CodeDuAn}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">ID nhân viên nhận task <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.HoTenNhanVien}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Tiến độ công việc <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.TrangThai}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Deadline <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.Deadline}
                        />
                    </div>
                    <div className='col-span-2'>
                        <label className="block font-medium text-[#4B5563]">Mô tả nhóm <span className='text-red-600'>*</span></label>
                        <textarea
                            readOnly
                            className="w-full h-[250px] p-2 border !py-[8px] !px-[10px] border-gray-300 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 transition-all resize-none"
                            placeholder={selectedGroup.MoTaCongViec}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Edit Model
const ModalEdit = ({ isOpen, onClose, selectedGroup, taskProject, setTaskProject, user }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        taskName: '',
        startDate: '',
        endDate: '',
        employeeTaskId: '',
        deadline: '',
        projectId: '',
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

    const selectedDeadline = formData.deadline ? new Date(formData.deadline) : null;
    const formattedDeadline = selectedDeadline instanceof Date && !isNaN(selectedDeadline)
        ? `${selectedDeadline.getFullYear()}-${String(selectedDeadline.getMonth() + 1).padStart(2, '0')}-${String(selectedDeadline.getDate()).padStart(2, '0')}`
        : '';

    const requestData = {
        TenTask: formData.taskName === "" ? selectedGroup?.TenTask : formData.taskName,
        NgayGiaoTask: formattedStartDate === "" ? selectedGroup?.NgayGiaoTask : formattedStartDate,
        NgayKetThucTask: formattedEndDate === "" ? selectedGroup?.NgayKetThucTask : formattedEndDate,
        IdnguoiTaoTask: user.IdtruongNhom,
        IdnhanVienNhanTask: formData.employeeTaskId === "" ? selectedGroup?.IdnhanVien : formData.employeeTaskId,
        Deadline: formattedDeadline === "" ? selectedGroup?.Deadline : formattedDeadline,
        IdduAn: formData.projectId === "" ? selectedGroup?.IdduAn : formData.projectId,
        MoTaCongViec: formData.desc === "" ? selectedGroup?.MoTaCongViec : formData.desc,
        TrangThai: selectedGroup?.TrangThai,
        Idtask: selectedGroup?.Idtask,
    }

    // console.log(requestData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.put(`${API_BASE_URL}/Tasks/${selectedGroup.Idtask}`, requestData, {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            toast.success("Công việc đã được sửa thêm thành công!");

            setTaskProject((prevTaskProjects) =>
                prevTaskProjects.map((task) =>
                    task.Idtask === selectedGroup.Idtask ? response.data : task
                )
            )

            setFormData({
                taskName: '',
                startDate: '',
                endDate: '',
                employeeTaskId: '',
                deadline: '',
                projectId: '',
                desc: '',
            });

            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi thêm cong viec!");
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
                <h2 className="text-[#1CA756] text-xl font-bold !mb-[18px]">Chỉnh sửa thông tin công việc</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium text-[#4B5563]">Tên Task <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                name='taskName'
                                value={formData.taskName}
                                onChange={handleChange}
                                className="w-full border rounded !py-[8px] !px-[10px]"
                                placeholder={selectedGroup.TenTask}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">ID quản lý giao dự án <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                readOnly
                                className="w-full border !py-[8px] !px-[10px] rounded bg-[#F5F5F5]"
                                placeholder={selectedGroup.CodeTank}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Ngày tạo task <span className='text-red-600'>*</span></label>
                            <div>
                                <DateTime
                                    value={formData.startDate}
                                    datePlc={selectedGroup.NgayGiaoTask}
                                    onChange={(date) => setFormData({ ...formData, startDate: date })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Ngày kết thúc <span className='text-red-600'>*</span></label>
                            <div>
                                <DateTime
                                    value={formData.endDate}
                                    datePlc={selectedGroup.NgayKetThucTask}
                                    onChange={(date) => setFormData({ ...formData, endDate: date })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">ID dự án <span className='text-red-600'>*</span></label>
                            <select
                                name='projectId'
                                value={formData.projectId}
                                onChange={handleChange}
                                className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]"
                            >
                                <option>{selectedGroup.CodeDuAn}</option>
                                {taskProject.map((item, index) => (
                                    <option key={index} value={item.IdduAn}>
                                        {item.CodeDuAn}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">ID nhân viên nhận task <span className='text-red-600'>*</span></label>
                            <select
                                name='employeeTaskId'
                                value={formData.employeeTaskId}
                                onChange={handleChange}
                                className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]"
                            >
                                <option>{selectedGroup.HoTenNhanVien}</option>
                                {taskProject.map((item, index) => (
                                    <option key={index} value={item.IdnhanVien}>
                                        {item.HoTenNhanVien}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Tiến độ công việc <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                readOnly
                                className="w-full border !py-[8px] !px-[10px] rounded bg-[#F5F5F5]"
                                placeholder={selectedGroup.TrangThai}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Deadline <span className='text-red-600'>*</span></label>
                            <div>
                                <DateTime
                                    value={formData.deadline}
                                    datePlc={selectedGroup.Deadline}
                                    onChange={(date) => setFormData({ ...formData, deadline: date })}
                                />
                            </div>
                        </div>
                        <div className='col-span-2'>
                            <label className="block font-medium text-[#4B5563]">Mô tả nhóm <span className='text-red-600'>*</span></label>
                            <textarea
                                name='desc'
                                value={formData.desc}
                                onChange={handleChange}
                                className="w-full h-[250px] p-2 border !py-[8px] !px-[10px] border-gray-300 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 transition-all resize-none"
                                placeholder={selectedGroup.MoTaCongViec}
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
const ModalDeltele = ({ isOpen, onClose, selectedGroup, setTaskProject }) => {
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        if (deleteId !== null) {
            axios.delete(`${API_BASE_URL}/Tasks/${deleteId}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                }
            })
                .then(() => {
                    console.log(`Xóa cong viec ${deleteId} thành công!`);
                    setTaskProject(prevTaskProject => prevTaskProject.filter(task => task.Idtask !== deleteId))
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
                        onClick={() => handleDelete(selectedGroup.Idtask)}
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

const TaskProjectList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskProject, setTaskProject] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const { user } = useSelector((state) => state.auth);
    const itemPerPage = 10;

    // const totalPages = Math.ceil(taskProject.length / itemPerPage);
    // const startIndex = (currentPage - 1) * itemPerPage;
    // const displayedItems = taskProject.slice(startIndex, startIndex + itemPerPage);

    const startIndex = (currentPage - 1) * itemPerPage;
    const displayedItems = taskProject.slice(startIndex, startIndex + itemPerPage);
    const filteredGroup = user.role === "NhanVien" ? displayedItems.filter(task => task.IdnhanVien === user.IdnhanVien) : displayedItems;

    const totalPages = user.role === "NhanVien" ? Math.ceil(filteredGroup.length / itemPerPage) : Math.ceil(taskProject.length / itemPerPage);

    // Render UI công việcviệc
    useEffect(() => {
        axios.get(`${API_BASE_URL}/Tasks`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json",
            }
        })
            .then(response => setTaskProject(response.data))
            .catch(error => console.error("Loi khi goi API:", error));
    }, [])

    console.log(taskProject);

    // Search công việc
    const handleSearch = async () => {
        if (!searchInput.trim()) return;
        try {
            const response = await axios.get(`${API_BASE_URL}/Tasks/by-name/${searchInput}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
            });
            setTaskProject(response.data);
        } catch (error) {
            console.error("Lỗi khi gọi API :", error);
        }
    }

    // console.log(searchInput);
    // console.log(taskProject);

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
                <h1 className='font-semibold text-[20px] text-[#1CA756] uppercase'>Danh sách công việc đã có</h1>
                {user.role === "TruongNhom" && (
                    <button onClick={() => setIsModalOpen(true)} className='w-[105px] flex bg-[#1ca756] !p-[10px] rounded-[6px] cursor-pointer hover:bg-[#158f46] transition duration-300'>
                        <IoIosAdd className='text-[#e3f4e9] text-xl' />
                        <span className='text-[#e3f4e9] text-[14px] font-medium'>Thêm mới</span>
                    </button>
                )}

            </div>
            <div>
                <div className='overflow-hidden rounded-[12px] border border-[#1CA756] !mb-[18px]'>
                    <DocumentTable displayedItems={displayedItems} startIndex={startIndex} user={user} taskProject={taskProject} setTaskProject={setTaskProject} />
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
            <ModalAdd isOpen={isModalOpen} user={user} taskProject={taskProject} setTaskProject={setTaskProject} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}

export default TaskProjectList