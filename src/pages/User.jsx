import React, { use, useEffect, useState } from 'react';
import { MdOutlineSearch } from 'react-icons/md';
import { IoIosAdd, IoMdTrash } from "react-icons/io";
import { IoCloseSharp, IoEyeOutline, IoSad } from "react-icons/io5";
import { HiOutlinePencil, HiOutlinePaperAirplane } from "react-icons/hi2";
import { motion } from "framer-motion";
import DateTime from "../components/Datepicker";
import axios from 'axios';
import API_BASE_URL from "../../api";
import { toast } from 'sonner';


const DocumentTable = ({ displayedItems, startIndex, setAccounts, account }) => {
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
        setSelectedGroup(group);
        setIsModalDeleteOpen(true)
    }

    const TableRow = ({ item, num }) => (

        <tr className="text-center border-t border-[#1CA756] hover:bg-gray-100 dark:hover:bg-[#9ac898]">
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{startIndex + num + 1}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.CodeTaiKhoan}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item?.ThongTin?.HoTen || "Không có thông tin"}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item?.ThongTin?.Sdt || "Không có thông tin"}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.QuyenTaiKhoan}</td>
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
                        <th className="!p-3 border-r">ID tài khoản</th>
                        <th className="!p-3 border-r">Họ và tên</th>
                        <th className="!p-3 border-r">Số điện thoại</th>
                        <th className="!p-3 border-r">Quyền tài khoản</th>
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
            <ModalEdit isOpen={isModalEditOpen} selectedGroup={selectedGroup} setAccounts={setAccounts} account={account} onClose={() => setIsModalEditOpen(false)} />
            <ModalDeltele isOpen={isModalDeleteOpen} setAccounts={setAccounts} selectedGroup={selectedGroup} onClose={() => setIsModalDeleteOpen(false)} />
        </>
    )
}

