import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoCalendarOutline } from "react-icons/io5";

const MyDatePicker = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
        <div
            className="w-full !px-[10px] flex items-center border rounded cursor-pointer"
            onClick={onClick}
            ref={ref}
        >
            <input
                type="text"
                value={value}
                readOnly
                placeholder="Ngày tải tài liệu"
                className="w-full outline-none bg-transparent rounded !py-[8px]"
            />
            <IoCalendarOutline className="text-[#1CA756] ml-2 text-base" />
        </div>
    ));

    return (
        <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            customInput={<CustomInput />}
        />
    );
};

export default MyDatePicker;
