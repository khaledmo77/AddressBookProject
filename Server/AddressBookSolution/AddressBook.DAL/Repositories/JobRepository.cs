using AddressBook.DAL.Data;
using AddressBook.DAL.Interfaces;
using AddressBook.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.DAL.Repositories
{
    public class JobRepository : GenericRepository<Job>,IJobRepository
    {
        public JobRepository(AddressBookContext context) : base(context)
        {
        }
        // Additional methods specific to JobRepository can be added here
    }
  
}
