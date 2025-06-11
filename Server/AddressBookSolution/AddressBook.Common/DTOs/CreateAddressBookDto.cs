using AddressBook.Common.Constants;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.Common.DTOs
{
    public class CreateAddressBookDto
    {
   
        public string FullName { get; set; } = null!;
        public int JobId { get; set; }
        public int DepartmentId { get; set; }
        [RegularExpression(RegexPatterns.Phone,ErrorMessage ="Enter a valid number")]

        public string MobileNumber { get; set; } = null!;
        public string Address { get; set; } = null!;
        [EmailAddress(ErrorMessage = "Enter a valid email address")]
        [Required(ErrorMessage = "Email must be entered")]
        [RegularExpression(RegexPatterns.Email, ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = null!;
        [Required(ErrorMessage = "Password must be entered")]

        public string Password { get; set; } = null!;
     

        public IFormFile Photo { get; set; } = null!;
       
        public DateTime DateOfBirth { get; set; }

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
