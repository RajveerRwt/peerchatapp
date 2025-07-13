const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

mongoose.connect('mongodb://localhost:27017/peerchat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
