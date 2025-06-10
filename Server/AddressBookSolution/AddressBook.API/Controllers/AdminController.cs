using AddressBook.BLL.Interfaces;
using AddressBook.Common.DTOs;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(AdminRegisterDto dto)
    {
        var result = await _adminService.RegisterAdminAsync(dto);
        return result ? Ok("Admin registered") : BadRequest("Registration failed");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(AdminLoginDto dto)
    {
        var token = await _adminService.LoginAdminAsync(dto);
        return token != null ? Ok(token) : Unauthorized("Invalid credentials");
    }
}
