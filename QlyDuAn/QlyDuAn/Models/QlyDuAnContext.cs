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
        => optionsBuilder.UseSqlServer("Name=DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(e => e.Idadmin).HasName("PK__Admin__D704F3E8B9B222E5");

            entity.ToTable("Admin");

            entity.Property(e => e.Idadmin).HasColumnName("IDAdmin");
            entity.Property(e => e.CodeAdmin)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasComputedColumnSql("('Ad'+right('0000'+CONVERT([varchar](5),[IDAdmin]),(5)))", true);
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.GioiTinh)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.HoTenAdmin).HasMaxLength(50);
            entity.Property(e => e.IdtaiKhoan).HasColumnName("IDTaiKhoan");
            entity.Property(e => e.Sdt)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("SDT");

            entity.HasOne(d => d.IdtaiKhoanNavigation).WithMany(p => p.Admins)
                .HasForeignKey(d => d.IdtaiKhoan)
                .HasConstraintName("FK__Admin__IDTaiKhoa__59063A47");
        });

        modelBuilder.Entity<DuAn>(entity =>
        {
            entity.HasKey(e => e.IdduAn).HasName("PK__DuAn__2DE822BBA7EB33E3");

            entity.ToTable("DuAn");

            entity.Property(e => e.IdduAn).HasColumnName("IDDuAn");
            entity.Property(e => e.CodeDuAn)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasComputedColumnSql("('DA'+right('0000'+CONVERT([varchar](5),[IDDuAn]),(5)))", true);
            entity.Property(e => e.IdnguoiQuanLy).HasColumnName("IDNguoiQuanLy");
            entity.Property(e => e.IdnhomLamViec).HasColumnName("IDNhomLamViec");
            entity.Property(e => e.MoTaDuAn)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.TenDuAn)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.HasOne(d => d.IdnguoiQuanLyNavigation).WithMany(p => p.DuAns)
                .HasForeignKey(d => d.IdnguoiQuanLy)
                .HasConstraintName("FK__DuAn__IDNguoiQua__5FB337D6");

            entity.HasOne(d => d.IdnhomLamViecNavigation).WithMany(p => p.DuAns)
                .HasForeignKey(d => d.IdnhomLamViec)
                .HasConstraintName("FK__DuAn__IDNhomLamV__60A75C0F");
        });

        modelBuilder.Entity<NhanVien>(entity =>
        {
            entity.HasKey(e => e.IdnhanVien).HasName("PK__NhanVien__7AC2D9F73643A84A");

            entity.ToTable("NhanVien");

            entity.Property(e => e.IdnhanVien).HasColumnName("IDNhanVien");
            entity.Property(e => e.CodeNhanVien)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasComputedColumnSql("('NV'+right('0000'+CONVERT([varchar](5),[IDNhanVien]),(5)))", true);
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.GioiTinh)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.HoTenNhanVien).HasMaxLength(50);
            entity.Property(e => e.Idadmin).HasColumnName("IDAdmin");
            entity.Property(e => e.IdnguoiQuanLy).HasColumnName("IDNguoiQuanLy");
            entity.Property(e => e.IdnhomLamViec).HasColumnName("IDNhomLamViec");
            entity.Property(e => e.IdtaiKhoan).HasColumnName("IDTaiKhoan");
            entity.Property(e => e.Sdt)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("SDT");

            entity.HasOne(d => d.IdadminNavigation).WithMany(p => p.NhanViens)
                .HasForeignKey(d => d.Idadmin)
                .HasConstraintName("FK__NhanVien__IDAdmi__5BE2A6F2");

            entity.HasOne(d => d.IdnguoiQuanLyNavigation).WithMany(p => p.NhanViens)
                .HasForeignKey(d => d.IdnguoiQuanLy)
                .HasConstraintName("FK__NhanVien__IDNguo__5DCAEF64");

            entity.HasOne(d => d.IdnhomLamViecNavigation).WithMany(p => p.NhanViens)
                .HasForeignKey(d => d.IdnhomLamViec)
                .HasConstraintName("FK__NhanVien__IDNhom__5CD6CB2B");

            entity.HasOne(d => d.IdtaiKhoanNavigation).WithMany(p => p.NhanViens)
                .HasForeignKey(d => d.IdtaiKhoan)
                .HasConstraintName("FK__NhanVien__IDTaiK__5EBF139D");
        });

        modelBuilder.Entity<NhomLamViec>(entity =>
        {
            entity.HasKey(e => e.IdnhomLamViec).HasName("PK__NhomLamV__7FA9BFE47CE63602");

            entity.ToTable("NhomLamViec");

            entity.Property(e => e.IdnhomLamViec).HasColumnName("IDNhomLamViec");
            entity.Property(e => e.CodeNhom)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasComputedColumnSql("('Nhom'+right('0000'+CONVERT([varchar](5),[IDNhomLamViec]),(5)))", true);
            entity.Property(e => e.IdnguoiQuanLy).HasColumnName("IDNguoiQuanLy");
            entity.Property(e => e.TenNhom)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.HasOne(d => d.IdnguoiQuanLyNavigation).WithMany(p => p.NhomLamViecs)
                .HasForeignKey(d => d.IdnguoiQuanLy)
                .HasConstraintName("FK__NhomLamVi__IDNgu__619B8048");
        });

        modelBuilder.Entity<TaiKhoan>(entity =>
        {
            entity.HasKey(e => e.IdtaiKhoan).HasName("PK__TaiKhoan__BC5F907C4F1A62EE");

            entity.ToTable("TaiKhoan");

            entity.Property(e => e.IdtaiKhoan).HasColumnName("IDTaiKhoan");
            entity.Property(e => e.CodeTaiKhoan)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasComputedColumnSql("('TK'+right('0000'+CONVERT([varchar](5),[IDTaiKhoan]),(5)))", true);
            entity.Property(e => e.MatKhau)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.QuyenTaiKhoan)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        modelBuilder.Entity<TaiLieu>(entity =>
        {
            entity.HasKey(e => e.IdtaiLieu).HasName("PK__TaiLieu__E0E4F6993A876782");

            entity.ToTable("TaiLieu");

            entity.Property(e => e.IdtaiLieu).HasColumnName("IDTaiLieu");
            entity.Property(e => e.CodeTaiLieu)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasComputedColumnSql("('TL'+right('0000'+CONVERT([varchar](5),[IDTaiLieu]),(5)))", true);
            entity.Property(e => e.IdduAn).HasColumnName("IDDuAn");
            entity.Property(e => e.TenTaiLieu)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.HasOne(d => d.IdduAnNavigation).WithMany(p => p.TaiLieus)
                .HasForeignKey(d => d.IdduAn)
                .HasConstraintName("FK__TaiLieu__IDDuAn__6754599E");
        });

        modelBuilder.Entity<Task>(entity =>
        {
            entity.HasKey(e => e.Idtask).HasName("PK__Task__BCC3A1F9965CD471");

            entity.ToTable("Task");

            entity.Property(e => e.Idtask).HasColumnName("IDTask");
            entity.Property(e => e.CodeTank)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasComputedColumnSql("('Tk'+right('0000'+CONVERT([varchar](5),[IDTask]),(5)))", true);
            entity.Property(e => e.IdduAn).HasColumnName("IDDuAn");
            entity.Property(e => e.IdnguoiTaoTask).HasColumnName("IDNguoiTaoTask");
            entity.Property(e => e.IdnhanVienNhanTask).HasColumnName("IDNhanVienNhanTask");
            entity.Property(e => e.TenTask)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(15)
                .IsUnicode(false);

            entity.HasOne(d => d.IdduAnNavigation).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.IdduAn)
                .HasConstraintName("FK__Task__IDDuAn__6477ECF3");

            entity.HasOne(d => d.IdnguoiTaoTaskNavigation).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.IdnguoiTaoTask)
                .HasConstraintName("FK__Task__IDNguoiTao__628FA481");

            entity.HasOne(d => d.IdnhanVienNhanTaskNavigation).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.IdnhanVienNhanTask)
                .HasConstraintName("FK__Task__IDNhanVien__6383C8BA");
        });

        modelBuilder.Entity<TaskCon>(entity =>
        {
            entity.HasKey(e => e.IdtaskCon).HasName("PK__TaskCon__03BEE9927443C4CC");

            entity.ToTable("TaskCon");

            entity.Property(e => e.IdtaskCon).HasColumnName("IDTaskCon");
            entity.Property(e => e.CodeTankCon)
                .HasMaxLength(8)
                .IsUnicode(false)
                .HasComputedColumnSql("('TkC'+right('0000'+CONVERT([varchar](5),[IDTaskCon]),(5)))", true);
            entity.Property(e => e.IdnguoiTaoTask).HasColumnName("IDNguoiTaoTask");
            entity.Property(e => e.IdtaskCha).HasColumnName("IDTaskCha");
            entity.Property(e => e.TenTaskCon)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(10)
                .IsUnicode(false);

            entity.HasOne(d => d.IdnguoiTaoTaskNavigation).WithMany(p => p.TaskCons)
                .HasForeignKey(d => d.IdnguoiTaoTask)
                .HasConstraintName("FK__TaskCon__IDNguoi__66603565");

            entity.HasOne(d => d.IdtaskChaNavigation).WithMany(p => p.TaskCons)
                .HasForeignKey(d => d.IdtaskCha)
                .HasConstraintName("FK__TaskCon__IDTaskC__656C112C");
        });

        modelBuilder.Entity<TruongNhom>(entity =>
        {
            entity.HasKey(e => e.IdtruongNhom).HasName("PK__TruongNh__DCADA2F55030F27A");

            entity.ToTable("TruongNhom");

            entity.Property(e => e.IdtruongNhom).HasColumnName("IDTruongNhom");
            entity.Property(e => e.CodeTruongNhom)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasComputedColumnSql("('TN'+right('0000'+CONVERT([varchar](5),[IDTruongNhom]),(5)))", true);
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.GioiTinh)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.HoTenTruongNhom).HasMaxLength(50);
            entity.Property(e => e.Idadmin).HasColumnName("IDAdmin");
            entity.Property(e => e.IdtaiKhoan).HasColumnName("IDTaiKhoan");
            entity.Property(e => e.Sdt)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("SDT");

            entity.HasOne(d => d.IdadminNavigation).WithMany(p => p.TruongNhoms)
                .HasForeignKey(d => d.Idadmin)
                .HasConstraintName("FK__TruongNho__IDAdm__59FA5E80");

            entity.HasOne(d => d.IdtaiKhoanNavigation).WithMany(p => p.TruongNhoms)
                .HasForeignKey(d => d.IdtaiKhoan)
                .HasConstraintName("FK__TruongNho__IDTai__5AEE82B9");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
