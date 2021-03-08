const express = require('express');
const path = require('path');
const apiRoutes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/notes', express.static(path.join(__dirname, 'public/notes.html')));

app.use(apiRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});