﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.Domain.Entities
{
    public class Job
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public ICollection<AddressBookEntry> AddressBookEntries { get; set; } = new List<AddressBookEntry>();
    }
}
