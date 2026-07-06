const express = require('express');
const app = express();
const PORT = 7331;

app.use(express.json());

// --- In-memory matters data store ---
const matters = {
  'MTR-00123': {
    matterId: 'MTR-00123',
    matterType: 'Conveyancing',
    status: 'Open',
    clientName: 'Jane Smith',
    assignedLawyer: 'Robert Hughes',
    createdAt: '2026-03-15T09:00:00Z',
  },
  'MTR-00456': {
    matterId: 'MTR-00456',
    matterType: 'Family',
    status: 'Pending',
    clientName: 'Michael Torres',
    assignedLawyer: 'Sarah Lawson',
    createdAt: '2026-04-10T11:30:00Z',
  },
  'MTR-00789': {
    matterId: 'MTR-00789',
    matterType: 'Commercial',
    status: 'Closed',
    clientName: 'Apex Corp Ltd',
    assignedLawyer: 'David Chen',
    createdAt: '2025-11-20T08:00:00Z',
  },
};

// --- Auth middleware ---
function requireBearerToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 401,
      message: 'Unauthorised. A valid Bearer token is required.',
    });
  }
  next();
}

// --- GET /matters/:matterId ---
// Retrieves the full details of a legal matter identified by its unique matter ID.
// Supports all matter types: Conveyancing, Family, Commercial, Criminal, Other.
app.get('/matters/:matterId', requireBearerToken, (req, res) => {
  try {
    const { matterId } = req.params;
    const matter = matters[matterId];

    if (!matter) {
      return res.status(404).json({
        code: 404,
        message: `Matter ${matterId} was not found.`,
      });
    }

    return res.status(200).json(matter);
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({
      code: 500,
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Leap Matters API server running on http://localhost:${PORT}`);
  console.log(`  GET http://localhost:${PORT}/matters/:matterId`);
  console.log(`\nSample matter IDs: MTR-00123, MTR-00456, MTR-00789`);
});
