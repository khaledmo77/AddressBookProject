using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.Common.DTOs
{
   
        public class AddressBookEntryDto
        {
             public int Id { get; set; }
             public string FullName { get; set; } = null!;
            public int JobId { get; set; }
            public int DepartmentId { get; set; }
            public string JobTitle { get; set; } = null!;
            public string DepartmentName { get; set; } = null!;
            public string MobileNumber { get; set; } = null!;
            public string Address { get; set; } = null!;
            public string Email { get; set; } = null!;
            public string Password { get; set; } = null!;

            public IFormFile Photo { get; set; } = null!;
            public string? PhotoUrl { get; set; }
           public DateTime DateOfBirth { get; set; }
            public DateTime BirthDateFrom { get; set; }
            public DateTime BirthDateTo { get; set; }
            public int AgeFrom { get; set; }
            public int AgeTo { get; set; }

        public int Age
            {
                get
                {
                    var today = DateTime.Today;
                    var age = today.Year - DateOfBirth.Year;
                    if (DateOfBirth.Date > today.AddYears(-age)) age--;
                    return age;
                }
            }

    }



    
}
