import React, { useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { IoIosAdd, IoMdTrash } from "react-icons/io";
import { IoCloseSharp, IoEyeOutline } from "react-icons/io5";
import { HiOutlinePencil } from "react-icons/hi2";
import { motion } from "framer-motion";

const DocumentTable = ({ displayedItems, startIndex }) => {
  const [isModalSeenOpen, setIsModalSeenOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalSeenOpen(true);
  };

  const handleViewEdit = (user) => {
    setSelectedUser(user);
    setIsModalEditOpen(true);
  };

  const TableRow = ({ item, num }) => (
    <tr className="text-center border-t border-[#1CA756] hover:bg-gray-100">
      <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563]">
        {startIndex + num + 1}
      </td>
      <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563]">
        {item.id}
      </td>
      <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563]">
        {item.name}
      </td>
      <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563]">
        {item.phone}
      </td>
      <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563]">
        {item.expiry}
      </td>
      <td className="!py-[10px] flex justify-center items-center gap-x-[20px]">
        <button
          onClick={() => handleViewDetails(item)}
          className="text-green-500 hover:text-green-700 text-[20px] cursor-pointer"
        >
          <IoEyeOutline />
        </button>
        <button
          onClick={() => handleViewEdit(item)}
          className="text-green-500 hover:text-green-700 text-[20px] cursor-pointer"
        >
          <HiOutlinePencil />
        </button>
        <button
          onClick={() => setIsModalDeleteOpen(true)}
          className="text-red-500 hover:text-red-700 text-[20px] cursor-pointer"
        >
          <IoMdTrash />
        </button>
      </td>
    </tr>
  );

  return (
    <>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#1CA756] text-white">
            <th className="!p-3 border-r">STT</th>
            <th className="!p-3 border-r">ID Tài khoản</th>
            <th className="!p-3 border-r">Họ và Tên</th>
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
      <ModalSeen
        isOpen={isModalSeenOpen}
        selectedUser={selectedUser}
        onClose={() => setIsModalSeenOpen(false)}
      />
      <ModalEdit
        isOpen={isModalEditOpen}
        selectedUser={selectedUser}
        onClose={() => setIsModalEditOpen(false)}
      />
      <ModalDelete
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
      />
    </>
  );
};

// Data mẫu
const data = [
  {
    id: "TL001",
    name: "Tài liệu dự án A",
    phone: "Dự án A",
    expiry: "12/01/2025",
  },
  {
    id: "TL002",
    name: "Tài liệu dự án B",
    phone: "Dự án B",
    expiry: "12/01/2025",
  },
  {
    id: "TL003",
    name: "Tài liệu dự án C",
    phone: "Dự án C",
    expiry: "12/01/2025",
  },
  {
    id: "TL004",
    name: "Tài liệu dự án D",
    phone: "Dự án D",
    expiry: "12/01/2025",
  },
  {
    id: "TL005",
    name: "Tài liệu dự án E",
    phone: "Dự án E",
    expiry: "12/01/2025",
  },
  {
    id: "<ID tài liệu>",
    name: "<Tên tài liệu>",
    phone: "<Tên dự án>",
    expiry: "<Ngày tải lên>",
  },
  {
    id: "<ID tài liệu>",
    name: "<Tên tài liệu>",
    phone: "<Tên dự án>",
    expiry: "<Ngày tải lên>",
  },
  {
    id: "<ID tài liệu>",
    name: "<Tên tài liệu>",
    phone: "<Tên dự án>",
    expiry: "<Ngày tải lên>",
  },
  {
    id: "<ID tài liệu>",
    name: "<Tên tài liệu>",
    phone: "<Tên dự án>",
    expiry: "<Ngày tải lên>",
  },
  {
    id: "<ID tài liệu>",
    name: "<Tên tài liệu>",
    phone: "<Tên dự án>",
    expiry: "<Ngày tải lên>",
  },
];

