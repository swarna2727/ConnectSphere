const { query } = require('../config/db');

async function create(data) {
  const {
    name, location, capacity, facilities, accessibility,
    supportedLayouts, operatingHours, turnaroundMinutes,
  } = data;

  const { rows } = await query(
    `INSERT INTO venues (name, location, capacity, facilities, accessibility, supported_layouts, operating_hours, turnaround_minutes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      name, location, capacity,
      JSON.stringify(facilities || []),
      JSON.stringify(accessibility || []),
      JSON.stringify(supportedLayouts || []),
      JSON.stringify(operatingHours || {}),
      turnaroundMinutes || 0,
    ]
  );
  return rows[0];
}

async function findById(id) {
  const { rows } = await query('SELECT * FROM venues WHERE id = $1', [id]);
  return rows[0];
}

async function listAll() {
  const { rows } = await query('SELECT * FROM venues ORDER BY name ASC');
  return rows;
}

// TODO: real filtering logic (date/time/capacity/accessibility/layout/facilities)
// belongs here once the "Venue Search and Filtering" user story is written.
// This is a placeholder that only filters by minimum capacity so the endpoint
// is wired end-to-end and can be iterated on.
async function search({ minCapacity } = {}) {
  if (minCapacity) {
    const { rows } = await query(
      'SELECT * FROM venues WHERE capacity >= $1 AND status = $2 ORDER BY capacity ASC',
      [minCapacity, 'active']
    );
    return rows;
  }
  return listAll();
}

// TODO: "Venue Availability Calendar" — this just returns approved/pending
// bookings for a venue; doesn't yet account for maintenance blocks etc.
async function getBookingsForVenue(venueId) {
  const { rows } = await query(
    `SELECT * FROM venue_bookings WHERE venue_id = $1 AND status IN ('pending','approved')
     ORDER BY start_datetime ASC`,
    [venueId]
  );
  return rows;
}

module.exports = { create, findById, listAll, search, getBookingsForVenue };
