using PointsService.Data;
using PointsService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace PointsService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PointsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PointsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Point>>> GetPoints()
    {
        return await _context.Points.Include(p => p.Comments).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Point>> GetPoint(int id)
    {
        var point = await _context.Points.Include(p => p.Comments).FirstOrDefaultAsync(p => p.Id == id);
        if (point == null) return NotFound();
        return point;
    }

    [HttpPost]
    public async Task<ActionResult<Point>> CreatePoint(Point point)
    {
        _context.Points.Add(point);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPoint), new { id = point.Id }, point);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePoint(int id)
    {
        var point = await _context.Points.FindAsync(id);
        if (point == null) return NotFound();

        _context.Points.Remove(point);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePoint(int id, Point updatedPoint)
    {
        if (id != updatedPoint.Id) return BadRequest();

        var existingPoint = await _context.Points.FindAsync(id);
        if (existingPoint == null) return NotFound();

        existingPoint.X = updatedPoint.X;
        existingPoint.Y = updatedPoint.Y;
        existingPoint.Radius = updatedPoint.Radius;
        existingPoint.Color = updatedPoint.Color;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("comments/{id}")]
    public async Task<IActionResult> UpdateComment(int id, Comment updatedComment)
    {
        if (id != updatedComment.Id) return BadRequest();

        var existingComment = await _context.Comments.FindAsync(id);
        if (existingComment == null) return NotFound();

        existingComment.Text = updatedComment.Text;
        existingComment.BackgroundColor = updatedComment.BackgroundColor;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("comments/{id}")]
    public async Task<IActionResult> DeleteComment(int id)
    {
        var comment = await _context.Comments.FindAsync(id);
        if (comment == null) return NotFound();

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id}/comments")]
    public async Task<ActionResult<Comment>> AddComment(int id, [FromBody] Comment comment)
    {
        var point = await _context.Points.FindAsync(id);
        if (point == null) return NotFound();

        comment.PointId = id;
        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        return Ok(comment);
    }
}
