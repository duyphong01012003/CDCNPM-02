CREATE TABLE TaiKhoan (
    IDTaiKhoan INT IDENTITY(1,1) PRIMARY KEY,
	CodeTaiKhoan AS 'TK' + RIGHT('0000'+ CONVERT(VARCHAR(5),IDTaiKhoan),5) PERSISTED,
    QuyenTaiKhoan VARCHAR(10),
    MatKhau VARCHAR(50) NOT NULL
);

CREATE TABLE Admin (
    IDAdmin INT IDENTITY(1,1) PRIMARY KEY ,
	CodeAdmin AS 'Ad' + RIGHT('0000'+ CONVERT(VARCHAR(5),IDAdmin),5) PERSISTED,
    HoTenAdmin NVARCHAR(50),
    GioiTinh VARCHAR(10),
    NgaySinh DATE,
    SDT VARCHAR(10) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    IDTaiKhoan INT
);

CREATE TABLE TruongNhom (
    IDTruongNhom INT IDENTITY(1,1) PRIMARY KEY,
	CodeTruongNhom AS 'TN' + RIGHT('0000'+ CONVERT(VARCHAR(5),IDTruongNhom),5) PERSISTED,
    HoTenTruongNhom NVARCHAR(50),
    GioiTinh VARCHAR(10),
    NgaySinh DATE,
    SDT VARCHAR(10) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    IDAdmin INT,
    IDTaiKhoan INT
);

CREATE TABLE NhanVien (
    IDNhanVien INT IDENTITY(1,1) PRIMARY KEY,
	CodeNhanVien AS 'NV' + RIGHT('0000'+ CONVERT(VARCHAR(5),IDNhanVien),5) PERSISTED,
    HoTenNhanVien NVARCHAR(50),
    GioiTinh VARCHAR(10),
    NgaySinh DATE,
    SDT VARCHAR(10) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    IDAdmin INT,
    IDNhomLamViec INT,
    IDNguoiQuanLy INT,
	IDTaiKhoan INT
);

CREATE TABLE DuAn (
    IDDuAn INT IDENTITY(1,1) PRIMARY KEY,
	CodeDuAn AS 'DA' + RIGHT('0000'+ CONVERT(VARCHAR(5),IDDuAn),5) PERSISTED,
    TenDuAn VARCHAR(255),
    NgayBatDau DATE,
    NgayKetThuc DATE,
    MoTaDuAn VARCHAR(255),
    IDNguoiQuanLy INT,
    IDNhomLamViec INT
);

CREATE TABLE NhomLamViec (
    IDNhomLamViec INT IDENTITY(1,1) PRIMARY KEY,
	CodeNhom AS 'Nhom' + RIGHT('0000'+ CONVERT(VARCHAR(5),IDNhomLamViec),5) PERSISTED,
    SoThanhVien INT,
    IDNguoiQuanLy INT,
    TenNhom VARCHAR(255)
);

CREATE TABLE Task (
    IDTask INT IDENTITY(1,1) PRIMARY KEY,
	CodeTank AS 'Tk' + RIGHT('0000'+ CONVERT(VARCHAR(5),IDTask),5) PERSISTED,
    TenTask VARCHAR(255),
    NgayGiaoTask DATE,
    NgayKetThucTask DATE,
    TrangThai VARCHAR(15),
    IDNguoiTaoTask INT,
    IDNhanVienNhanTask INT,
    Deadline DATE,
    IDDuAn INT
);

CREATE TABLE TaskCon (
    IDTaskCon INT IDENTITY(1,1) PRIMARY KEY,
	CodeTankCon AS 'TkC' + RIGHT('0000'+ CONVERT(VARCHAR(5),IDTaskCon),5) PERSISTED,
    IDTaskCha INT,
    TenTaskCon VARCHAR(255),
    TrangThai VARCHAR(10) NOT NULL,
    NgayTao DATE,
    Deadline INT,
    IDNguoiTaoTask INT
);

CREATE TABLE TaiLieu (
    IDTaiLieu INT IDENTITY(1,1) PRIMARY KEY,
	CodeTaiLieu AS 'TL' + RIGHT('0000'+ CONVERT(VARCHAR(5),IDTaiLieu),5) PERSISTED,
    TenTaiLieu VARCHAR(255),
    IDDuAn INT,
    NgayTaiLen DATE
);

ALTER TABLE Admin ADD FOREIGN KEY (IDTaiKhoan) REFERENCES TaiKhoan(IDTaiKhoan);
ALTER TABLE TruongNhom ADD FOREIGN KEY (IDAdmin) REFERENCES Admin(IDAdmin);
ALTER TABLE TruongNhom ADD FOREIGN KEY (IDTaiKhoan) REFERENCES TaiKhoan(IDTaiKhoan);
ALTER TABLE NhanVien ADD FOREIGN KEY (IDAdmin) REFERENCES Admin(IDAdmin);
ALTER TABLE NhanVien ADD FOREIGN KEY (IDNhomLamViec) REFERENCES NhomLamViec(IDNhomLamViec);
ALTER TABLE NhanVien ADD FOREIGN KEY (IDNguoiQuanLy) REFERENCES TruongNhom(IDTruongNhom);
ALTER TABLE NhanVien ADD FOREIGN KEY (IDTaiKhoan) REFERENCES TaiKhoan(IDTaiKhoan);
ALTER TABLE DuAn ADD FOREIGN KEY (IDNguoiQuanLy) REFERENCES TruongNhom(IDTruongNhom);
ALTER TABLE DuAn ADD FOREIGN KEY (IDNhomLamViec) REFERENCES NhomLamViec(IDNhomLamViec);
ALTER TABLE NhomLamViec ADD FOREIGN KEY (IDNguoiQuanLy) REFERENCES TruongNhom(IDTruongNhom);
ALTER TABLE Task ADD FOREIGN KEY (IDNguoiTaoTask) REFERENCES TruongNhom(IDTruongNhom);
ALTER TABLE Task ADD FOREIGN KEY (IDNhanVienNhanTask) REFERENCES NhanVien(IDNhanVien);
ALTER TABLE Task ADD FOREIGN KEY (IDDuAn) REFERENCES DuAn(IDDuAn);
ALTER TABLE TaskCon ADD FOREIGN KEY (IDTaskCha) REFERENCES Task(IDTask);
ALTER TABLE TaskCon ADD FOREIGN KEY (IDNguoiTaoTask) REFERENCES NhanVien(IDNhanVien);
ALTER TABLE TaiLieu ADD FOREIGN KEY (IDDuAn) REFERENCES DuAn(IDDuAn);