using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.Common.DTOs
{
    public class UpdateAddressBookEntryDto
    {
        public string FullName { get; set; } = null!;
        public string MobileNumber { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? PhotoPath { get; set; }
        public IFormFile? Photo { get; set; } = null!;

        public int JobId { get; set; }
        public int DepartmentId { get; set; }
      

    }
}
