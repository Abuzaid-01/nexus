using CrudApp.API.Data;
using CrudApp.API.Models;
using CrudApp.API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CrudApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RecordsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RecordsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Records
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecordResponse>>> GetRecords()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var records = await _context.Records
                .Where(r => r.CreatedByUserId == userId.Value)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new RecordResponse
                {
                    Id = r.Id,
                    Name = r.Name,
                    Email = r.Email,
                    Mobile = r.Mobile,
                    Address = r.Address,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                })
                .ToListAsync();

            return Ok(records);
        }

        // GET: api/Records/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RecordResponse>> GetRecord(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var record = await _context.Records
                .Where(r => r.Id == id && r.CreatedByUserId == userId.Value)
                .FirstOrDefaultAsync();

            if (record == null)
            {
                return NotFound();
            }

            var response = new RecordResponse
            {
                Id = record.Id,
                Name = record.Name,
                Email = record.Email,
                Mobile = record.Mobile,
                Address = record.Address,
                CreatedAt = record.CreatedAt,
                UpdatedAt = record.UpdatedAt
            };

            return Ok(response);
        }

        // POST: api/Records
        [HttpPost]
        public async Task<ActionResult<RecordResponse>> CreateRecord([FromBody] RecordDto recordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var record = new Record
            {
                Name = recordDto.Name,
                Email = recordDto.Email,
                Mobile = recordDto.Mobile,
                Address = recordDto.Address,
                CreatedByUserId = userId.Value,
                CreatedAt = DateTime.UtcNow
            };

            _context.Records.Add(record);
            await _context.SaveChangesAsync();

            var response = new RecordResponse
            {
                Id = record.Id,
                Name = record.Name,
                Email = record.Email,
                Mobile = record.Mobile,
                Address = record.Address,
                CreatedAt = record.CreatedAt,
                UpdatedAt = record.UpdatedAt
            };

            return CreatedAtAction(nameof(GetRecord), new { id = record.Id }, response);
        }

        // PUT: api/Records/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRecord(int id, [FromBody] RecordDto recordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var record = await _context.Records
                .Where(r => r.Id == id && r.CreatedByUserId == userId.Value)
                .FirstOrDefaultAsync();

            if (record == null)
            {
                return NotFound();
            }

            record.Name = recordDto.Name;
            record.Email = recordDto.Email;
            record.Mobile = recordDto.Mobile;
            record.Address = recordDto.Address;
            record.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Records/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecord(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var record = await _context.Records
                .Where(r => r.Id == id && r.CreatedByUserId == userId.Value)
                .FirstOrDefaultAsync();

            if (record == null)
            {
                return NotFound();
            }

            _context.Records.Remove(record);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }
            return null;
        }
    }
}
