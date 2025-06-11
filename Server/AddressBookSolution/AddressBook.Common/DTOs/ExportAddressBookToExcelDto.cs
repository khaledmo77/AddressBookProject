using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.Common.DTOs
{
    public class ExportAddressBookToExcelDto
    {
        public string FullName { get; set; }= null!;
        public string JobTitle { get; set; } = null!;
        public string Department { get; set; } = null!;
        public string MobileNumber { get; set; } = null!;
        public DateTime DateOfBirth { get; set; }   
        public string Address { get; set; } = null!;
        public string Email { get; set; } = null!;
        public int Age { get; set; }
    }
}
