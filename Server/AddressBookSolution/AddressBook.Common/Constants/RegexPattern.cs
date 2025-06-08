using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.Common.Constants
{
    public static class RegexPatterns
    {
        public const string Phone = @"^01[0125][0-9]{8}$";
        public const string Email = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
    }

}
