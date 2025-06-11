using AddressBook.Common.DTOs;
using AddressBook.Common.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.BLL.Interfaces
{
    public interface IJobService
    {
        Task<ApiResponse<List<JobDto>>> GetAllAsync();
        Task<ApiResponse<JobDto>> GetByIdAsync(int id);
        Task<ApiResponse<JobDto>> AddAsync(CreateJobDto dto);
        Task<ApiResponse<bool>> UpdateAsync(int id, UpdateJobDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
    }
}
