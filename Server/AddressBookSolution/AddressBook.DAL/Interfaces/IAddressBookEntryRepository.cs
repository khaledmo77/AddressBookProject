using AddressBook.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.DAL.Interfaces
{
    public interface IAddressBookEntryRepository:IGenericRepository<AddressBookEntry>
    {
        Task<IEnumerable<AddressBookEntry>> SearchAsync(
           string? fullName,
           int? jobId,
           int? departmentId,
           string? mobileNumber,
           string? address,
           string? email,
           int? ageFrom,
           int? ageTo,
           DateTime? birthDateFrom,
           DateTime? birthDateTo);
        Task<bool> ExistsAsync(string? email, string? mobileNumber, int excludeId);
        Task<bool> ExistsAsync(string email, string mobileNumber);
       
    }
 
}
