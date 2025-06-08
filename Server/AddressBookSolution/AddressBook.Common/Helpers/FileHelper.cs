using Microsoft.AspNetCore.Http;

namespace AddressBook.Common.Helpers
{
    public static class FileHelper
    {
        public static string SaveFile(IFormFile file)
        {
            var wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var uploadFolder = Path.Combine(wwwRootPath, "uploads");

            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadFolder, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            file.CopyTo(stream);

            return Path.Combine("uploads", fileName).Replace("\\", "/");
        }
    }
}
