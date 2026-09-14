const asyncHandler = require('../utils/asyncHandler');
const venueModel = require('../models/venueModel');

// POST /api/venues  (Venue Staff maintain the catalogue)
const createVenue = asyncHandler(async (req, res) => {
  const { name, capacity } = req.body;
  if (!name || !capacity) {
    return res.status(400).json({ error: 'name and capacity are required.' });
  }
  const venue = await venueModel.create(req.body);
  res.status(201).json({ venue });
});

// GET /api/venues  — "Venue Catalogue"
const listVenues = asyncHandler(async (req, res) => {
  const venues = await venueModel.listAll();
  res.json({ venues });
});

// GET /api/venues/search?minCapacity=  — "Venue Search and Filtering"
// TODO: extend query params for date/time/accessibility/layout/facilities
// once that story is refined; see venueModel.search().
const searchVenues = asyncHandler(async (req, res) => {
  const { minCapacity } = req.query;
  const venues = await venueModel.search({
    minCapacity: minCapacity ? Number(minCapacity) : undefined,
  });
  res.json({ venues });
});

// GET /api/venues/:id
const getVenue = asyncHandler(async (req, res) => {
  const venue = await venueModel.findById(req.params.id);
  if (!venue) return res.status(404).json({ error: 'Venue not found.' });
  res.json({ venue });
});

// GET /api/venues/:id/calendar — "Venue Availability Calendar"
const getVenueCalendar = asyncHandler(async (req, res) => {
  const venue = await venueModel.findById(req.params.id);
  if (!venue) return res.status(404).json({ error: 'Venue not found.' });
  const bookings = await venueModel.getBookingsForVenue(req.params.id);
  res.json({ venue, bookings });
});

// GET /api/venues/:id/suitability?attendance=&layout=  — "Venue Suitability Checking"
// TODO: placeholder — only checks capacity vs expected attendance. Extend to
// check facilities/accessibility/layout once that story is written.
const checkSuitability = asyncHandler(async (req, res) => {
  const venue = await venueModel.findById(req.params.id);
  if (!venue) return res.status(404).json({ error: 'Venue not found.' });

  const attendance = Number(req.query.attendance || 0);
  const suitable = attendance <= venue.capacity;

  res.json({
    suitable,
    reasons: suitable ? [] : [`Expected attendance (${attendance}) exceeds venue capacity (${venue.capacity}).`],
  });
});

module.exports = { createVenue, listVenues, searchVenues, getVenue, getVenueCalendar, checkSuitability };
