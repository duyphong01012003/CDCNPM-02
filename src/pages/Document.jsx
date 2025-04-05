import React, { useEffect, useMemo, useState } from 'react'
import { MdOutlineSearch } from "react-icons/md";
import { IoIosAdd, IoMdTrash } from "react-icons/io";
import { IoCloseSharp, IoEyeOutline, IoSad } from "react-icons/io5";
import { HiOutlinePencil } from "react-icons/hi2";
import { motion } from "framer-motion";
import DateTime from "../components/Datepicker";
import axios from "axios";
import API_BASE_URL from "../../api";
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

const DocumentTable = ({ displayedItems, startIndex, setDocuments, project }) => {
    const [isModalSeenOpen, setIsModalSeenOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState([]);
    const [disable, setDisable] = useState(false);

    const handleViewDetails = (group) => {
        setSelectedGroup(group);
        setIsModalSeenOpen(true);
        setDisable(true);
    }

    const handleDelete = (group) => {
        setSelectedGroup(group);
        setIsModalDeleteOpen(true)
    }

    const handleEdit = (group) => {
        setSelectedGroup(group);
        setIsModalEditOpen(true)
    }

    const TableRow = ({ item, num }) => (

        <tr className="text-center border-t border-[#1CA756] hover:bg-gray-100 dark:hover:bg-[#9ac898]">
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{startIndex + num + 1}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.CodeTaiLieu}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.TenTaiLieu}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.TenDuAn}</td>
            <td className="!py-[10px] border-r border-[#1CA756] text-[#4B5563] dark:text-[#f0f4f2]">{item.NgayTaiLen}</td>
            <td className="!py-[10px] flex justify-center items-center gap-x-[20px]">
                <button onClick={() => handleViewDetails(item)} className="text-green-500 hover:text-green-700 text-[20px] cursor-pointer">
                    <IoEyeOutline />
                </button>
                <button onClick={() => handleEdit(item)} className="text-green-500 hover:text-green-700 text-[20px] cursor-pointer">
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
                        <th className="!p-3 border-r">ID tài liệu</th>
                        <th className="!p-3 border-r">Tên tài liệu</th>
                        <th className="!p-3 border-r">Dự án</th>
                        <th className="!p-3 border-r">Ngày tải tài liệu</th>
                        <th className="!p-3">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedItems?.map((item, index) => (
                        <TableRow item={item} key={index} num={index} />
                    ))}
                </tbody>
            </table>
            <ModalSeen isOpen={isModalSeenOpen} disable={disable} selectedGroup={selectedGroup} onClose={() => setIsModalSeenOpen(false)} />
            <ModalEdit isOpen={isModalEditOpen} setDocuments={setDocuments} project={project} selectedGroup={selectedGroup} onClose={() => setIsModalEditOpen(false)} />
            <ModalDeltele isOpen={isModalDeleteOpen} setDocuments={setDocuments} selectedGroup={selectedGroup} onClose={() => setIsModalDeleteOpen(false)} />
        </>
    )
}

