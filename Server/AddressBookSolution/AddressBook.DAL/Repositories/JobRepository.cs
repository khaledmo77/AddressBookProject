using AddressBook.DAL.Data;
using AddressBook.DAL.Interfaces;
using AddressBook.Domain.Entities;
using Microsoft.EntityFrameworkCore;
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
        public async Task<Job?> GetByNameAsync(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(d => d.Name.ToLower() == name.ToLower());
        }

        // Additional methods specific to JobRepository can be added here
    }

}
