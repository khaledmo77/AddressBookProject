using AddressBook.BLL.Interfaces;
using AddressBook.Common.DTOs;
using AddressBook.Common.Response;
using AddressBook.DAL.Interfaces;
using AddressBook.Domain.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.BLL.Services
{
    public class DepartmentService:IDepartmentService
    {
        private readonly IDepartmentRepository _departmentRepository;
        private readonly IMapper mapper;
        public DepartmentService(IDepartmentRepository departmentRepository,IMapper mapper)
        {
            _departmentRepository = departmentRepository;
            this.mapper = mapper;
        }
        public async Task<ApiResponse<List<DepartmentDto>>> GetAllDepartmentsAsync()
        { 
            var departments = await _departmentRepository.GetAllAsync();
            var departmentDtos = departments.Select(d => new DepartmentDto
            {
                Id = d.Id,
                Name = d.Name
            }).ToList();
            return new ApiResponse<List<DepartmentDto>>(true, data: departmentDtos);


        }
        public async Task<ApiResponse<DepartmentDto>> GetDepartmentByIdAsync(int id)
        {
            var department = await _departmentRepository.GetByIdAsync(id);
            if (department == null)
            {
                return new ApiResponse<DepartmentDto>(false, message: "Department not found");
            }
            var departmentDto = new DepartmentDto
            {
                Id = department.Id,
                Name = department.Name
            };
            return new ApiResponse<DepartmentDto>(true, data: departmentDto);

        }
        public async Task<ApiResponse<DepartmentDto>> AddDepartmentAsync(CreateDepartmentDto departmentDto)
        {
            if (string.IsNullOrWhiteSpace(departmentDto.Name))
            {
                return new ApiResponse<DepartmentDto>(false, "Department name cannot be empty", null);
            }

            var existingDepartment = await _departmentRepository.GetByNameAsync(departmentDto.Name);
            if (existingDepartment != null)
            {
                return new ApiResponse<DepartmentDto>(false, "Department with this name already exists", null);
            }

            var department = new Department
            {
                Name = departmentDto.Name
            };

            await _departmentRepository.AddAsync(department);

            var resultDto = new DepartmentDto
            {
                Id = department.Id,
                Name = department.Name
            };

            return new ApiResponse<DepartmentDto>(true, "Department added successfully", resultDto);
        }


        public async Task<ApiResponse<bool>> UpdateDepartmentAsync(int id,UpdateDepartmentDto departmentDto)
        {
            if (id <= 0)
            {
                return new ApiResponse<bool>(false, message: "Invalid department ID");
            }
            if (string.IsNullOrWhiteSpace(departmentDto.Name))
            {
                return new ApiResponse<bool>(false, message: "Department name cannot be empty");
            }
            var existingDepartment = await _departmentRepository.GetByIdAsync(id);
            if (existingDepartment == null)
            {
                return new ApiResponse<bool>(false, message: "Department not found");
            }
            existingDepartment.Name = departmentDto.Name;
            await _departmentRepository.UpdateAsync(existingDepartment);
            return new ApiResponse<bool>(true, data: true);

        }
        public async Task<ApiResponse<bool>> DeleteDepartmentAsync(int id)
        {
            if (id <= 0)
            {
                return new ApiResponse<bool>(false, message: "Invalid department ID");
            }
            var existingDepartment = await _departmentRepository.GetByIdAsync(id);
            if (existingDepartment == null)
            {
                return new ApiResponse<bool>(false, message: "Department not found");
            }
            await _departmentRepository.DeleteAsync(id);
            return new ApiResponse<bool>(true, data: true);



        }
      
    }
}
