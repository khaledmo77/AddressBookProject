using AddressBook.BLL.Interfaces;
using AddressBook.Common.DTOs;
using AddressBook.Common.Response;
using AddressBook.DAL.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBook.BLL.Services
{
    public class JobService:IJobService
    { 
        //Empty Untill i need to implement it

        // Example method (to be implemented):
        // public Task<IEnumerable<JobDto>> GetAllJobsAsync() 
        private readonly IJobRepository _jobRepository;
        public JobService(IJobRepository jobRepository)
        {
            _jobRepository = jobRepository;
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
        public async Task<ApiResponse<bool>> AddAsync(JobDto dto)
        {
            if (dto == null)
            {
                return new ApiResponse<bool>(false, "Invalid job data", false);
            }
            var job = new AddressBook.Domain.Entities.Job
            {
                Name = dto.Name,
            };
            await _jobRepository.AddAsync(job);
            return new ApiResponse<bool>(true, "Job added successfully", true);

        }
        public async Task<ApiResponse<bool>> UpdateAsync(int id, JobDto dto)
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
