using AddressBook.Common.DTOs;
using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace AddressBook.Common.Helpers
{
    public static class ExcelExportHelper
    {
        public static byte[] ExportAddressBookToExcel(IEnumerable<AddressBookEntryDto> entries) // ✅ Correct class name
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("AddressBook");

            // Header
            worksheet.Cell(1, 1).Value = "Full Name";
            worksheet.Cell(1, 2).Value = "Job Title";
            worksheet.Cell(1, 3).Value = "Department";
            worksheet.Cell(1, 4).Value = "Mobile";
            worksheet.Cell(1, 5).Value = "Date of Birth";
            worksheet.Cell(1, 6).Value = "Address";
            worksheet.Cell(1, 7).Value = "Email";
            worksheet.Cell(1, 8).Value = "Age";

            int row = 2;
            foreach (var entry in entries)
            {
                worksheet.Cell(row, 1).Value = entry.FullName;
                worksheet.Cell(row, 2).Value = entry.Job.Name;
                worksheet.Cell(row, 3).Value = entry.Department.Name;
                worksheet.Cell(row, 4).Value = entry.MobileNumber;
                worksheet.Cell(row, 5).Value = entry.DateOfBirth;
                worksheet.Cell(row, 6).Value = entry.Address;
                worksheet.Cell(row, 7).Value = entry.Email;
                worksheet.Cell(row, 8).Value = entry.Age;
                row++;
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }
    }
}
