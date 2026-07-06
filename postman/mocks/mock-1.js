const http = require('http');
const url = require('url');

const SEED_MATTERS = {
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

const STATE_KEY = 'leap-matters:matters';

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  let matters = await pm.state.get(STATE_KEY);
  if (!matters) {
    matters = { ...SEED_MATTERS };
    await pm.state.set(STATE_KEY, matters);
  }

  // @endpoint GET /matters/:matterId
  const matterMatch = pathname.match(/^\/matters\/([^/]+)$/);
  if (method === 'GET' && matterMatch) {
    const matterId = decodeURIComponent(matterMatch[1]);

    const authHeader = req.headers['authorization'] || '';
    if (!authHeader.startsWith('Bearer ')) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ code: 401, message: 'Unauthorised. A valid Bearer token is required.' }));
      return;
    }

    const matter = matters[matterId];
    if (!matter) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ code: 404, message: `Matter ${matterId} was not found.` }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(matter));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ code: 404, message: 'Route not found.' }));
});

server.listen(process.env.PORT || 3000, () => {
  console.log('leap-matters mock server running on port ' + (process.env.PORT || 3000));
});
