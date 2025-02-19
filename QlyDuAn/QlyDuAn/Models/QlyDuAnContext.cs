using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace QlyDuAn.Models;

public partial class QlyDuAnContext : DbContext
{
    public QlyDuAnContext()
    {
    }

    public QlyDuAnContext(DbContextOptions<QlyDuAnContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Admin> Admins { get; set; }

    public virtual DbSet<DuAn> DuAns { get; set; }

    public virtual DbSet<NhanVien> NhanViens { get; set; }

    public virtual DbSet<NhomLamViec> NhomLamViecs { get; set; }

    public virtual DbSet<TaiKhoan> TaiKhoans { get; set; }

    public virtual DbSet<TaiLieu> TaiLieus { get; set; }

    public virtual DbSet<Task> Tasks { get; set; }

    public virtual DbSet<TaskCon> TaskCons { get; set; }

    public virtual DbSet<TruongNhom> TruongNhoms { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS;Database=QlyDuAn;Integrated Security=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(e => e.Idadmin).HasName("PK__Admin__D704F3E80CA96D9D");

            entity.ToTable("Admin");

            entity.Property(e => e.Idadmin)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDAdmin");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.GioiTinh)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.HoTenAdmin)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.IdtaiKhoan)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDTaiKhoan");
            entity.Property(e => e.Sdt).HasColumnName("SDT");

            entity.HasOne(d => d.IdtaiKhoanNavigation).WithMany(p => p.Admins)
                .HasForeignKey(d => d.IdtaiKhoan)
                .HasConstraintName("FK__Admin__IDTaiKhoa__46E78A0C");
        });

        modelBuilder.Entity<DuAn>(entity =>
        {
            entity.HasKey(e => e.IdduAn).HasName("PK__DuAn__2DE822BBB605DEA0");

            entity.ToTable("DuAn");

            entity.Property(e => e.IdduAn)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDDuAn");
            entity.Property(e => e.IdnguoiQuanLy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDNguoiQuanLy");
            entity.Property(e => e.IdnhomLamViec).HasColumnName("IDNhomLamViec");
            entity.Property(e => e.MoTaDuAn)
                .HasMaxLength(255)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.TenDuAn)
                .HasMaxLength(255)
                .IsUnicode(false)
                .IsFixedLength();

            entity.HasOne(d => d.IdnguoiQuanLyNavigation).WithMany(p => p.DuAns)
                .HasForeignKey(d => d.IdnguoiQuanLy)
                .HasConstraintName("FK__DuAn__IDNguoiQua__4CA06362");

            entity.HasOne(d => d.IdnhomLamViecNavigation).WithMany(p => p.DuAns)
                .HasForeignKey(d => d.IdnhomLamViec)
                .HasConstraintName("FK__DuAn__IDNhomLamV__4D94879B");
        });

        modelBuilder.Entity<NhanVien>(entity =>
        {
            entity.HasKey(e => e.IdnhanVien).HasName("PK__NhanVien__7AC2D9F7975BC2CF");

            entity.ToTable("NhanVien");

            entity.Property(e => e.IdnhanVien)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDNhanVien");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.GioiTinh)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.HoTenNhanVien)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Idadmin)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDAdmin");
            entity.Property(e => e.IdnguoiQuanLy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDNguoiQuanLy");
            entity.Property(e => e.IdnhomLamViec).HasColumnName("IDNhomLamViec");
            entity.Property(e => e.Sdt).HasColumnName("SDT");

            entity.HasOne(d => d.IdadminNavigation).WithMany(p => p.NhanViens)
                .HasForeignKey(d => d.Idadmin)
                .HasConstraintName("FK__NhanVien__IDAdmi__49C3F6B7");

            entity.HasOne(d => d.IdnguoiQuanLyNavigation).WithMany(p => p.NhanViens)
                .HasForeignKey(d => d.IdnguoiQuanLy)
                .HasConstraintName("FK__NhanVien__IDNguo__4BAC3F29");

            entity.HasOne(d => d.IdnhomLamViecNavigation).WithMany(p => p.NhanViens)
                .HasForeignKey(d => d.IdnhomLamViec)
                .HasConstraintName("FK__NhanVien__IDNhom__4AB81AF0");
        });

        modelBuilder.Entity<NhomLamViec>(entity =>
        {
            entity.HasKey(e => e.IdnhomLamViec).HasName("PK__NhomLamV__7FA9BFE4425CDA74");

            entity.ToTable("NhomLamViec");

            entity.Property(e => e.IdnhomLamViec)
                .ValueGeneratedNever()
                .HasColumnName("IDNhomLamViec");
            entity.Property(e => e.IdnguoiQuanLy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDNguoiQuanLy");
            entity.Property(e => e.TenNhom)
                .HasMaxLength(255)
                .IsUnicode(false)
                .IsFixedLength();

            entity.HasOne(d => d.IdnguoiQuanLyNavigation).WithMany(p => p.NhomLamViecs)
                .HasForeignKey(d => d.IdnguoiQuanLy)
                .HasConstraintName("FK__NhomLamVi__IDNgu__4E88ABD4");
        });

        modelBuilder.Entity<TaiKhoan>(entity =>
        {
            entity.HasKey(e => e.IdtaiKhoan).HasName("PK__TaiKhoan__BC5F907C8A9612A4");

            entity.ToTable("TaiKhoan");

            entity.Property(e => e.IdtaiKhoan)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDTaiKhoan");
            entity.Property(e => e.MatKhau)
                .HasMaxLength(8)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.QuyenTaiKhoan)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength();
        });

        modelBuilder.Entity<TaiLieu>(entity =>
        {
            entity.HasKey(e => e.IdtaiLieu).HasName("PK__TaiLieu__E0E4F6994C0E8E98");

            entity.ToTable("TaiLieu");

            entity.Property(e => e.IdtaiLieu)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDTaiLieu");
            entity.Property(e => e.IdduAn)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDDuAn");
            entity.Property(e => e.TenTaiLieu)
                .HasMaxLength(255)
                .IsUnicode(false)
                .IsFixedLength();

            entity.HasOne(d => d.IdduAnNavigation).WithMany(p => p.TaiLieus)
                .HasForeignKey(d => d.IdduAn)
                .HasConstraintName("FK__TaiLieu__IDDuAn__5441852A");
        });

        modelBuilder.Entity<Task>(entity =>
        {
            entity.HasKey(e => e.Idtask).HasName("PK__Task__BCC3A1F904C25C4B");

            entity.ToTable("Task");

            entity.Property(e => e.Idtask)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDTask");
            entity.Property(e => e.IdduAn)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDDuAn");
            entity.Property(e => e.IdnguoiTaoTask)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDNguoiTaoTask");
            entity.Property(e => e.IdnhanVienNhanTask)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDNhanVienNhanTask");
            entity.Property(e => e.TenTask)
                .HasMaxLength(255)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.TrangThai)
                .HasMaxLength(15)
                .IsUnicode(false)
                .IsFixedLength();

            entity.HasOne(d => d.IdduAnNavigation).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.IdduAn)
                .HasConstraintName("FK__Task__IDDuAn__5165187F");

            entity.HasOne(d => d.IdnguoiTaoTaskNavigation).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.IdnguoiTaoTask)
                .HasConstraintName("FK__Task__IDNguoiTao__4F7CD00D");

            entity.HasOne(d => d.IdnhanVienNhanTaskNavigation).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.IdnhanVienNhanTask)
                .HasConstraintName("FK__Task__IDNhanVien__5070F446");
        });

        modelBuilder.Entity<TaskCon>(entity =>
        {
            entity.HasKey(e => e.IdtaskCon).HasName("PK__TaskCon__03BEE992A99CCCED");

            entity.ToTable("TaskCon");

            entity.Property(e => e.IdtaskCon)
                .ValueGeneratedNever()
                .HasColumnName("IDTaskCon");
            entity.Property(e => e.IdnguoiTaoTask)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDNguoiTaoTask");
            entity.Property(e => e.IdtaskCha)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDTaskCha");
            entity.Property(e => e.TenTaskCon)
                .HasMaxLength(255)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.TrangThai)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength();

            entity.HasOne(d => d.IdnguoiTaoTaskNavigation).WithMany(p => p.TaskCons)
                .HasForeignKey(d => d.IdnguoiTaoTask)
                .HasConstraintName("FK__TaskCon__IDNguoi__534D60F1");

            entity.HasOne(d => d.IdtaskChaNavigation).WithMany(p => p.TaskCons)
                .HasForeignKey(d => d.IdtaskCha)
                .HasConstraintName("FK__TaskCon__IDTaskC__52593CB8");
        });

        modelBuilder.Entity<TruongNhom>(entity =>
        {
            entity.HasKey(e => e.IdtruongNhom).HasName("PK__TruongNh__DCADA2F51A53CE19");

            entity.ToTable("TruongNhom");

            entity.Property(e => e.IdtruongNhom)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDTruongNhom");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.GioiTinh)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.HoTenTruongNhom)
                .HasMaxLength(40)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Idadmin)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDAdmin");
            entity.Property(e => e.IdtaiKhoan)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("IDTaiKhoan");
            entity.Property(e => e.Sdt).HasColumnName("SDT");

            entity.HasOne(d => d.IdadminNavigation).WithMany(p => p.TruongNhoms)
                .HasForeignKey(d => d.Idadmin)
                .HasConstraintName("FK__TruongNho__IDAdm__47DBAE45");

            entity.HasOne(d => d.IdtaiKhoanNavigation).WithMany(p => p.TruongNhoms)
                .HasForeignKey(d => d.IdtaiKhoan)
                .HasConstraintName("FK__TruongNho__IDTai__48CFD27E");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
