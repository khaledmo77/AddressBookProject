using AddressBook.BLL.Interfaces;
using AddressBook.Common.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace AddressBook.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AddressBookEntryController : ControllerBase
    {
        private readonly IAddressBookEntryService _addressBookEntryService;
        private readonly IJobService _jobService;
        private readonly IDepartmentService _departmentService;
        private readonly IMapper _mapper;
        public AddressBookEntryController(IAddressBookEntryService addressBookEntryService, IJobService jobService, IDepartmentService departmentService,IMapper mapper)
        {
            _addressBookEntryService = addressBookEntryService;
            _jobService = jobService;
            _departmentService = departmentService;
            _mapper = mapper;
        }
        //tested and working fine
        [HttpGet("GetAllEntries")]
        public async Task<IActionResult> GetAllEntries()
        {
            var response = await _addressBookEntryService.GetAllAsync();
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }
        //tested and working fine
        [HttpGet("GetEntryById/{id}")]
        public async Task<IActionResult> GetEntryById(int id)
        {
            var response = await _addressBookEntryService.GetByIdAsync(id);
            if (response.Success)
            {
                return Ok(response);
            }
            return NotFound(response);
        }
        [HttpGet("formdata")]
        public async Task<IActionResult> GetFormData()
        {
            var jobs = await _jobService.GetAllAsync();
            var departments = await _departmentService.GetAllDepartmentsAsync();

            var response = new
            {
                Jobs = jobs,
                Departments = departments

            };

            return Ok(response);
        }

     //Done    //tested and working fine but need to check for photo upload and response unnessary data also i need to display list of jobs and departments in the frontend
        [HttpPost("AddEntry")]
        public async Task<IActionResult> AddEntry([FromForm] CreateAddressBookDto dto)
        {
            var response = await _addressBookEntryService.AddAsync(dto);
            if (response.Success)
            {
                return CreatedAtAction(nameof(GetEntryById), new { id = response.Data?.Id }, response);
            }
            return BadRequest(response);
        }
        [HttpPut("UpdateEntry/{id}")]
        public async Task<IActionResult> UpdateEntry(int id, [FromForm] AddressBookEntryDto dto)
        {
            var response = await _addressBookEntryService.UpdateAsync(id, dto);
            if (response.Success)
            {
                return Ok(response);
            }
            return NotFound(response);
        }
        [HttpDelete("DeleteEntry/{id}")]
        public async Task<IActionResult> DeleteEntry(int id)
        {
            var response = await _addressBookEntryService.DeleteAsync(id);
            if (response.Success)
            {
                return Ok(response);
            }
            return NotFound(response);
        }
        [HttpPost("SearchEntries")]
        public async Task<IActionResult> SearchEntries([FromBody] SearchAddressBookDto dto)
        {
            var response = await _addressBookEntryService.SearchAsync(dto);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }
        [HttpGet("ExportToExcel")]
        public async Task<IActionResult> ExportToExcel()
        {
            var fileContent = await _addressBookEntryService.ExportToExcelAsync();
            if (fileContent != null && fileContent.Length > 0)
            {
                return File(fileContent, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "AddressBookEntries.xlsx");
            }
            return NotFound("No data to export.");
        }


    }
}
