using AddressBook.Common.DTOs;
using AddressBook.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
namespace AddressBook.BLL.AutoMapper
{

    public class AddressBookMappingProfile : Profile
    {
        public AddressBookMappingProfile()
        {
            CreateMap<Job, JobDto>().ReverseMap();
            CreateMap<Department, DepartmentDto>().ReverseMap();
            CreateMap<JobDto, Job>();
            CreateMap<DepartmentDto, Department>();
            CreateMap<AddressBookEntry, AddressBookEntryDto>().ReverseMap();
            CreateMap<AddressBookEntryDto, AddressBookEntry>();
            CreateMap<CreateAddressBookDto, AddressBookEntry>()
              .ForMember(dest => dest.PhotoPath, opt => opt.Ignore());
            CreateMap<AddressBookEntry, CreateAddressBookDto>();
            CreateMap<SearchAddressBookDto, AddressBookEntry>();
            CreateMap<AddressBookEntry, SearchAddressBookDto>();



        }
    }
}
