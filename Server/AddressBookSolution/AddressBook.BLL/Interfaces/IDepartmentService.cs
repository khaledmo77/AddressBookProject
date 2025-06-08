using AddressBook.Common.DTOs;
using AddressBook.Common.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.BLL.Interfaces
{
    public interface IDepartmentService
    {
        Task<ApiResponse<List<DepartmentDto>>> GetAllDepartmentsAsync();
        Task<ApiResponse<DepartmentDto>> GetDepartmentByIdAsync(int id);
        Task<ApiResponse<bool>> AddDepartmentAsync(DepartmentDto dto);
        Task<ApiResponse<bool>> UpdateDepartmentAsync(int id, DepartmentDto dto);
        Task<ApiResponse<bool>> DeleteDepartmentAsync(int id);
    }
}