// Add Modal
const ModalAdd = ({ isOpen, onClose }) => {
  const [userType, setUserType] = useState("admin");

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#00000040] backdrop-blur-xs p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white !px-4 sm:!px-[30px] !py-[24px] rounded-lg w-full max-w-[800px] max-h-[90vh] overflow-y-auto shadow-xl relative"
      >
        <div className="sticky top-0 bg-white pb-4 z-10">
          <button
            onClick={onClose}
            className="absolute right-2 sm:right-4 top-2 sm:top-4 text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 className="text-[#1CA756] text-lg sm:text-xl font-bold pr-8">
            Thêm mới tài khoản
          </h2>
        </div>

        {/* Radio buttons for user type */}
        <div className="flex flex-wrap gap-x-8 gap-y-2 !mt-4 !mb-4">
          <div className="flex items-center gap-x-1.5">
            <input
              type="radio"
              id="manager"
              name="userType"
              value="manager"
              checked={userType === "manager"}
              onChange={(e) => setUserType(e.target.value)}
              className="w-3.5 h-3.5 accent-[#008000]"
            />
            <label htmlFor="manager" className="text-[#4B5563] cursor-pointer">
              Quản lý
            </label>
          </div>
          <div className="flex items-center gap-x-1.5">
            <input
              type="radio"
              id="admin"
              name="userType"
              value="admin"
              checked={userType === "admin"}
              onChange={(e) => setUserType(e.target.value)}
              className="w-3.5 h-3.5 accent-[#008000]"
            />
            <label htmlFor="admin" className="text-[#4B5563] cursor-pointer">
              Admin
            </label>
          </div>
          <div className="flex items-center gap-x-1.5">
            <input
              type="radio"
              id="employee"
              name="userType"
              value="employee"
              checked={userType === "employee"}
              onChange={(e) => setUserType(e.target.value)}
              className="w-3.5 h-3.5 accent-[#008000]"
            />
            <label htmlFor="employee" className="text-[#4B5563] cursor-pointer">
              Nhân viên
            </label>
          </div>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-8 sm:gap-y-4">
          <div>
            <label className="block text-[#4B5563] mb-1.5">
              ID tài khoản<span className="text-red-600 ml-0.5">*</span>
            </label>
            <input
              type="text"
              className="w-full h-[38px] border border-gray-300 rounded !px-[12px] focus:outline-none focus:border-[#1CA756]"
              placeholder="BE Xem xét có auto gen dc ko, ko thì chọn nhận cho nhập tay"
            />
          </div>
          <div>
            <label className="block text-[#4B5563] mb-1.5">
              Họ và Tên<span className="text-red-600 ml-0.5">*</span>
            </label>
            <input
              type="text"
              className="w-full h-[38px] border border-gray-300 rounded !px-[12px] focus:outline-none focus:border-[#1CA756]"
              placeholder="Họ và tên"
            />
          </div>
          <div>
            <label className="block text-[#4B5563] mb-1.5">
              Số điện thoại<span className="text-red-600 ml-0.5">*</span>
            </label>
            <input
              type="text"
              className="w-full h-[38px] border border-gray-300 rounded !px-[12px] focus:outline-none focus:border-[#1CA756]"
              placeholder="Số điện thoại"
            />
          </div>
          <div>
            <label className="block text-[#4B5563] mb-1.5">
              Ngày tháng năm sinh<span className="text-red-600 ml-0.5">*</span>
            </label>
            <input
              type="date"
              className="w-full h-[38px] border border-gray-300 rounded !px-[12px] focus:outline-none focus:border-[#1CA756]"
              placeholder="Ngày tháng năm sinh"
            />
          </div>
          <div>
            <label className="block text-[#4B5563] mb-1.5">
              Giới tính<span className="text-red-600 ml-0.5">*</span>
            </label>
            <select className="w-full h-[38px] border border-gray-300 rounded !px-[12px] focus:outline-none focus:border-[#1CA756] text-[#4B5563]">
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div>
            <label className="block text-[#4B5563] mb-1.5">
              Email<span className="text-red-600 ml-0.5">*</span>
            </label>
            <input
              type="email"
              className="w-full h-[38px] border border-gray-300 rounded !px-[12px] focus:outline-none focus:border-[#1CA756]"
              placeholder="Email"
            />
          </div>

          {/* Additional fields based on user type */}
          {userType === "employee" && (
            <>
              <div>
                <label className="block text-[#4B5563] mb-1.5">
                  Người quản lý<span className="text-red-600 ml-0.5">*</span>
                </label>
                <select className="w-full h-[38px] border border-gray-300 rounded !px-[12px] focus:outline-none focus:border-[#1CA756] text-[#4B5563]">
                  <option value="">Nhập tên người quản lý</option>
                  <option value="manager1">Người quản lý 1</option>
                  <option value="manager2">Người quản lý 2</option>
                </select>
              </div>
              <div>
                <label className="block text-[#4B5563] mb-1.5">
                  Nhóm<span className="text-red-600 ml-0.5">*</span>
                </label>
                <select className="w-full h-[38px] border border-gray-300 rounded !px-[12px] focus:outline-none focus:border-[#1CA756] text-[#4B5563]">
                  <option value="">Nhóm</option>
                  <option value="group1">Nhóm 1</option>
                  <option value="group2">Nhóm 2</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-x-4 !mt-8">
          <button
            className="w-full sm:w-auto min-w-[100px] !py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
            onClick={onClose}
          >
            Hủy
          </button>
          <button className="w-full sm:w-auto min-w-[100px] !py-2 bg-[#1CA756] text-white rounded hover:bg-[#158f46]">
            Lưu
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Seen Modal
const ModalSeen = ({ isOpen, onClose, selectedUser }) => {
  if (!isOpen) return null;

  // Xác định role dựa vào ID
  const isEmployee = selectedUser?.id === "TL002";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#00000040] backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white !px-[30px] !py-[24px] rounded-lg w-[800px] shadow-xl relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-[#1CA756] text-xl font-bold !mb-[24px]">
          Xem chi tiết thông tin tài khoản
        </h2>

        {/* Single radio button for role */}
        <div className="!mb-[30px]">
          <div className="flex items-center gap-x-1.5">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-[#008000] relative">
              <div className="absolute inset-[2px] rounded-full bg-[#008000]"></div>
            </div>
            <label className="text-[#4B5563] cursor-default">
              {isEmployee ? "Nhân viên" : "Admin"}
            </label>
          </div>
        </div>

        {/* Form fields in two columns */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <label className="block text-[#4B5563] mb-1.5">
              ID tài khoản<span className="text-red-600 ml-0.5">*</span>
            </label>
            <input
              type="text"
              readOnly
              className="w-full h-[38px] border border-gray-300 rounded !px-[12px] bg-white"
              value={selectedUser?.id || "TL002"}
            />
          </div>
          <div>
            <label className="block text-[#4B5563] mb-1.5">
              Họ và Tên<span className="text-red-600 ml-0.5">*</span>
            </label>
            <input
              type="text"
              readOnly
              className="w-full h-[38px] border border-gray-300 rounded !px-[12px] bg-white"
              value="Nguyễn Văn A"
            />
          </div>
          <div>
            <label className="block text-[#4B5563] mb-1.5">
              Số điện thoại<span className="text-red-600 ml-0.5">*</span>
            </label>
            <input
              type="text"
              readOnly
              className="w-full h-[38px] border border-gray-300 rounded !px-[12px] bg-white"
              value="0987654321"
            />
          </div>
          <div>
            <label className="block text-[#4B5563] mb-1.5">
              Ngày tháng năm sinh<span className="text-red-600 ml-0.5">*</span>
            </label>
            <input
              type="text"
              readOnly
              className="w-full h-[38px] border border-gray-300 rounded !px-[12px] bg-white"
              value="15/03/1995"
            />
          </div>
          <div>
            <label className="block text-[#4B5563] mb-1.5">
              Giới tính<span className="text-red-600 ml-0.5">*</span>
            </label>
            <input
              type="text"
              readOnly
              className="w-full h-[38px] border border-gray-300 rounded !px-[12px] bg-white"
              value="Nam"
            />
          </div>
          <div>
            <label className="block text-[#4B5563] mb-1.5">
              Email<span className="text-red-600 ml-0.5">*</span>
            </label>
            <input
              type="text"
              readOnly
              className="w-full h-[38px] border border-gray-300 rounded !px-[12px] bg-white"
              value="employee@gmail.com"
            />
          </div>

          {/* Additional fields for employee */}
          {isEmployee && (
            <>
              <div>
                <label className="block text-[#4B5563] mb-1.5">
                  Người quản lý<span className="text-red-600 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  className="w-full h-[38px] border border-gray-300 rounded !px-[12px] bg-white"
                  value="Nguyễn Văn B"
                />
              </div>
              <div>
                <label className="block text-[#4B5563] mb-1.5">
                  Nhóm<span className="text-red-600 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  className="w-full h-[38px] border border-gray-300 rounded !px-[12px] bg-white"
                  value="Nhóm A"
                />
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Edit Modal
const ModalEdit = ({ isOpen, onClose, selectedUser }) => {
  if (!isOpen) return null;

  // Xác định role dựa vào ID
  const isEmployee = selectedUser?.id === "TL002";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#00000040] backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white !px-[30px] !py-[24px] rounded-lg w-[800px] shadow-xl relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-[#1CA756] text-xl font-bold !mb-[24px]">
          Chỉnh sửa tài khoản
        </h2>

        {/* Single radio button for role */}
        <div className="!mb-[30px]">
          <div className="flex items-center gap-x-1.5">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-[#008000] relative">
              <div className="absolute inset-[2px] rounded-full bg-[#008000]"></div>
            </div>
            <label className="text-[#4B5563] cursor-default">
              {isEmployee ? "Nhân viên" : "Admin"}
            </label>
          </div>
        </div>

        {/* Form fields in two columns */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <label className="block text-[#4B5563] mb-1.5">
              ID tài khoản<span className="text-red-600 ml-0.5">*</span>
            </label>
            <input
              type="text"
              className="w-full h-[38px] border border-gray-300 rounded !px-[12px] focus:outline-none focus:border-[#1CA756]"
              defaultValue={selectedUser?.id}
            />
          </div>
          <div>
            <label className="block text-[#4B5563] mb-1.5">
              Họ và Tên<span className="text-red-600 ml-0.5">*</span>
            </label>
            <input
              type="text"
              className="w-full h-[38px] border border-gray-300 rounded !px-[12px] focus:outline-none focus:border-[#1CA756]"
              defaultValue={isEmployee ? "Nguyễn Văn A" : "Nguyễn Anh Tuấn"}
            />
          </div>
          <div>
            <label className="block text-[#4B5563] mb-1.5">
              Số điện thoại<span className="text-red-600 ml-0.5">*</span>
            </label>
            <input
              type="text"
              className="w-full h-[38px] border border-gray-300 rounded !px-[12px] focus:outline-none focus:border-[#1CA756]"
              defaultValue={isEmployee ? "0987654321" : "0456654565"}
            />
          </div>
          <div>
            <label className="block text-[#4B5563] mb-1.5">
              Ngày tháng năm sinh<span className="text-red-600 ml-0.5">*</span>
            </label>
            <input
              type="date"
              className="w-full h-[38px] border border-gray-300 rounded !px-[12px] focus:outline-none focus:border-[#1CA756]"
              defaultValue={isEmployee ? "1995-03-15" : "1988-02-20"}
            />
          </div>
          <div>
            <label className="block text-[#4B5563] mb-1.5">
              Giới tính<span className="text-red-600 ml-0.5">*</span>
            </label>
            <select
              className="w-full h-[38px] border border-gray-300 rounded !px-[12px] focus:outline-none focus:border-[#1CA756] text-[#4B5563]"
              defaultValue="male"
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div>
            <label className="block text-[#4B5563] mb-1.5">
              Email<span className="text-red-600 ml-0.5">*</span>
            </label>
            <input
              type="email"
              className="w-full h-[38px] border border-gray-300 rounded !px-[12px] focus:outline-none focus:border-[#1CA756]"
              defaultValue={isEmployee ? "employee@gmail.com" : "@gmail.com"}
            />
          </div>

          {/* Additional fields for employee */}
          {isEmployee && (
            <>
              <div>
                <label className="block text-[#4B5563] mb-1.5">
                  Người quản lý<span className="text-red-600 ml-0.5">*</span>
                </label>
                <select className="w-full h-[38px] border border-gray-300 rounded !px-[12px] focus:outline-none focus:border-[#1CA756] text-[#4B5563]">
                  <option value="">Nhập tên người quản lý</option>
                  <option value="manager1" selected>
                    Nguyễn Văn B
                  </option>
                  <option value="manager2">Người quản lý 2</option>
                </select>
              </div>
              <div>
                <label className="block text-[#4B5563] mb-1.5">
                  Nhóm<span className="text-red-600 ml-0.5">*</span>
                </label>
                <select className="w-full h-[38px] border border-gray-300 rounded !px-[12px] focus:outline-none focus:border-[#1CA756] text-[#4B5563]">
                  <option value="">Nhóm</option>
                  <option value="group1" selected>
                    Nhóm A
                  </option>
                  <option value="group2">Nhóm 2</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-x-4 !mt-8">
          <button
            className="min-w-[100px] !py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
            onClick={onClose}
          >
            Hủy
          </button>
          <button className="min-w-[100px] !py-2 bg-[#1CA756] text-white rounded hover:bg-[#158f46]">
            Lưu
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Delete Modal
const ModalDelete = ({ isOpen, onClose }) => {
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
        <h2 className="text-[#1CA756] text-xl font-bold !mb-[18px]">
          Bạn có chắc chắn muốn xóa tài khoản này?
        </h2>
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

const User = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemPerPage = 5;

  const totalPages = Math.ceil(data.length / itemPerPage);
  const startIndex = (currentPage - 1) * itemPerPage;
  const displayedItems = data.slice(startIndex, startIndex + itemPerPage);

  return (
    <div className="p-4 md:!mt-[15px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-x-[27px]">
        <div className="flex-1 flex items-center !py-2 !px-3 gap-2 rounded-[8px] border-[1px] border-[#D3D3D3]">
          <MdOutlineSearch className="text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Tìm kiếm theo ID tài khoản"
            className="flex-1 outline-none bg-transparent placeholder:text-[#a6a6a6] text-[#343030]"
          />
        </div>
        <button className="w-full sm:w-[105px] flex justify-center bg-[#1ca756] !p-[10px] rounded-[6px] cursor-pointer hover:bg-[#158f46] transition duration-300">
          <MdOutlineSearch className="text-[#e3f4e9] text-xl" />
          <span className="text-[#e3f4e9] text-[14px] font-medium">
            Tìm kiếm
          </span>
        </button>
      </div>
      <div className="!my-[20px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-x-[27px]">
        <h1 className="font-bold text-[18px] sm:text-[20px] text-[#1CA756] uppercase text-center sm:text-left">
          Danh sách tài khoản
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-[105px] flex justify-center bg-[#1ca756] !p-[10px] rounded-[6px] cursor-pointer hover:bg-[#158f46] transition duration-300"
        >
          <IoIosAdd className="text-[#e3f4e9] text-xl" />
          <span className="text-[#e3f4e9] text-[14px] font-medium">
            Thêm mới
          </span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[800px] overflow-hidden rounded-[12px] border border-[#1CA756] !mb-[18px]">
          <DocumentTable
            displayedItems={displayedItems}
            startIndex={startIndex}
          />
        </div>
      </div>
      <div className="flex justify-center sm:justify-end items-center gap-x-[10px] mt-4">
        <button
          className={`px-3 py-1 cursor-pointer ${
            currentPage === 1
              ? "text-gray-400"
              : "text-[#1CA756] hover:text-green-800"
          }`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          «
        </button>
        <div className="flex gap-x-2 overflow-x-auto">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`!px-[8px] !py-[4px] cursor-pointer rounded-md ${
                currentPage === i + 1
                  ? "bg-[#1CA756] text-white"
                  : "text-green-600 hover:bg-green-200"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          className={`px-3 py-1 cursor-pointer ${
            currentPage === totalPages
              ? "text-gray-400"
              : "text-[#1CA756] hover:text-green-800"
          }`}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
      <ModalAdd isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default User;
