const express = require('express');
const app = express();
const PORT = 7331; // default port

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
    matterDescription: 'Residential property purchase for Jane Smith at 14 Maple Grove, Sydney. Includes title search, contract review, and settlement coordination.',
  },
  'MTR-00456': {
    matterId: 'MTR-00456',
    matterType: 'Family',
    status: 'Pending',
    clientName: 'Michael Torres',
    assignedLawyer: 'Sarah Lawson',
    createdAt: '2026-04-10T11:30:00Z',
    matterDescription: 'Divorce proceedings for Michael Torres. Covers asset division, spousal maintenance negotiations, and parenting arrangements for two dependent children.',
  },
  'MTR-00789': {
    matterId: 'MTR-00789',
    matterType: 'Commercial',
    status: 'Closed',
    clientName: 'Apex Corp Ltd',
    assignedLawyer: 'David Chen',
    createdAt: '2025-11-20T08:00:00Z',
    matterDescription: 'Commercial lease dispute for Apex Corp Ltd regarding a retail premises in Melbourne CBD. Matter resolved via mediation with a revised lease agreement executed.',
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

/**
 * @openapi
 * /matters/{matterId}:
 *   get:
 *     summary: Get matter by ID
 *     description: >-
 *       Retrieves the full details of a legal matter identified by its unique
 *       matter ID. Supports all matter types including Conveyancing, Family,
 *       Commercial, and more.
 *     operationId: getMatterById
 *     tags:
 *       - Matters
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: matterId
 *         in: path
 *         required: true
 *         description: The unique identifier of the matter (e.g. MTR-00123).
 *         schema:
 *           $ref: '#/components/schemas/MatterId'
 *     responses:
 *       '200':
 *         description: Matter found and returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Matter'
 *             examples:
 *               conveyancing-matter:
 *                 summary: '200 — Conveyancing matter'
 *                 value:
 *                   matterId: MTR-00123
 *                   matterType: Conveyancing
 *                   status: Open
 *                   clientName: Jane Smith
 *                   assignedLawyer: Robert Hughes
 *                   createdAt: '2026-03-15T09:00:00Z'
 *                   matterDescription: 'Residential property purchase for Jane Smith at 14 Maple Grove, Sydney. Includes title search, contract review, and settlement coordination.'
 *               family-law-matter:
 *                 summary: '200 — Family law matter'
 *                 value:
 *                   matterId: MTR-00456
 *                   matterType: Family
 *                   status: Pending
 *                   clientName: Mark and Lisa Brennan
 *                   assignedLawyer: Sarah Okafor
 *                   createdAt: '2026-05-01T10:15:00Z'
 *                   matterDescription: 'Divorce proceedings for Michael Torres. Covers asset division, spousal maintenance negotiations, and parenting arrangements for two dependent children.'
 *       '401':
 *         description: Unauthorised. A valid Bearer token is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               unauthorised:
 *                 summary: '401 — Unauthorised'
 *                 value:
 *                   code: 401
 *                   message: Unauthorised. A valid Bearer token is required.
 *       '404':
 *         description: Matter not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               matter-not-found:
 *                 summary: '404 — Matter not found'
 *                 value:
 *                   code: 404
 *                   message: Matter MTR-99999 was not found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               server-error:
 *                 summary: '500 — Server error'
 *                 value:
 *                   code: 500
 *                   message: An unexpected error occurred. Please try again later.
 */
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
