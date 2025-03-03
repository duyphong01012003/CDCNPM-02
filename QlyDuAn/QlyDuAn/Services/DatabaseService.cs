using Microsoft.Data.SqlClient;

namespace QlyDuAn.Services
{
    public class DatabaseService
    {
        private readonly string _connectionString;

        public DatabaseService(string connectionString)
        {
            _connectionString = connectionString;
        }

        public int GetTotalCountNhanVien()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("SELECT COUNT(*) FROM NhanVien", connection))
                {
                    return (int)command.ExecuteScalar();
                }
            }
        }
        public int GetTotalCountNhom()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("SELECT COUNT(*) FROM NhomLamViec", connection))
                {
                    return (int)command.ExecuteScalar();
                }
            }
        }
        public int GetTotalCountDuAn()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("SELECT COUNT(*) FROM DuAn", connection))
                {
                    return (int)command.ExecuteScalar();
                }
            }
        }
        public int GetTotalCountTruongNhom()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("SELECT COUNT(*) FROM TruongNhom", connection))
                {
                    return (int)command.ExecuteScalar();
                }
            }
        }
    }
}
