using AddressBook.Common.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.Common.DTOs
{
    public class AdminRegisterDto
    {
        [Required(ErrorMessage = "Email must be entered")]
        [RegularExpression(RegexPatterns.Email, ErrorMessage = "Invalid email format")]
        public string Email { get; set; }= null!;
        [Required(ErrorMessage = "Password must be entered")]

        public string Password { get; set; } = null!;
    }
}
