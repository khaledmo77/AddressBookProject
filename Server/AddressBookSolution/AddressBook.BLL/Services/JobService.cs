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
    public class JobService:IJobService
    { 
      
        private readonly IJobRepository _jobRepository;
        private readonly IMapper _mapper;
        public JobService(IJobRepository jobRepository, IMapper mapper)
        {
            _jobRepository = jobRepository;
            _mapper = mapper;
        }
        public async Task<ApiResponse<List<JobDto>>> GetAllAsync()
        {
            var jobs = await _jobRepository.GetAllAsync();
            var jobDtos = jobs.Select(job => new JobDto
            {
                Id = job.Id,
                Name = job.Name,
            
            }).ToList();
            return new ApiResponse<List<JobDto>>
            (
               true,"Fetched successfully",
                jobDtos
            );

        }
       public async Task<ApiResponse<JobDto>> GetByIdAsync(int id)
        {
            var job = await _jobRepository.GetByIdAsync(id);
            if (job == null)
            {
                return new ApiResponse<JobDto>(false, "Job not found", null);
            }
            var jobDto = new JobDto
            {
                Id = job.Id,
                Name = job.Name,
            };
            return new ApiResponse<JobDto>(true, "Fetched successfully", jobDto);

        }
        public async Task<ApiResponse<JobDto>> AddAsync(CreateJobDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Name))
            {
                return new ApiResponse<JobDto>(false, "Invalid job data.", null);
            }

            // Optional: check for existing job if uniqueness is required
            var existingJob = await _jobRepository.GetByNameAsync(dto.Name);
            if (existingJob != null)
            {
                return new ApiResponse<JobDto>(false, "A job with this title already exists.", null);
            }

            var job = new Job
            {
               Name= dto.Name,
              
            };

            await _jobRepository.AddAsync(job);

            var resultDto = new JobDto
            {
                Id = job.Id,
                    Name = job.Name,
                
            };

            return new ApiResponse<JobDto>(true, "Job added successfully", resultDto);
        }

        public async Task<ApiResponse<bool>> UpdateAsync(int id, UpdateJobDto dto)
        {
            if (dto == null || id <= 0)
            {
                return new ApiResponse<bool>(false, "Invalid job data", false);
            }
            var job = await _jobRepository.GetByIdAsync(id);
            if (job == null)
            {
                return new ApiResponse<bool>(false, "Job not found", false);
            }
            job.Name = dto.Name;
            await _jobRepository.UpdateAsync(job);
            return new ApiResponse<bool>(true, "Job updated successfully", true);

        }
        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            if (id <= 0)
            {
                return new ApiResponse<bool>(false, "Invalid job ID", false);
            }
            var job = await _jobRepository.GetByIdAsync(id);
            if (job == null)
            {
                return new ApiResponse<bool>(false, "Job not found", false);
            }
            await _jobRepository.DeleteAsync(id);
            return new ApiResponse<bool>(true, "Job deleted successfully", true);

        }
    }
}
