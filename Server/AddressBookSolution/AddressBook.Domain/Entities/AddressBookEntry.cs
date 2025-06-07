using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.Domain.Entities
{
    public class AddressBookEntry
    {
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public int JobId { get; set; }
        public Job Job { get; set; }=null!;
        public int DepartmentId { get; set; }
        public Department Department { get; set; } = null!;
        public string MobileNumber { get; set; } = null!;
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string PhotoPath { get; set; } = null!;
        [NotMapped]
        public int Age => DateTime.Now.Year - DateOfBirth.Year;
    }
}
