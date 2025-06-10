using AddressBook.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.BLL.Interfaces
{
    public interface IAdminService
    {
        Task<bool> RegisterAdminAsync(AdminRegisterDto dto);
        Task<string> LoginAdminAsync(AdminLoginDto dto);
    }
}