// Seen Model
const ModalSeen = ({ isOpen, onClose, selectedGroup, disable }) => {
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
                    <h2 className="text-[#1CA756] text-xl font-bold !mb-[18px]">Xem chi tiết thông tin tài liệu</h2>
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
                        <label className="block font-medium text-[#4B5563]">ID tài liệu <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border rounded !py-[8px] !px-[10px]"
                            placeholder={selectedGroup.CodeTaiLieu}
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-[#4B5563]">Tên tài liệu <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.TenTaiLieu}
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-[#4B5563]">Dự án <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border !py-[8px] !px-[10px] rounded"
                            placeholder={selectedGroup.TenDuAn}
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-[#4B5563]">Ngày tải tài liệu <span className='text-red-600'>*</span></label>
                        <div>
                            <DateTime datePlc={selectedGroup.NgayTaiLen} disable={disable} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Edit Model
const ModalEdit = ({ isOpen, onClose, selectedGroup, project, setDocuments }) => {
    const [formData, setFormData] = useState({
        documentName: "",
        project: "",
        uploadDate: "",
    })

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    // Xử date 
    const selectedDate = formData.uploadDate ? new Date(formData.uploadDate) : null;
    const formattedDate = selectedDate instanceof Date && !isNaN(selectedDate)
        ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
        : '';


    const requestData = {
        IdtaiLieu: selectedGroup.IdtaiLieu,
        TenTaiLieu: formData.documentName,
        IdduAn: formData.project,
        NgayTaiLen: formattedDate,
    };

    // Sửa tài liệu
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.put(`${API_BASE_URL}/TaiLieux/${selectedGroup.IdtaiLieu}`, requestData, {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            toast.success("Tài liệu đã được sửa thành công!");

            setDocuments((prevDocuments) =>
                prevDocuments.map((doc) =>
                    doc.IdtaiLieu === selectedGroup.IdtaiLieu ? response.data : doc
                )
            );

            setFormData({ documentName: "", project: "", uploadDate: "" });

            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi sửa tài liệu!");
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
                <h2 className="text-[#1CA756] text-xl font-bold !mb-[18px]">Chỉnh sửa tài liệu</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium text-[#4B5563]">ID tài liệu <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                className="w-full border rounded !py-[8px] !px-[10px]"
                                placeholder={selectedGroup.CodeTaiLieu}
                                name='id'
                                readOnly

                            />
                        </div>

                        <div>
                            <label className="block font-medium text-[#4B5563]">Tên tài liệu <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                name="documentName"
                                value={formData.documentName}
                                onChange={handleChange}
                                className="w-full border !py-[8px] !px-[10px] rounded"
                                placeholder={selectedGroup.TenTaiLieu}
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-[#4B5563]">Dự án <span className='text-red-600'>*</span></label>
                            <select
                                name="project"
                                value={formData.project}
                                onChange={handleChange}
                                className="w-full border rounded !py-[10px] !px-[10px]"
                            >
                                <option>Tên dự án</option>
                                {
                                    project.map((item, index) => (
                                        <option key={index} value={item.IdduAn}>
                                            {item.TenDuAn}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium text-[#4B5563]">Ngày tải tài liệu <span className='text-red-600'>*</span></label>
                            <div>
                                <DateTime
                                    value={formData.uploadDate}
                                    onChange={(date) => setFormData({ ...formData, uploadDate: date })}
                                />
                            </div>
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
const ModalDeltele = ({ isOpen, onClose, selectedGroup, setDocuments }) => {
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        if (deleteId !== null) {
            axios.delete(`${API_BASE_URL}/TaiLieux/${deleteId}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                }
            })
                .then(() => {
                    console.log(`Xóa tài liệu ${deleteId} thành công!`);
                    setDocuments(prevDoc => prevDoc.filter(doc => doc.IdtaiLieu !== deleteId))
                    onClose();
                })
                .catch(error => console.error("Lỗi khi xóa tài liệu:", error))
                .finally(() => setDeleteId(null));
        }
    }, [deleteId]);

    const handleDelete = (id) => {
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
                <h2 className="text-[#1CA756] text-xl font-bold !mb-[18px]">Bạn có chắc chắn muốn xóa tài liệu ?</h2>
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
                        onClick={() => handleDelete(selectedGroup.IdtaiLieu)}
                    >
                        Đồng ý
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

// Add Model
const ModalAdd = ({ isOpen, onClose, setDocuments, project }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        // documentId: "",
        documentName: "",
        project: "",
        uploadDate: "",
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const mana = new Set();
    const uniqueManage = project.filter(item => {
        if (mana.has(item.IdduAn)) {
            return false;
        }
        mana.add(item.IdduAn);
        return true;
    });

    // Xử date 
    const selectedDate = formData.uploadDate ? new Date(formData.uploadDate) : null;
    const formattedDate = selectedDate instanceof Date && !isNaN(selectedDate)
        ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
        : '';


    const requestData = {
        TenTaiLieu: formData.documentName,
        IdduAn: formData.project,
        NgayTaiLen: formattedDate,
    };

    // Thêm tài liệu mới 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/TaiLieux`, requestData, {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            toast.success("Tài liệu đã được thêm thành công!");

            setDocuments((prevDocuments) => {
                const updatedDocuments = [...prevDocuments, response.data];
                console.log("Danh sách tài liệu sau khi thêm:", updatedDocuments);
                return updatedDocuments;
            });

            setFormData({ documentName: "", project: "", uploadDate: "" });

            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi thêm tài liệu!");
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
                <h2 className="text-[#1CA756] text-xl font-bold !mb-[18px]">Thêm mới tài liệu</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        {/* <div>
                            <label className="block font-medium text-[#4B5563]">ID tài liệu <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                name='documentId'
                                value={formData.documentId}
                                onChange={handleChange}
                                className="w-full border rounded !py-[8px] !px-[10px]"
                                placeholder="Nhập ID tài liệu"
                                required
                            />
                        </div> */}

                        <div>
                            <label className="block font-medium text-[#4B5563]">Tên tài liệu <span className='text-red-600'>*</span></label>
                            <input
                                type="text"
                                name="documentName"
                                value={formData.documentName}
                                onChange={handleChange}
                                className="w-full border !py-[8px] !px-[10px] rounded"
                                placeholder="Nhập tên tài liệu"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-[#4B5563]">Dự án <span className='text-red-600'>*</span></label>
                            <select
                                name="project"
                                value={formData.project}
                                onChange={handleChange}
                                className="w-full border rounded !py-[10px] !px-[10px]"
                            >
                                <option>Tên dự án</option>
                                {uniqueManage.map((item, index) => (
                                    <option key={index} value={item.IdduAn}>
                                        {item.TenDuAn}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium text-[#4B5563]">Ngày tải tài liệu <span className='text-red-600'>*</span></label>
                            <div>
                                <DateTime
                                    value={formData.uploadDate}
                                    onChange={(date) => setFormData({ ...formData, uploadDate: date })}
                                />
                            </div>
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

// const data = [
//     {
//         id: "TL001",
//         name: "Tài liệu dự án A",
//         project: "Dự án A",
//         date: "12/01/2025"
//     },
//     {
//         id: "TL002",
//         name: "Tài liệu dự án B",
//         project: "Dự án B",
//         date: "12/01/2025"
//     },
//     {
//         id: "TL003",
//         name: "Tài liệu dự án C",
//         project: "Dự án C",
//         date: "12/01/2025"
//     },
//     {
//         id: "TL004",
//         name: "Tài liệu dự án D",
//         project: "Dự án D",
//         date: "12/01/2025"
//     },
//     {
//         id: "TL005",
//         name: "Tài liệu dự án E",
//         project: "Dự án E",
//         date: "12/01/2025"
//     },
//     {
//         id: "<ID tài liệu>",
//         name: "<Tên tài liệu>",
//         project: "<Tên dự án>",
//         date: "<Ngày tải lên>"
//     },
//     {
//         id: "<ID tài liệu>",
//         name: "<Tên tài liệu>",
//         project: "<Tên dự án>",
//         date: "<Ngày tải lên>"
//     },
//     {
//         id: "<ID tài liệu>",
//         name: "<Tên tài liệu>",
//         project: "<Tên dự án>",
//         date: "<Ngày tải lên>"
//     },
//     {
//         id: "<ID tài liệu>",
//         name: "<Tên tài liệu>",
//         project: "<Tên dự án>",
//         date: "<Ngày tải lên>"
//     },
//     {
//         id: "<ID tài liệu>",
//         name: "<Tên tài liệu>",
//         project: "<Tên dự án>",
//         date: "<Ngày tải lên>"
//     },
// ];

const Document = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [document, setDocument] = useState([]);
    const [project, setProject] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const [searchInput, setSearchInput] = useState("");
    const itemPerPage = 10;


    const totalPages = Math.ceil(document.length / itemPerPage);
    const startIndex = (currentPage - 1) * itemPerPage;
    const displayedItems = document.slice(startIndex, startIndex + itemPerPage);

    // Render UI danh sach tai lieu
    useEffect(() => {
        axios.get(`${API_BASE_URL}/TaiLieux`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json",
            }
        })
            .then(response => setDocument(response.data))
            .catch(error => console.error("Loi khi goi API:", error));
    }, []);

    // Gọi API dự án để lấy Id dự án
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

    // console.log(document);
    // console.log(project);

    //Search
    // const filterDocuments = useMemo(() => {
    //     return document.filter(doc =>
    //         doc.CodeTaiLieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         doc.TenTaiLieu.toLowerCase().includes(searchTerm.toLowerCase())
    //     )
    // }, [document, searchTerm])

    // const displayedItems = useMemo(() => {
    //     return filterDocuments.slice(startIndex, startIndex + itemPerPage);
    // }, [filterDocuments, startIndex])

    const handleSearch = async () => {
        if (!searchInput.trim()) return;
        try {
            const response = await axios.get(`${API_BASE_URL}/TaiLieux/by-name/${searchInput}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
            });
            setDocument(response.data);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };

    return (
        <div className='h-full bg-white !m-[20px] shadow-2xl rounded-2xl dark:bg-gray-900'>
            <div className='h-[800px] !p-[16px]'>
                <div className='h-[36px] flex items-center justify-between gap-x-[27px]'>
                    <div className='w-64 flex flex-1 items-center !py-2 !px-3 gap-2 rounded-[8px] border-[1px] border-[#D3D3D3]'>
                        <MdOutlineSearch className='text-gray-500 text-xl' />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder='Tìm kiếm theo tên tài liệu'
                            className='flex-1 outline-none bg-transparent placeholder:text-[#a6a6a6] text-[#343030]'
                        />
                    </div>
                    <button className='w-[105px] flex bg-[#1ca756] !p-[10px] rounded-[6px] cursor-pointer hover:bg-[#158f46] transition duration-300'>
                        <MdOutlineSearch className='text-[#e3f4e9] text-xl' />
                        <span onClick={handleSearch} className='text-[#e3f4e9] text-[14px] font-medium'>Tìm kiếm</span>
                    </button>
                </div>
                <div className='!my-[20px] flex items-center justify-between gap-x-[27px]'>
                    <h1 className='font-semibold text-[20px] text-[#1CA756] uppercase'>Danh sách tài liệu</h1>
                    <button onClick={() => setIsModalOpen(true)} className='w-[105px] flex bg-[#1ca756] !p-[10px] rounded-[6px] cursor-pointer hover:bg-[#158f46] transition duration-300'>
                        <IoIosAdd className='text-[#e3f4e9] text-xl' />
                        <span className='text-[#e3f4e9] text-[14px] font-medium'>Thêm mới</span>
                    </button>
                </div>
                <div>
                    <div className='overflow-hidden rounded-[12px] border border-[#1CA756] !mb-[18px]'>
                        <DocumentTable displayedItems={displayedItems} project={project} setDocuments={setDocument} startIndex={startIndex} />
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
                <ModalAdd isOpen={isModalOpen} project={project} setDocuments={setDocument} onClose={() => setIsModalOpen(false)} />
            </div>
        </div>
    )
}

export default Document