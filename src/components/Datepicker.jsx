import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoCalendarOutline } from "react-icons/io5";

const MyDatePicker = ({ value, onChange, disable, datePlc }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const CustomInput = React.forwardRef(({ value, onClick, disable, datePlc }, ref) => (
        <div
            className="w-full !px-[10px] flex items-center border rounded cursor-pointer"
            onClick={!disable ? onClick : undefined}
            ref={ref}
        >
            <input
                type="text"
                value={value}
                readOnly
                placeholder={datePlc ? datePlc : "Ngày tải tài liệu"}
                className="w-full outline-none bg-transparent rounded !py-[8px] cursor-pointer"
            />
            <IoCalendarOutline className="text-[#1CA756] ml-2 text-base" />
        </div>
    ));

    return (
        <DatePicker
            // selected={selectedDate}
            // onChange={(date) => setSelectedDate(date)}
            selected={value}
            onChange={onChange} // Truyền ngày ra ngoài
            dateFormat="dd/MM/yyyy"
            customInput={<CustomInput disable={disable} datePlc={datePlc} />}
            showYearDropdown  // Hiển thị dropdown chọn năm
            showMonthDropdown // Hiển thị dropdown chọn tháng
            dropdownMode="select" // Chế độ chọn dropdown
        />
    );
};

export default MyDatePicker;
