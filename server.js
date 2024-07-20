
const express = require('express');
const path = require('path');
const transcriptionRoutes = require('./routes/transcriptionRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api', transcriptionRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});