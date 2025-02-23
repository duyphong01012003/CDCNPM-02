
CREATE TABLE TaiKhoan (
    IDTaiKhoan CHAR(100) PRIMARY KEY,
    QuyenTaiKhoan CHAR(10),
    MatKhau CHAR(8) NOT NULL
);

CREATE TABLE Admin (
    IDAdmin CHAR(100) PRIMARY KEY,
    HoTenAdmin CHAR(50),
    GioiTinh CHAR(10),
    NgaySinh DATE,
    SDT INT NOT NULL,
    Email CHAR(255) NOT NULL,
    IDTaiKhoan CHAR(100)
);

CREATE TABLE TruongNhom (
    IDTruongNhom CHAR(100) PRIMARY KEY,
    HoTenTruongNhom CHAR(40),
    NgaySinh DATE,
    GioiTinh CHAR(10),
    SDT INT NOT NULL,
    Email CHAR(255) NOT NULL,
    IDAdmin CHAR(100),
    IDTaiKhoan CHAR(100)
);

CREATE TABLE NhanVien (
    IDNhanVien CHAR(100) PRIMARY KEY,
    HoTenNhanVien CHAR(50),
    NgaySinh DATE,
    GioiTinh CHAR(10),
    SDT INT NOT NULL,
    Email CHAR(255) NOT NULL,
    IDAdmin CHAR(100),
    IDNhomLamViec INT,
    IDNguoiQuanLy CHAR(100)
);

CREATE TABLE DuAn (
    IDDuAn CHAR(50) PRIMARY KEY,
    TenDuAn CHAR(255),
    NgayBatDau DATE,
    NgayKetThuc DATE,
    MoTaDuAn CHAR(255),
    IDNguoiQuanLy CHAR(100),
    IDNhomLamViec INT
);

CREATE TABLE NhomLamViec (
    IDNhomLamViec INT PRIMARY KEY,
    SoThanhVien INT,
    IDNguoiQuanLy CHAR(100),
    TenNhom CHAR(255)
);

CREATE TABLE Task (
    IDTask CHAR(100) PRIMARY KEY,
    TenTask CHAR(255),
    NgayGiaoTask DATE,
    NgayKetThucTask DATE,
    TrangThai CHAR(15),
    IDNguoiTaoTask CHAR(100),
    IDNhanVienNhanTask CHAR(100),
    Deadline DATE,
    IDDuAn CHAR(50)
);

CREATE TABLE TaskCon (
    IDTaskCon INT PRIMARY KEY,
    IDTaskCha CHAR(100),
    TenTaskCon CHAR(255),
    TrangThai CHAR(10) NOT NULL,
    NgayTao DATE,
    Deadline INT,
    IDNguoiTaoTask CHAR(100)
);

CREATE TABLE TaiLieu (
    IDTaiLieu CHAR(100) PRIMARY KEY,
    TenTaiLieu CHAR(255),
    IDDuAn CHAR(50),
    NgayTaiLen DATE
);

ALTER TABLE Admin ADD FOREIGN KEY (IDTaiKhoan) REFERENCES TaiKhoan(IDTaiKhoan);
ALTER TABLE TruongNhom ADD FOREIGN KEY (IDAdmin) REFERENCES Admin(IDAdmin);
ALTER TABLE TruongNhom ADD FOREIGN KEY (IDTaiKhoan) REFERENCES TaiKhoan(IDTaiKhoan);
ALTER TABLE NhanVien ADD FOREIGN KEY (IDAdmin) REFERENCES Admin(IDAdmin);
ALTER TABLE NhanVien ADD FOREIGN KEY (IDNhomLamViec) REFERENCES NhomLamViec(IDNhomLamViec);
ALTER TABLE NhanVien ADD FOREIGN KEY (IDNguoiQuanLy) REFERENCES TruongNhom(IDTruongNhom);
ALTER TABLE DuAn ADD FOREIGN KEY (IDNguoiQuanLy) REFERENCES TruongNhom(IDTruongNhom);
ALTER TABLE DuAn ADD FOREIGN KEY (IDNhomLamViec) REFERENCES NhomLamViec(IDNhomLamViec);
ALTER TABLE NhomLamViec ADD FOREIGN KEY (IDNguoiQuanLy) REFERENCES TruongNhom(IDTruongNhom);
ALTER TABLE Task ADD FOREIGN KEY (IDNguoiTaoTask) REFERENCES TruongNhom(IDTruongNhom);
ALTER TABLE Task ADD FOREIGN KEY (IDNhanVienNhanTask) REFERENCES NhanVien(IDNhanVien);
ALTER TABLE Task ADD FOREIGN KEY (IDDuAn) REFERENCES DuAn(IDDuAn);
ALTER TABLE TaskCon ADD FOREIGN KEY (IDTaskCha) REFERENCES Task(IDTask);
ALTER TABLE TaskCon ADD FOREIGN KEY (IDNguoiTaoTask) REFERENCES NhanVien(IDNhanVien);
ALTER TABLE TaiLieu ADD FOREIGN KEY (IDDuAn) REFERENCES DuAn(IDDuAn);