// Add Model
const ModalAdd = ({ isOpen, onClose, account, setAccounts }) => {
    const [selected, setSelected] = useState("");
    const [role, setRole] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        accountName: "",
        accountPhone: "",
        accountDate: "",
        accountGender: "",
        accountEmail: "",
        accountManager: "",
        accountGroup: "",
    })

    // Xử date 
    const selectedDate = formData.accountDate ? new Date(formData.accountDate) : null;
    const formattedDate = selectedDate instanceof Date && !isNaN(selectedDate)
        ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
        : '';


    // setRole
    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    // get role nhanvien and selected nhanvien
    const handleChange = (e) => {
        setSelected(e.target.value);
        setRole("NhanVien");
    }

    // get input data
    const handleDataChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const requestData = {
        QuyenTaiKhoan: role,
        HoTen: formData.accountName,
        Sdt: formData.accountPhone,
        NgaySinh: formattedDate,
        GioiTinh: formData.accountGender,
        Email: formData.accountEmail,
        ...(role == "NhanVien" && {
            IdnguoiQuanLy: formData.accountManager,
            IdnhomLamViec: formData.accountGroup
        })
    }

    // console.log(requestData);

    //Thêm mới tài khoản
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/Register/register`, requestData, {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            toast.success("Tài khoản đã được thêm thành công!");

            setAccounts((prevAccounts) => {
                const updatedAccounts = [...prevAccounts, response.data[0]];
                console.log("Danh sách tài khoản sau khi thêm:", updatedAccounts);
                return updatedAccounts;
            });

            setFormData({
                accountName: "",
                accountPhone: "",
                accountDate: "",
                accountGender: "",
                accountEmail: "",
                accountManager: "",
                accountGroup: "",
            });

            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi thêm tài khoản!");
        } finally {
            setIsLoading(false);
        }
    };

    // console.log(formData);

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
                <h2 className="text-[#1CA756] text-xl font-bold !mb-[18px]">Thêm mới tài khoản</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className='col-span-2 flex items-center gap-x-[10px]'>
                            <>
                                <label class="relative flex items-center cursor-pointer" for="quanly">
                                    <input onClick={() => setSelected("off")} onChange={handleRoleChange} value="TruongNhom" name="framework" type="radio" class="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all" id="quanly" />
                                    <span class="absolute bg-[#1CA756] w-[10px] h-[10px] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    </span>
                                </label>
                                <label class="ml-2 text-slate-600 cursor-pointer" for="quanly">Quản lý</label>
                            </>
                            <>
                                <label class="relative flex items-center cursor-pointer" for="admin">
                                    <input onClick={() => setSelected("off")} onChange={handleRoleChange} value="Admin" name="framework" type="radio" class="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all" id="admin" />
                                    <span class="absolute bg-[#1CA756] w-[10px] h-[10px] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    </span>
                                </label>
                                <label class="ml-2 text-slate-600 cursor-pointer" for="admin">Admin</label>
                            </>
                            <>
                                <label class="relative flex items-center cursor-pointer" for="nhanvien">
                                    <input onChange={handleChange} name="framework" type="radio" class="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all" id="nhanvien" />
                                    <span class="absolute bg-[#1CA756] w-[10px] h-[10px] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    </span>
                                </label>
                                <label class="ml-2 text-slate-600 cursor-pointer" for="nhanvien">Nhân viên</label>
                            </>
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">ID tài khoản<span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                readOnly
                                className="w-full border rounded !py-[8px] !px-[10px] bg-[#F5F5F5]"
                                placeholder="ID tài khoản tự động"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Họ và tên<span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                name="accountName"
                                value={formData.accountName}
                                onChange={handleDataChange}
                                required
                                className="w-full border !py-[8px] !px-[10px] rounded"
                                placeholder="Nhập họ và tên"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Số điện thoại<span className='text-red-600'>*</span></label>
                            <input
                                type="tel"
                                pattern="\d{10}"
                                maxLength="11"
                                onInput="this.value = this.value.replace(/\D/g, '').slice(0, 10)"
                                title="Số điện thoại phải có đúng 10 chữ số"
                                name="accountPhone"
                                value={formData.accountPhone}
                                onChange={handleDataChange}
                                className="w-full border !py-[8px] !px-[10px] rounded"
                                placeholder="Nhập số điện thoại"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Ngày tháng năm sinh<span className='text-red-600'>*</span></label>
                            <DateTime
                                datePlc={"Ngày tháng năm sinh"}
                                value={formData.accountDate}
                                onChange={(date) => setFormData({ ...formData, accountDate: date })}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Giới tính<span className='text-red-600'>*</span></label>
                            <select
                                name="accountGender"
                                value={formData.accountGender}
                                onChange={handleDataChange}
                                required
                                className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]"
                            >
                                <option>Chọn giới tính</option>
                                <option>Nam</option>
                                <option>Nữ</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Email<span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                name="accountEmail"
                                value={formData.accountEmail}
                                onChange={handleDataChange}
                                required
                                className="w-full border !py-[8px] !px-[10px] rounded"
                                placeholder="Email"
                            />
                        </div>
                        {
                            selected === "on" && (
                                <>
                                    <div>
                                        <label className="block font-medium text-[#4B5563]">Người quản lý<span className='text-red-600'>*</span></label>
                                        <select
                                            name="accountManager"
                                            value={formData.accountManager}
                                            onChange={handleDataChange}
                                            required
                                            className="max-h-40 overflow-auto bottom-auto w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]"
                                        >
                                            <option>Chọn tên người quản lý</option>
                                            {[...new Set(account.map((item) => item.ThongTin.HoTenTruongNhom))].map((name, index) => (
                                                <option key={index} value={account[index].ThongTin.IdtruongNhom}>
                                                    {name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-medium text-[#4B5563]">Nhóm<span className='text-red-600'>*</span></label>
                                        <select
                                            name="accountGroup"
                                            value={formData.accountGroup}
                                            onChange={handleDataChange}
                                            required
                                            className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]"
                                        >
                                            <option>Chọn tên nhóm</option>
                                            {[...new Set(account.map((item) => item.ThongTin.TenNhom))].map((group, index) => (
                                                <option key={index} value={account[index].ThongTin.IdnhomLamViec}>
                                                    {group}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )
                        }
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
                    <h2 className="text-[#1CA756] text-xl font-bold !mb-[18px]">Xem chi tiết thông tin tài khoản</h2>
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
                    <div className='col-span-2 flex items-center gap-x-[10px]'>
                        <>
                            <label class="relative flex items-center" for="quanly">
                                <input name="framework" type="radio" class="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all" id="quanly" />
                                <span class="absolute bg-[#1CA756] w-[10px] h-[10px] rounded-full transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                </span>
                            </label>
                            <label class="ml-2 text-slate-600" for="quanly">
                                {selectedGroup.QuyenTaiKhoan === "NhanVien" ? "Nhân viên" : selectedGroup.QuyenTaiKhoan === "Admin" ? "Admin" : "Quản lý"}
                            </label>
                        </>
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">ID tài khoản<span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border rounded !py-[8px] !px-[10px]"
                            placeholder={selectedGroup.CodeTaiKhoan}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Họ và tên<span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup?.ThongTin?.HoTen || "Không có thông tin"}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Số điện thoại<span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup?.ThongTin?.Sdt || "Không có thông tin"}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Ngày tháng năm sinh<span className='text-red-600'>*</span></label>
                        <DateTime datePlc={selectedGroup?.ThongTin?.NgaySinh || "Không có thông tin"} disable={disabled} />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Giới tính<span className='text-red-600'>*</span></label>
                        {/* <select className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]">
                            <option>{selectedGroup?.ThongTin?.GioiTinh || "Không có thông tin"}</option>
                        </select> */}
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup?.ThongTin?.GioiTinh || "Không có thông tin"}
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-[#4B5563]">Email<span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup?.ThongTin?.Email || "Không có thông tin"}
                        />
                    </div>
                    {
                        selectedGroup.QuyenTaiKhoan === "NhanVien" && (
                            <>
                                <div>
                                    <label className="block font-medium text-[#4B5563]">Người quản lý<span className='text-red-600'>*</span></label>
                                    <input
                                        type="text"
                                        readOnly
                                        className="w-full border !py-[8px] !px-[10px] rounded"
                                        placeholder={selectedGroup?.ThongTin?.HoTenTruongNhom || "Không có thông tin"}
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-[#4B5563]">Nhóm<span className='text-red-600'>*</span></label>
                                    <input
                                        type="text"
                                        readOnly
                                        className="w-full border !py-[8px] !px-[10px] rounded"
                                        placeholder={selectedGroup?.ThongTin?.TenNhom || "Không có thông tin"}
                                    />
                                </div>
                            </>
                        )
                    }
                </div>
            </motion.div>
        </div>
    );
};

// Edit Model
const ModalEdit = ({ isOpen, onClose, selectedGroup, account, setAccounts }) => {
    const [selected, setSelected] = useState("");
    const [role, setRole] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        accountName: "",
        accountPhone: "",
        accountDate: "",
        accountGender: "",
        accountEmail: "",
        accountManager: "",
        accountGroup: "",
    })

    // Xử date 
    const selectedDate = formData.accountDate ? new Date(formData.accountDate) : null;
    const formattedDate = selectedDate instanceof Date && !isNaN(selectedDate)
        ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
        : '';


    // setRole
    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    // get role nhanvien and selected nhanvien
    const handleChange = (e) => {
        setSelected(e.target.value);
        setRole("NhanVien");
    }

    // get input data
    const handleDataChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }


    const requestData = {
        // Idnhanvien: selectedGroup?.ThongTin?.IdnhanVien,
        // ...(selectedGroup?.QuyenTaiKhoan === "NhanVien" ? Idnhanvien : selectedGroup?.ThongTin?.IdnhanVien ? selectedGroup?.QuyenTaiKhoan === "Admin" ? Idnhanvien : selectedGroup?.ThongTin?.Idadmin : selectedGroup?.ThongTin?.IdtruongNhom),
        IdtaiKhoan: selectedGroup?.IdtaiKhoan,
        ...(selectedGroup?.QuyenTaiKhoan === "NhanVien" && {
            Idnhanvien: selectedGroup?.ThongTin?.IdnhanVien,
            HoTenNhanVien: formData.accountName === "" ? selectedGroup?.ThongTin?.HoTen : formData.accountName,
        }),
        ...(selectedGroup?.QuyenTaiKhoan === "Admin" && {
            Idadmin: selectedGroup?.ThongTin?.Idadmin,
            HoTenAdmin: formData.accountName === "" ? selectedGroup?.ThongTin?.HoTen : formData.accountName,
        }),
        ...(selectedGroup?.QuyenTaiKhoan === "TruongNhom" && {
            IdtruongNhom: selectedGroup?.ThongTin?.IdtruongNhom,
            HoTenTruongNhom: formData.accountName === "" ? selectedGroup?.ThongTin?.HoTen : formData.accountName,
        }),
        // QuyenTaiKhoan: selectedGroup?.QuyenTaiKhoan,
        // HoTenNhanVien: formData.accountName === "" ? selectedGroup?.ThongTin?.HoTen : formData.accountName,
        Sdt: formData.accountPhone === "" ? selectedGroup?.ThongTin?.Sdt : formData.accountPhone,
        NgaySinh: formattedDate === "" ? selectedGroup?.ThongTin?.NgaySinh : formattedDate,
        GioiTinh: formData.accountGender === "" ? selectedGroup?.ThongTin?.GioiTinh : formData.accountGender,
        Email: formData.accountEmail === "" ? selectedGroup?.ThongTin?.Email : formData.accountEmail,
        ...(selectedGroup?.QuyenTaiKhoan === "NhanVien" && {
            IdnguoiQuanLy: formData.accountManager === "" ? selectedGroup?.ThongTin?.IdtruongNhom : formData.accountManager,
            IdnhomLamViec: formData.accountGroup === "" ? selectedGroup?.ThongTin?.IdnhomLamViec : formData.accountGroup
        })
    }

    const roleEndpoint = selectedGroup?.QuyenTaiKhoan === "NhanVien"
        ? "NhanViens"
        : selectedGroup?.QuyenTaiKhoan === "Admin"
            ? "Admins"
            : "TruongNhoms";


    const idEndpoint = roleEndpoint === "NhanViens" ? selectedGroup?.ThongTin?.IdnhanVien : roleEndpoint === "Admins" ? selectedGroup?.ThongTin?.Idadmin : selectedGroup?.ThongTin?.IdtruongNhom;


    console.log(roleEndpoint);
    console.log(idEndpoint);
    // console.log(selectedGroup?.QuyenTaiKhoan);

    //Thêm mới tài khoản
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.put(`${API_BASE_URL}/${roleEndpoint}/${idEndpoint}`, requestData, {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            console.log(response.data)

            setAccounts((prevAccounts) =>
                prevAccounts.map((account) =>
                    (roleEndpoint === "NhanViens" ? (account?.ThongTin?.IdnhanVien === selectedGroup?.ThongTin?.IdnhanVien) : roleEndpoint === "Admins" ? (account?.ThongTin?.Idadmin === selectedGroup?.ThongTin?.Idadmin) : (account?.ThongTin?.IdtruongNhom === selectedGroup?.ThongTin?.IdtruongNhom))
                        ? response.data : account
                )
            );

            toast.success("Tài khoản đã được thêm thành công!");

            setFormData({
                accountName: "",
                accountPhone: "",
                accountDate: "",
                accountGender: "",
                accountEmail: "",
                accountManager: "",
                accountGroup: "",
            });

            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi sua tài khoản!");
        } finally {
            setIsLoading(false);

        }
    };

    // console.log(formData);
    console.log(requestData);
    // console.log(selectedGroup)

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
                <h2 className="text-[#1CA756] text-xl font-bold !mb-[18px]">Chỉnh sửa thông tin tài khoản</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className='col-span-2 flex items-center gap-x-[10px]'>
                            <>
                                <label class="relative flex items-center" for="quanly">
                                    <input name="framework" type="radio" class="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all" id="quanly" />
                                    <span class="absolute bg-[#1CA756] w-[10px] h-[10px] rounded-full transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    </span>
                                </label>
                                <label class="ml-2 text-slate-600" for="quanly">
                                    {selectedGroup.QuyenTaiKhoan === "NhanVien" ? "Nhân viên" : selectedGroup.QuyenTaiKhoan === "Admin" ? "Admin" : "Quản lý"}
                                </label>
                            </>
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">ID tài khoản<span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                readOnly
                                className="w-full border rounded !py-[8px] !px-[10px]"
                                placeholder={selectedGroup.CodeTaiKhoan}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Họ và tên<span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                name="accountName"
                                value={formData.accountName}
                                onChange={handleDataChange}
                                className="w-full border !py-[8px] !px-[10px] rounded"
                                placeholder={selectedGroup?.ThongTin?.HoTen}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Số điện thoại<span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                name="accountPhone"
                                value={formData.accountPhone}
                                onChange={handleDataChange}
                                className="w-full border !py-[8px] !px-[10px] rounded"
                                placeholder={selectedGroup?.ThongTin?.Sdt}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Ngày tháng năm sinh<span className='text-red-600'>*</span></label>
                            <DateTime
                                datePlc={selectedGroup?.ThongTin?.NgaySinh || "Không có thông tin"}
                                value={formData.accountDate}
                                onChange={(date) => setFormData({ ...formData, accountDate: date })}
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Giới tính<span className='text-red-600'>*</span></label>
                            <select
                                name="accountGender"
                                value={formData.accountGender}
                                onChange={handleDataChange}
                                className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]"
                            >
                                <option>{selectedGroup?.ThongTin?.GioiTinh}</option>
                                <option>Nam</option>
                                <option>Nữ</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium text-[#4B5563]">Email<span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                name="accountEmail"
                                value={formData.accountEmail}
                                onChange={handleDataChange}
                                className="w-full border !py-[8px] !px-[10px] rounded"
                                placeholder={selectedGroup?.ThongTin?.Email}
                            />
                        </div>
                        {
                            selectedGroup.QuyenTaiKhoan === "NhanVien" && (
                                <>
                                    <div>
                                        <label className="block font-medium text-[#4B5563]">Người quản lý<span className='text-red-600'>*</span></label>
                                        <select
                                            name="accountManager"
                                            value={formData.accountManager}
                                            onChange={handleDataChange}
                                            className="max-h-40 overflow-auto bottom-auto w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]"
                                        >
                                            <option>{selectedGroup?.ThongTin?.HoTenTruongNhom}</option>
                                            {[...new Set(account.map((item) => item?.ThongTin?.HoTenTruongNhom))].map((name, index) => (
                                                <option key={index} value={account[index]?.ThongTin?.IdtruongNhom}>
                                                    {name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-medium text-[#4B5563]">Nhóm<span className='text-red-600'>*</span></label>
                                        <select
                                            name="accountGroup"
                                            value={formData.accountGroup}
                                            onChange={handleDataChange}
                                            className="w-full border rounded !py-[10px] !px-[10px] text-[#4B5563]"
                                        >
                                            <option>{selectedGroup?.ThongTin?.TenNhom}</option>
                                            {[...new Set(account.map((item) => item?.ThongTin?.TenNhom))].map((group, index) => (
                                                <option key={index} value={account[index]?.ThongTin?.IdnhomLamViec}>
                                                    {group}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )
                        }
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
const ModalDeltele = ({ isOpen, onClose, selectedGroup, setAccounts }) => {
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        if (deleteId !== null) {
            axios.delete(`${API_BASE_URL}/TaiKhoans/${deleteId}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                }
            })
                .then(() => {
                    console.log(`Xóa tài liệu ${deleteId} thành công!`);
                    setAccounts(prevDoc => prevDoc.filter(doc => doc.IdtaiKhoan !== deleteId))
                    onClose();
                })
                .catch(error => console.error("Lỗi khi xóa tài liệu:", error))
                .finally(() => setDeleteId(null));
        }
    }, [deleteId])

    const hanldeDeleteId = (id) => {
        setDeleteId(id);
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
                        className="!py-[8px] !px-[50px] bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                        onClick={() => hanldeDeleteId(selectedGroup.IdtaiKhoan)}
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

const User = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [account, setAccount] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const itemPerPage = 10;

    // Render UI danh sach tai khoan
    useEffect(() => {
        setUserRole('admin'); // admin, manager, employee
        axios.get(`${API_BASE_URL}/TaiKhoans`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json",
            }
        })
            .then(response => setAccount(response.data))
            .catch(error => console.error("Loi khi goi API:", error));
    }, [])

    // Search 
    const handleSearch = async () => {
        if (!searchInput.trim()) return;
        try {
            const response = await axios.get(`${API_BASE_URL}/TaiKhoans/by-name/${searchInput}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
            });
            setAccount(response.data);
        } catch (error) {
            console.error("Lỗi khi gọi API :", error);
        }
    }

    console.log(account);

    const totalPages = Math.ceil(account.length / itemPerPage);
    const startIndex = (currentPage - 1) * itemPerPage;
    const displayedItems = account.slice(startIndex, startIndex + itemPerPage);

    return (
        userRole === "admin" || userRole === "manager" ? (
            <div className='h-full bg-white !m-[20px] shadow-2xl rounded-2xl dark:bg-gray-900'>
                <div className='h-[800px] !p-[16px]'>
                    <div className='h-[36px] flex items-center justify-between gap-x-[27px]'>
                        <div className='w-64 flex flex-1 items-center !py-2 !px-3 gap-2 rounded-[8px] border-[1px] border-[#D3D3D3]'>
                            <MdOutlineSearch className='text-gray-500 text-xl' />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder='Tìm kiếm theo tên tài khoản'
                                className='flex-1 outline-none bg-transparent placeholder:text-[#a6a6a6] text-[#343030]'
                            />
                        </div>
                        <button className='w-[105px] flex bg-[#1ca756] !p-[10px] rounded-[6px] cursor-pointer hover:bg-[#158f46] transition duration-300'>
                            <MdOutlineSearch className='text-[#e3f4e9] text-xl' />
                            <span onClick={handleSearch} className='text-[#e3f4e9] text-[14px] font-medium'>Tìm kiếm</span>
                        </button>
                    </div>
                    <div className='!my-[20px] flex items-center justify-between gap-x-[27px]'>
                        <h1 className='font-semibold text-[20px] text-[#1CA756] uppercase'>Danh sách tài khoản</h1>
                        <button onClick={() => setIsModalOpen(true)} className='w-[105px] flex bg-[#1ca756] !p-[10px] rounded-[6px] cursor-pointer hover:bg-[#158f46] transition duration-300'>
                            <IoIosAdd className='text-[#e3f4e9] text-xl' />
                            <span className='text-[#e3f4e9] text-[14px] font-medium'>Thêm mới</span>
                        </button>
                    </div>
                    <div>
                        <div className='overflow-hidden rounded-[12px] border border-[#1CA756] !mb-[18px]'>
                            <DocumentTable displayedItems={displayedItems} startIndex={startIndex} setAccounts={setAccount} account={account} />
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
                    <ModalAdd setAccounts={setAccount} account={account} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                </div>
            </div>
        ) : (
            <div className='h-full bg-white !m-[20px] shadow-2xl rounded-2xl'>
                <div className='h-[800px] !p-[16px] flex flex-col justify-center'>
                    <p className='text-center text-6xl text-[#1ca756]'>Bạn không có quyền xem danh sách tài khoản!!</p>
                </div>
            </div>
        )

    )
}

export default User