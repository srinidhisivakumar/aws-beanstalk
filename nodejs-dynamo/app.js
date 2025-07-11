const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// AWS SDK Configuration
AWS.config.update({ region: 'us-east-2' });
const docClient = new AWS.DynamoDB.DocumentClient();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'static')));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/signup', (req, res) => {
  const { name, email, studentid } = req.body;

  const params = {
    TableName: 'beanstalkapp-table',
    Item: {
      email: email,
      name: name,
      studentid: studentid,
      timestamp: new Date().toISOString()
    }
  };

  docClient.put(params, (err) => {
    if (err) {
      console.error('DynamoDB Error:', err);
      res.status(500).send('❌ Error saving data to DynamoDB.');
    } else {
      res.send('✅ Signup saved successfully!');
    }
  });
});

// Start Server
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
