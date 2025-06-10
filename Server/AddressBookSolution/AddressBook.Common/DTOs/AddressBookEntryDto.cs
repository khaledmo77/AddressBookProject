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

             public JobDto Job { get; set; } = null!;
              public DepartmentDto Department { get; set; } = null!;
        
        
            public string MobileNumber { get; set; } = null!;
            public string Address { get; set; } = null!;
            public string Email { get; set; } = null!;
            public string Password { get; set; } = null!;

            public IFormFile Photo { get; set; } = null!;
            public string? PhotoPath { get; set; }
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
