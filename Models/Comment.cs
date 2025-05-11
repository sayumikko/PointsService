using System.Text.Json.Serialization;

namespace PointsService.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string BackgroundColor { get; set; }

        public int PointId { get; set; }
    }
}