using AddressBook.DAL.Data;
using AddressBook.DAL.Interfaces;
using AddressBook.Domain.Entities;
using DocumentFormat.OpenXml.InkML;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.DAL.Repositories
{
    public class AddressBookEntryRepository : GenericRepository<AddressBookEntry>, IAddressBookEntryRepository
    {
        public AddressBookEntryRepository(AddressBookContext context) : base(context)
        {
        }


        public async Task<IEnumerable<AddressBookEntry>> SearchAsync(
         string? fullName,
         int? jobId,
         int? departmentId,
         string? mobileNumber,
         string? address,
         string? email,
         int? ageFrom,
         int? ageTo,
         DateTime? birthDateFrom,
         DateTime? birthDateTo)
        {
            var query = _dbSet.AsQueryable();

            if (!string.IsNullOrEmpty(fullName))
            {
                query = query.Where(x => x.FullName.Contains(fullName));
            }

            if (jobId.HasValue)
            {
                query = query.Where(x => x.JobId == jobId.Value);
            }

            if (departmentId.HasValue)
            {
                query = query.Where(x => x.DepartmentId == departmentId.Value);
            }

            if (!string.IsNullOrEmpty(mobileNumber))
            {
                query = query.Where(x => x.MobileNumber.Contains(mobileNumber));
            }

            if (!string.IsNullOrEmpty(address))
            {
                query = query.Where(x => x.Address.Contains(address));
            }

            if (!string.IsNullOrEmpty(email))
            {
                query = query.Where(x => x.Email.Contains(email));
            }

            if (ageFrom.HasValue)
            {
                var dateTo = DateTime.Today.AddYears(-ageFrom.Value);
                query = query.Where(x => x.DateOfBirth <= dateTo);
            }

            if (ageTo.HasValue)
            {
                var dateFrom = DateTime.Today.AddYears(-ageTo.Value);
                query = query.Where(x => x.DateOfBirth >= dateFrom);
            }

            if (birthDateFrom.HasValue)
            {
                query = query.Where(x => x.DateOfBirth >= birthDateFrom.Value);
            }

            if (birthDateTo.HasValue)
            {
                query = query.Where(x => x.DateOfBirth <= birthDateTo.Value);
            }

            return await query.ToListAsync();
        }
        public async Task<bool> ExistsAsync(string? email, string? mobileNumber,int excludeId)
        {
            return await _dbSet.AnyAsync(e => (e.Email == email || e.MobileNumber == mobileNumber) && e.Id != excludeId); 
        }
        public async Task<bool> ExistsAsync(string email, string mobileNumber)
        {
            return await _dbSet.AnyAsync(e => e.Email == email || e.MobileNumber == mobileNumber);
        }
    }
}
