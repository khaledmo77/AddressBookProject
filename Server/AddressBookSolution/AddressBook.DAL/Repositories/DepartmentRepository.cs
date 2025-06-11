using AddressBook.DAL.Data;
using AddressBook.DAL.Interfaces;
using AddressBook.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace AddressBook.DAL.Repositories
{
    public class DepartmentRepository : GenericRepository<Department>, IDepartmentRepository
    {
        public DepartmentRepository(AddressBookContext context) : base(context)
        {
        }

        // Additional methods specific to DepartmentRepository can be added here

     //getbynameasync
        public async Task<Department?> GetByNameAsync(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(d => d.Name.ToLower() == name.ToLower());
        }
    
   
    }
}
