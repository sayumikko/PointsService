using Microsoft.EntityFrameworkCore;
using PointsService.Models;

namespace PointsService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Point> Points { get; set; }
        public DbSet<Comment> Comments { get; set; }
    }
}
