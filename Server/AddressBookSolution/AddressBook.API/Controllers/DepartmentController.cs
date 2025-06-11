using AddressBook.BLL.Interfaces;
using AddressBook.Common.DTOs;
using AddressBook.Common.Response;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AddressBook.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;
        public DepartmentController(IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        [HttpGet("GetAllDepartments")]
        public async Task<IActionResult> GetAllDepartments()
        {
            var response = await _departmentService.GetAllDepartmentsAsync();
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDepartmentById(int id)
        {
            var response = await _departmentService.GetDepartmentByIdAsync(id);
            if (response.Success)
            {
                return Ok(response);
            }
            return NotFound(response);
        }
        [HttpPost("AddDepartment")]
        public async Task<IActionResult> AddDepartment([FromBody] CreateDepartmentDto dto)
        {
            if (dto == null)
            {
                return BadRequest(new ApiResponse<CreateDepartmentDto>(false, "Invalid department data."));
            }

            var response = await _departmentService.AddDepartmentAsync(dto);

            if (response.Success && response.Data != null)
            {
                return CreatedAtAction(
                    nameof(GetDepartmentById),
                    new { id = response.Data.Id },  // Make sure this matches the GetDepartmentById route
                    new ApiResponse<DepartmentDto>(true, "Department added", response.Data)
                );
            }

            return BadRequest(response);
        }


        [HttpPut("UpdateDepartment/{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, [FromBody] UpdateDepartmentDto dto)
        {
            if (dto == null || id <= 0)
            {
                return BadRequest(new ApiResponse<UpdateDepartmentDto>(false, "Invalid department data."));
            }

            var response = await _departmentService.UpdateDepartmentAsync(id, dto);
            if (response.Success)
            {
                return Ok(response);
            }
            return NotFound(response);
        }

        [HttpDelete("DeleteDepartment/{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new ApiResponse<bool>(false, "Invalid department ID."));
            }

            var response = await _departmentService.DeleteDepartmentAsync(id);
            if (response.Success)
            {
                return Ok(response);
            }
            return NotFound(response);
        }
    
    }
}
