using AddressBook.Common.DTOs;
using AddressBook.Common.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.BLL.Interfaces
{
    public interface IAddressBookEntryService
    {
        Task<ApiResponse<List<AddressBookEntryDto>>> GetAllAsync();
        Task<ApiResponse<AddressBookEntryDto>> GetByIdAsync(int id);
        Task<ApiResponse<AddressBookEntryDto>> AddAsync(CreateAddressBookDto dto);
        Task<ApiResponse<bool>> UpdateAsync(int id, AddressBookEntryDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
        Task<ApiResponse<List<SearchAddressBookDto>>> SearchAsync(SearchAddressBookDto dto);
        Task<byte[]> ExportToExcelAsync();
     
    }
}
