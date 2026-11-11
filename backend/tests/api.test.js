const assert = require('assert');
const http = require('http');
const mongoose = require('mongoose');
const app = require('../server');
const Task = require('../models/Task');
const connectDB = require('../config/db');

let server;
let baseUrl;

// Helper to make HTTP requests
const request = ({ method, path, body, headers = {} }) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = rawData ? JSON.parse(rawData) : null;
        } catch (e) {
          parsed = rawData;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: parsed
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- Starting Backend API Test Suite ---\n');
  process.env.NODE_ENV = 'test';
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27018/todo_test_db';

  await connectDB();

  // Clean test collection
  await Task.deleteMany({});

  // Start HTTP server on random free port
  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      console.log(`Test server running at ${baseUrl}`);
      resolve();
    });
  });

  let createdTaskId1 = null;
  let createdTaskId2 = null;

  try {
    // 1. Health check
    console.log('Testing GET /api/health...');
    const healthRes = await request({ method: 'GET', path: '/api/health' });
    assert.strictEqual(healthRes.status, 200);
    assert.strictEqual(healthRes.body.status, 'ok');
    console.log('✓ Health check passed');

    // 2. POST /api/tasks - Create valid task 1
    console.log('\nTesting POST /api/tasks (Create Task 1)...');
    const task1Payload = {
      title: 'Design UI Mockups',
      description: 'Create mobile screens in Figma for assignment',
      date: '2026-10-14', // Wednesday of Week Oct 12 - Oct 18
      time: '14:30',
      priority: 'High',
      status: 'In Progress'
    };
    const createRes1 = await request({ method: 'POST', path: '/api/tasks', body: task1Payload });
    assert.strictEqual(createRes1.status, 201);
    assert.strictEqual(createRes1.body.success, true);
    assert.strictEqual(createRes1.body.data.title, 'Design UI Mockups');
    assert.strictEqual(createRes1.body.data.priority, 'High');
    assert.strictEqual(createRes1.body.data.status, 'In Progress');
    createdTaskId1 = createRes1.body.data._id;
    console.log(`✓ Task 1 created with ID: ${createdTaskId1}`);

    // 3. POST /api/tasks - Create valid task 2 in same week
    console.log('\nTesting POST /api/tasks (Create Task 2 in same week)...');
    const task2Payload = {
      title: 'Setup MongoDB Backend',
      description: 'Configure Express routes and mongoose schema',
      date: '2026-10-16', // Friday of Week Oct 12 - Oct 18
      time: '18:00',
      priority: 'Medium',
      status: 'Completed'
    };
    const createRes2 = await request({ method: 'POST', path: '/api/tasks', body: task2Payload });
    assert.strictEqual(createRes2.status, 201);
    assert.strictEqual(createRes2.body.data.status, 'Completed');
    createdTaskId2 = createRes2.body.data._id;
    console.log(`✓ Task 2 created with ID: ${createdTaskId2}`);

    // 4. POST /api/tasks - Create valid task 3 in next week
    console.log('\nTesting POST /api/tasks (Create Task 3 in next week)...');
    const task3Payload = {
      title: 'Deploy Full Stack App',
      description: 'Verify production build and responsive layout',
      date: '2026-10-21', // Wednesday of Week Oct 19 - Oct 25
      time: '11:00',
      priority: 'Low',
      status: 'In Progress'
    };
    const createRes3 = await request({ method: 'POST', path: '/api/tasks', body: task3Payload });
    assert.strictEqual(createRes3.status, 201);
    console.log(`✓ Task 3 created with ID: ${createRes3.body.data._id}`);

    // 5. POST /api/tasks - Validation error (missing title)
    console.log('\nTesting POST /api/tasks validation (missing title)...');
    const badRes1 = await request({ method: 'POST', path: '/api/tasks', body: { date: '2026-10-14' } });
    assert.strictEqual(badRes1.status, 400);
    assert.strictEqual(badRes1.body.success, false);
    console.log('✓ Validation caught missing title correctly');

    // 6. POST /api/tasks - Validation error (invalid date format)
    console.log('\nTesting POST /api/tasks validation (invalid date format)...');
    const badRes2 = await request({ method: 'POST', path: '/api/tasks', body: { title: 'Test', date: 'invalid-date', time: '12:00' } });
    assert.strictEqual(badRes2.status, 400);
    console.log('✓ Validation caught invalid date format');

    // 6b. POST /api/tasks - Validation error (missing time)
    console.log('\nTesting POST /api/tasks validation (missing time)...');
    const badRes3 = await request({ method: 'POST', path: '/api/tasks', body: { title: 'Test', date: '2026-10-14' } });
    assert.strictEqual(badRes3.status, 400);
    console.log('✓ Validation caught missing time');

    // 7. GET /api/tasks - Get all tasks
    console.log('\nTesting GET /api/tasks...');
    const getAllRes = await request({ method: 'GET', path: '/api/tasks' });
    assert.strictEqual(getAllRes.status, 200);
    assert.strictEqual(getAllRes.body.count, 3);
    assert.strictEqual(getAllRes.body.data.length, 3);
    console.log('✓ Fetched all 3 tasks');

    // 8. GET /api/tasks with status filter
    console.log('\nTesting GET /api/tasks?status=Completed...');
    const filterRes = await request({ method: 'GET', path: '/api/tasks?status=Completed' });
    assert.strictEqual(filterRes.status, 200);
    assert.strictEqual(filterRes.body.count, 1);
    assert.strictEqual(filterRes.body.data[0].title, 'Setup MongoDB Backend');
    console.log('✓ Status filter returned matching completed task');

    // 9. GET /api/tasks/:id - Single task
    console.log(`\nTesting GET /api/tasks/${createdTaskId1}...`);
    const getSingleRes = await request({ method: 'GET', path: `/api/tasks/${createdTaskId1}` });
    assert.strictEqual(getSingleRes.status, 200);
    assert.strictEqual(getSingleRes.body.data.title, 'Design UI Mockups');
    console.log('✓ Fetched single task by ID');

    // 10. GET /api/tasks/:id - Non-existent ID (404)
    console.log('\nTesting GET /api/tasks/:id with non-existent ID (404)...');
    const nonExistentId = new mongoose.Types.ObjectId();
    const notFoundRes = await request({ method: 'GET', path: `/api/tasks/${nonExistentId}` });
    assert.strictEqual(notFoundRes.status, 404);
    console.log('✓ Handled non-existent ID with 404');

    // 11. PUT /api/tasks/:id - Update task details
    console.log(`\nTesting PUT /api/tasks/${createdTaskId1}...`);
    const updatePayload = {
      title: 'Design UI Mockups - Updated',
      priority: 'Medium',
      description: 'Updated description for Figma UI'
    };
    const updateRes = await request({ method: 'PUT', path: `/api/tasks/${createdTaskId1}`, body: updatePayload });
    assert.strictEqual(updateRes.status, 200);
    assert.strictEqual(updateRes.body.data.title, 'Design UI Mockups - Updated');
    assert.strictEqual(updateRes.body.data.priority, 'Medium');
    assert.strictEqual(updateRes.body.data.description, 'Updated description for Figma UI');
    console.log('✓ Task details updated successfully');

    // 12. PATCH /api/tasks/:id/status - Toggle status
    console.log(`\nTesting PATCH /api/tasks/${createdTaskId1}/status (Toggle from In Progress to Completed)...`);
    const patchRes1 = await request({ method: 'PATCH', path: `/api/tasks/${createdTaskId1}/status` });
    assert.strictEqual(patchRes1.status, 200);
    assert.strictEqual(patchRes1.body.data.status, 'Completed');
    console.log('✓ Status toggled to Completed');

    // Toggle back to In Progress
    const patchRes2 = await request({ method: 'PATCH', path: `/api/tasks/${createdTaskId1}/status` });
    assert.strictEqual(patchRes2.status, 200);
    assert.strictEqual(patchRes2.body.data.status, 'In Progress');
    console.log('✓ Status toggled back to In Progress');

    // Explicit status update
    const patchRes3 = await request({
      method: 'PATCH',
      path: `/api/tasks/${createdTaskId1}/status`,
      body: { status: 'Completed' }
    });
    assert.strictEqual(patchRes3.status, 200);
    assert.strictEqual(patchRes3.body.data.status, 'Completed');
    console.log('✓ Explicit status update succeeded');

    // 13. GET /api/tasks/search - Search by title
    console.log('\nTesting GET /api/tasks/search?q=Setup...');
    const searchRes1 = await request({ method: 'GET', path: '/api/tasks/search?q=Setup' });
    assert.strictEqual(searchRes1.status, 200);
    assert.strictEqual(searchRes1.body.count, 1);
    assert.strictEqual(searchRes1.body.data[0].title, 'Setup MongoDB Backend');
    console.log('✓ Search by title succeeded');

    // Search by description (case-insensitive)
    console.log('\nTesting GET /api/tasks/search?q=figma...');
    const searchRes2 = await request({ method: 'GET', path: '/api/tasks/search?q=figma' });
    assert.strictEqual(searchRes2.status, 200);
    assert.strictEqual(searchRes2.body.count, 1);
    assert.strictEqual(searchRes2.body.data[0]._id, createdTaskId1);
    console.log('✓ Case-insensitive search by description succeeded');

    // 14. GET /api/tasks/weekly-summary
    console.log('\nTesting GET /api/tasks/weekly-summary (Grouping by Monday-to-Sunday)...');
    const weeklyRes = await request({ method: 'GET', path: '/api/tasks/weekly-summary' });
    assert.strictEqual(weeklyRes.status, 200);
    assert.strictEqual(weeklyRes.body.count, 2); // 2 distinct weeks: Oct 12-18 and Oct 19-25

    const week1 = weeklyRes.body.data[0];
    assert.strictEqual(week1.weekStart, '2026-10-12'); // Monday
    assert.strictEqual(week1.weekEnd, '2026-10-18');   // Sunday
    assert.strictEqual(week1.totalTasks, 2);
    assert.strictEqual(week1.completedCount, 2); // Task 1 completed, Task 2 completed
    assert.strictEqual(week1.openCount, 0);

    const week2 = weeklyRes.body.data[1];
    assert.strictEqual(week2.weekStart, '2026-10-19'); // Monday
    assert.strictEqual(week2.weekEnd, '2026-10-25');   // Sunday
    assert.strictEqual(week2.totalTasks, 1);
    assert.strictEqual(week2.completedCount, 0);
    assert.strictEqual(week2.openCount, 1);
    console.log('✓ Weekly summary correctly grouped tasks and calculated Open & Completed metrics');

    // 15. DELETE /api/tasks/:id
    console.log(`\nTesting DELETE /api/tasks/${createdTaskId1}...`);
    const deleteRes = await request({ method: 'DELETE', path: `/api/tasks/${createdTaskId1}` });
    assert.strictEqual(deleteRes.status, 200);
    assert.strictEqual(deleteRes.body.success, true);
    console.log('✓ Task deleted successfully');

    // Verify task no longer exists
    const verifyNotFound = await request({ method: 'GET', path: `/api/tasks/${createdTaskId1}` });
    assert.strictEqual(verifyNotFound.status, 404);
    console.log('✓ Verified task is deleted (404)');

    console.log('\n=========================================');
    console.log('🎉 ALL BACKEND API TESTS PASSED SUCCESSFULLY!');
    console.log('=========================================\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
    await mongoose.connection.close();
  }
};

runTests();
