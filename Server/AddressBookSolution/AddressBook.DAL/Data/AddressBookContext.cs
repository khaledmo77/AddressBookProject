using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AddressBook.Domain.Entities;
using AddressBook.Domain.DAL;
using Microsoft.AspNetCore.Identity;
namespace AddressBook.DAL.Data
{
    public class AddressBookContext: IdentityDbContext<IdentityUser>  
    {
        public AddressBookContext(DbContextOptions<AddressBookContext> options):base(options) { }
        public DbSet<AddressBookEntry> addressBooks { get; set; }
        public DbSet<Department> departments { get; set; }
        public  DbSet<Job> jobs { get; set; }
 
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AddressBookEntry>()
                .HasOne(a => a.Job)
                .WithMany(a => a.AddressBookEntries)
                .HasForeignKey(a => a.JobId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<AddressBookEntry>()
                .HasOne(a=>a.Department)
                .WithMany(a=>a.AddressBookEntries)
                .HasForeignKey(a=>a.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);
           

            base.OnModelCreating(modelBuilder);


        }
    }
}
