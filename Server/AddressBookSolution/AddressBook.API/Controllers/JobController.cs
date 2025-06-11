using AddressBook.BLL.Interfaces;
using AddressBook.Common.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AddressBook.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobController : ControllerBase
    {
        private readonly IJobService _jobService;
        public JobController(IJobService jobService)
        {
            _jobService = jobService;
        }
        [HttpGet("GetAllJobs")]
        public async Task<IActionResult> GetAllJobs()
        {
            var response = await _jobService.GetAllAsync();
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }
        [HttpGet("GetJobById/{id}")]
        public async Task<IActionResult> GetJobById(int id)
        {
            var response = await _jobService.GetByIdAsync(id);
            if (response.Success)
            {
                return Ok(response);
            }
            return NotFound(response);
        }
        [HttpPost("AddJob")]
        public async Task<IActionResult> AddJob([FromBody] CreateJobDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid job data.");
            }
            var response = await _jobService.AddAsync(dto);
            if (response.Success)
            {
                return CreatedAtAction(nameof(GetJobById), new { id = response.Data?.Id }, response);
            }
            return BadRequest(response);
        }
        [HttpPut("UpdateJob/{id}")]
        public async Task<IActionResult> UpdateJob(int id, [FromBody] UpdateJobDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid job data.");
            }
            var response = await _jobService.UpdateAsync(id, dto);
            if (response.Success)
            {
                return NoContent();
            }
            return BadRequest(response);
        }
        [HttpDelete("DeleteJob/{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var response = await _jobService.DeleteAsync(id);
            if (response.Success)
            {
                return NoContent();
            }
            return NotFound(response);
        }

    }
}
