import React from "react";

const ArchiveHeader = () => {
  return (
    // table header
    <div className="grid grid-cols-12 bg-gray-50/70 px-8 py-4 text-xs md:text-sm font-bold text-gray-500 border-b border-gray-100 text-center whitespace-nowrap">
      <div className="col-span-4 text-right pr-12">نام فایل</div>
      <div className="col-span-2">تاریخ بارگذاری</div>
      <div className="col-span-1">نوع فایل</div>
      <div className="col-span-2">مدت زمان</div>
      <div className="col-span-3">عملیات</div>
    </div>
  );
};

export default ArchiveHeader;