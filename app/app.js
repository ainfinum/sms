const express = require('express');
const app = express();
const SMSController = require('./sms/SMSController');
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile( __dirname + "/" + "index.htm" ));

app.use('/api/sms-promotion', SMSController);
 
app.listen(port, () =>
  console.log('Server is up')
);