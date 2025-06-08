using AddressBook.BLL.Interfaces;
using AddressBook.Common.DTOs;
using AddressBook.Common.Helpers;
using AddressBook.Common.Response;
using AddressBook.DAL.Interfaces;
using AddressBook.Domain.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.BLL.Services
{
    public class AddressBookEntryService:IAddressBookEntryService
    {
        private readonly IAddressBookEntryRepository _addressBookEntryRepository;
        private readonly IMapper _mapper;
        public AddressBookEntryService(IAddressBookEntryRepository addressBookEntryRepository,IMapper mapper)
        {
            _addressBookEntryRepository = addressBookEntryRepository;
            _mapper = mapper;

        }
       public async Task<ApiResponse<List<AddressBookEntryDto>>> GetAllAsync()
        {
            var entries = await _addressBookEntryRepository.GetAllAsync();
            var dtoList = _mapper.Map<List<AddressBookEntryDto>>(entries);
            return new ApiResponse<List<AddressBookEntryDto>>(true,"data fetched successfully",dtoList);

        }
       public async Task<ApiResponse<AddressBookEntryDto>> GetByIdAsync(int id)
        {
            var entry = await _addressBookEntryRepository.GetByIdAsync(id);
            if (entry == null)
            {
                return new ApiResponse<AddressBookEntryDto>(false,"Entry not found");
            }
            var dto = _mapper.Map<AddressBookEntryDto>(entry);
            return new ApiResponse<AddressBookEntryDto>(true,"Data fetched successfully", dto);

        }
        public async Task<ApiResponse<AddressBookEntryDto>> AddAsync(CreateAddressBookDto dto)
        {
            if (dto == null)
            {
                return new ApiResponse<AddressBookEntryDto>(false, "Invalid entry data.", null);
            }

            var exists = await _addressBookEntryRepository.ExistsAsync(dto.Email, dto.MobileNumber);
            if (exists)
            {
                return new ApiResponse<AddressBookEntryDto>(false, "Email or Mobile number already exists.", null);
            }

            var entity = _mapper.Map<AddressBookEntry>(dto);

            if (dto.Photo != null)
                entity.PhotoPath = FileHelper.SaveFile(dto.Photo);

            await _addressBookEntryRepository.AddAsync(entity);

            // Map back to DTO with Id
            var resultDto = _mapper.Map<AddressBookEntryDto>(entity);

            return new ApiResponse<AddressBookEntryDto>(true, "Address Book Entry Added Successfully", resultDto);
        }

        public async  Task<ApiResponse<bool>> UpdateAsync(int id, AddressBookEntryDto dto)
        {
            var existingEntry = await _addressBookEntryRepository.GetByIdAsync(id);
            if (existingEntry == null)
            {
                return new ApiResponse<bool>(false, "Entry not found.", false);
            }
            var exists = await _addressBookEntryRepository.ExistsAsync(dto.Email, dto.MobileNumber);
            if (exists && (existingEntry.Email != dto.Email || existingEntry.MobileNumber != dto.MobileNumber))
            {
                return new ApiResponse<bool>(false, "Email or Mobile number already exists.", false);
            }
            var entity = _mapper.Map<AddressBookEntry>(dto);
            entity.Id = id;
            if (dto.Photo != null)
                entity.PhotoPath = FileHelper.SaveFile(dto.Photo);
            await _addressBookEntryRepository.UpdateAsync(entity);
            return new ApiResponse<bool>(true, "Address Book Entry Updated Successfully", true);

        }
       public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var entry = await _addressBookEntryRepository.GetByIdAsync(id);
            if (entry == null)
            {
                return new ApiResponse<bool>(false, "Entry not found.", false);
            }
            await _addressBookEntryRepository.DeleteAsync(id);
            return new ApiResponse<bool>(true, "Address Book Entry Deleted Successfully", true);

        }
      public async  Task<ApiResponse<List<SearchAddressBookDto>>> SearchAsync(SearchAddressBookDto dto)
        {
            var entries = await _addressBookEntryRepository.SearchAsync(
                dto.FullName,
                dto.JobId,
                dto.DepartmentId,
                dto.MobileNumber,
                dto.Address,
                dto.Email,
                dto.AgeFrom,
                dto.AgeTo,
                dto.BirthDateFrom,
                dto.BirthDateTo);
            if (entries == null || !entries.Any())
            {
                return new ApiResponse<List<SearchAddressBookDto>>(false, "No entries found.", new List<SearchAddressBookDto>());
            }
            var dtoList = _mapper.Map<List<SearchAddressBookDto>>(entries);
            return new ApiResponse<List<SearchAddressBookDto>>(true, "Search completed successfully.", dtoList);

        }
       public async Task<byte[]> ExportToExcelAsync()
        {
            var entries = await _addressBookEntryRepository.GetAllAsync();
            var dtoList = _mapper.Map<List<AddressBookEntryDto>>(entries);
            return ExcelExportHelper.ExportAddressBookToExcel(dtoList);

        }

    }
}
