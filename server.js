const express = require('express');
const app = express();

const mocksRouter = require('./routes/mocks.router');

app.use('/api/mocks', mocksRouter);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
