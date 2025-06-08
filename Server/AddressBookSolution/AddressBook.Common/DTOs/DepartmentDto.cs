using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.Common.DTOs
{
    public class DepartmentDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public ICollection<AddressBookEntryDto> AddressBookEntries { get; set; } = new List<AddressBookEntryDto>();
    }
}
