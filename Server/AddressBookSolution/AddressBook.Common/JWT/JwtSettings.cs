namespace AddressBook.API
{
    public class JwtSettings
    {
        public string Issuer { get; set; } = null!;
        public string Audience { get; set; } = null!;
        public string SecretKey { get; set; } = null!;
        public int ExpirationInMinutes { get; set; } = 60; // Default to 60 minutes
        public int RefreshTokenExpirationInDays { get; set; } = 30; // Default to 30 days
    }
}
