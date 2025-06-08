using AddressBook.DAL.Repositories;
using AddressBook.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.DAL.Interfaces
{
    public interface IDepartmentRepository : IGenericRepository<Department>
    {
        // GetByNameAsync
        Task<Department?> GetByNameAsync(string name);
    }
}
