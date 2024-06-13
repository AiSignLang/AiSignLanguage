using Microsoft.EntityFrameworkCore;
using OAuthAPI.Model;

namespace OAuthAPI;

public sealed class  DataContext : DbContext
{
    private readonly string _dbPath;
    public DataContext()
    {
        var rootDir = Directory.GetCurrentDirectory();
        var databaseName = Path.Combine(rootDir, "Data/db.sqlite3");
        _dbPath = databaseName;
    }
    public DbSet<Account> Accounts { get; init; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Account>().ToTable("Accounts");
        modelBuilder.Entity<Account>().HasKey(u => u.Id);
        modelBuilder.Entity<Account>()
            .HasIndex(u => u.Username)
            .IsUnique();
        modelBuilder.Entity<Account>()
            .HasIndex(u => u.Email)
            .IsUnique();
        modelBuilder.Entity<Account>()
            .Property(u => u.Username)
            .IsRequired();
        modelBuilder.Entity<Account>()
        .Property(u => u.Password)
                    .IsRequired();
        
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.UseSqlite($"Data Source={_dbPath}", options => options.MigrationsAssembly("OAuthAPI"));
    }
}