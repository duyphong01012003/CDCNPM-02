import React, { useEffect, useState } from 'react'
import axios from 'axios';
import API_BASE_URL from "../../api";


// Danh sách nhân viên
const StaffTable = ({ staffs }) => {
    const TableRow = ({ staff }) => (
        <tr className=''>
            <td className='w-[30%] !py-[8px]'>
                <div className='text-center'>
                    <p className='text-base text-[#464646] dark:text-white'>{staff.id}</p>
                </div>
            </td>
            <td className='!py-[8px]'>
                <div className=''>
                    <span className='text-base text-[#464646] dark:text-white'>{staff.HoTenNhanVien}</span>
                </div>
            </td>
            <td className='!py-[8px]'>
                <div className=''>
                    <span className='text-base text-[#464646] dark:text-white'>{staff.TenNhom}</span>
                </div>
            </td>
        </tr>
    );
    return (
        <>
            <div className='w-full bg-white !px-4 !py-4 shadow-md rounded-[10px] dark:bg-gray-900'>
                <div className='w-full flex items-center justify-between dark:text-white'>
                    <h1 className='text-[18px] font-bold'>Danh sách nhân viên</h1>
                    <h1 className='text-[18px] font-bold'>
                        Tổng:
                        <span className='!pl-[10px] text-3xl text-[#689F38] font-normal'>{staffs.length}</span>
                    </h1>
                </div>

                <div className='w-full overflow-hidden '>
                    <table className='w-full table-fixed border-collapse'>
                        <thead className='bg-white sticky top-0 z-10 shadow'>
                            <tr className='text-[#464646] text-left border-b border-gray-300 dark:bg-gray-900 dark:text-white'>
                                <th className='!py-2 w-[30%] text-center'>Mã nhân viên</th>
                                <th className='!py-2'>Họ và tên</th>
                                <th className='!py-2'>Tên nhóm</th>
                            </tr>
                        </thead>
                    </table>

                    <div
                        className='h-64 overflow-y-auto'
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#bfbfbf #f1f1f1',
                        }}
                    >
                        <table className='w-full table-fixed border-collapse'>
                            <tbody>
                                {staffs?.map((staff, id) => (
                                    <TableRow key={id} staff={staff} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

// Danh sách quản lí
const ManagementTable = ({ managements }) => {
    const TableRow = ({ management }) => (
        <tr className=''>
            <td className='w-[50%] !py-[8px]'>
                <div className='text-center'>
                    <p className='text-base text-[#464646] dark:text-[#f0f4f2]'>{management?.CodeTaiKhoan}</p>
                </div>
            </td>
            <td className='!py-[8px]'>
                <div className=''>
                    <span className='text-base text-[#464646] dark:text-[#f0f4f2]'>{management?.ThongTin?.HoTen}</span>
                </div>
            </td>
        </tr>
    );
    return (
        <>
            <div className='w-full bg-white !px-4 !py-4 shadow-md rounded-[10px] !mt-[20px] dark:bg-gray-900'>
                <div className='w-full flex items-center justify-between dark:text-white'>
                    <h1 className='text-[18px] font-bold'>Danh sách quản lí</h1>
                    <h1 className='text-[18px] font-bold'>
                        Tổng:
                        <span className='!pl-[10px] text-3xl text-[#689F38] font-normal'>{managements.length}</span>
                    </h1>
                </div>

                <div className='w-full overflow-hidden'>
                    <table className='w-full table-fixed border-collapse '>
                        <thead className='bg-white sticky top-0 z-10 shadow dark:bg-gray-900'>
                            <tr className='text-[#464646] text-left border-b border-gray-300 dark:text-white'>
                                <th className='!py-2 w-[50%] text-center'>Mã quản lí</th>
                                <th className='!py-2'>Họ và tên</th>
                            </tr>
                        </thead>
                    </table>

                    <div
                        className='h-64 overflow-y-auto'
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#bfbfbf #f1f1f1',
                        }}
                    >
                        <table className='w-full table-fixed border-collapse'>
                            <tbody>
                                {managements?.map((management, id) => (
                                    <TableRow key={id} management={management} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

const DocumentTable = ({ documents }) => {
    const DocumentRow = ({ document }) => (
        <div className='flex items-center gap-x-[15px] !pt-[40px]'>
            <div className='w-[135px] h-[65px]'>
                <img src="https://plus.unsplash.com/premium_photo-1661456359760-516963f27e32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9jdW1lbnR8ZW58MHx8MHx8fDA%3D" alt="" className='rounded-[8px]' />
            </div>
            <span className='dark:text-[#f0f4f2]'>{document.TenTaiLieu}</span>
        </div>
    )
    return (
        <div className='w-full bg-white p-5 shadow-md rounded-2xl h-[100%] dark:bg-gray-900'>
            <div className='!pt-[16px] !px-[30px] h-[700px]'>
                <div className='border-b border-gray-300'>
                    <h1 className='text-[#689F38] dark:text-[#f0f4f2]'>Tài liệu mới nhất</h1>
                </div>
                <div className='h-full overflow-y-auto'
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#bfbfbf #f1f1f1',
                    }}>
                    {documents?.map((document, id) => (
                        <DocumentRow key={id} document={document} />
                    ))}
                </div>
            </div>
        </div>
    )
}

const Home = () => {
    const [countTask, setCountTask] = useState("");
    const [countGroup, setCountGroup] = useState("");
    const [employee, setEmployee] = useState([]);
    const [document, setDocument] = useState([]);
    const [manager, setManager] = useState([]);

    console.log(employee)

    // Count du anan
    useEffect(() => {
        axios.get(`${API_BASE_URL}/Dashboard/duAnCount`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json",
            }
        })
            .then(response => setCountTask(response.data))
            .catch(error => console.error("Loi khi goi API:", error));
    }, [countTask]);

    // Count nhom
    useEffect(() => {
        axios.get(`${API_BASE_URL}/Dashboard/nhomCount`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json",
            }
        })
            .then(response => setCountGroup(response.data))
            .catch(error => console.error("Loi khi goi API:", error));
    }, [countGroup]);

    // get nhanvien
    useEffect(() => {
        axios.get(`${API_BASE_URL}/NhanViens`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json",
            }
        })
            .then(response => setEmployee(response.data))
            .catch(error => console.error("Loi khi goi API:", error));
    }, []);

    // get tailieu
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

    // get truong nhom
    useEffect(() => {
        axios.get(`${API_BASE_URL}/TaiKhoans`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json",
            }
        })
            .then(response => setManager(response.data))
            .catch(error => console.error("Loi khi goi API:", error));
    }, []);

    const managerRole = manager.filter(mana => mana.QuyenTaiKhoan === "TruongNhom")


    const stats = [
        {
            _id: "1",
            label: "Tổng số công việc",
            total: countTask,
        },
        {
            _id: "2",
            label: "Tổng số nhóm",
            total: countGroup,
        },
        {
            _id: "3",
            label: "Tổng số nhân viên",
            total: employee.length,
        },
        {
            _id: "4",
            label: "Tổng số quản lí",
            total: manager.length,
        },
    ]

    const managements = [
        {
            _id: "1",
            managementCode: "QL01",
            fullName: "Phùng Việt Anh",
        },
        {
            _id: "2",
            managementCode: "QL02",
            fullName: "Phùng Việt Anh",
        },
        {
            _id: "3",
            managementCode: "QL03",
            fullName: "Phùng Việt Anh",
        },
        {
            _id: "4",
            managementCode: "QL04",
            fullName: "Phùng Việt Anh",
        },
        {
            _id: "5",
            managementCode: "QL05",
            fullName: "Phùng Việt Anh",
        },
        {
            _id: "5",
            managementCode: "QL05",
            fullName: "Phùng Việt Anh",
        },
        {
            _id: "5",
            managementCode: "QL05",
            fullName: "Phùng Việt Anh",
        },
        {
            _id: "5",
            managementCode: "QL05",
            fullName: "Phùng Việt Anh",
        },
        {
            _id: "5",
            managementCode: "QL05",
            fullName: "Phùng Việt Anh",
        },
    ]

    const documents = [
        {
            _id: "1",
            img: "",
            title: 'Tên tài liệu',
        },
        {
            _id: "2",
            img: "https://plus.unsplash.com/premium_photo-1661456359760-516963f27e32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9jdW1lbnR8ZW58MHx8MHx8fDA%3D",
            title: 'Tên tài liệu',
        },
        {
            _id: "3",
            img: "https://plus.unsplash.com/premium_photo-1661456359760-516963f27e32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9jdW1lbnR8ZW58MHx8MHx8fDA%3D",
            title: 'Tên tài liệu',
        },
        {
            _id: "4",
            img: "https://plus.unsplash.com/premium_photo-1661456359760-516963f27e32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9jdW1lbnR8ZW58MHx8MHx8fDA%3D",
            title: 'Tên tài liệu',
        },
        {
            _id: "5",
            img: "https://plus.unsplash.com/premium_photo-1661456359760-516963f27e32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9jdW1lbnR8ZW58MHx8MHx8fDA%3D",
            title: 'Tên tài liệu',
        },
        {
            _id: "5",
            img: "https://plus.unsplash.com/premium_photo-1661456359760-516963f27e32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9jdW1lbnR8ZW58MHx8MHx8fDA%3D",
            title: 'Tên tài liệu',
        }, {
            _id: "5",
            img: "https://plus.unsplash.com/premium_photo-1661456359760-516963f27e32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9jdW1lbnR8ZW58MHx8MHx8fDA%3D",
            title: 'Tên tài liệu',
        },
        {
            _id: "5",
            img: "https://plus.unsplash.com/premium_photo-1661456359760-516963f27e32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9jdW1lbnR8ZW58MHx8MHx8fDA%3D",
            title: 'Tên tài liệu',
        }, {
            _id: "5",
            img: "https://plus.unsplash.com/premium_photo-1661456359760-516963f27e32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9jdW1lbnR8ZW58MHx8MHx8fDA%3D",
            title: 'Tên tài liệu',
        },
    ]

    const Card = ({ label, total }) => {
        return (
            <div className='w-full h-32 bg-white p-5 shadow-md rounded-2xl dark:bg-gray-900'>
                <div className='h-full !px-[20px] !py-[20px]'>
                    <p className='text-[20px] font-medium text-[#007141] !pb-[20px] dark:text-white'>{label}</p>
                    <span className='text-[24px] font-medium text-[#3F3F3F] dark:text-white'>{total}</span>
                </div>
            </div>
        )
    }

    return (
        <div className='h-full !py-6 !px-6'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
                {
                    stats.map(({ label, total }, index) => (
                        <Card key={index} label={label} total={total} />
                    ))
                }
            </div>
            <div className='grid grid-cols-2 gap-4 !pt-[20px]'>
                <div>
                    <StaffTable staffs={employee} />
                    <ManagementTable managements={managerRole} />
                </div>
                <div>
                    <DocumentTable documents={document} />
                </div>
            </div>
        </div>
    )
}

export default Home