const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const vehiclesRoutes = require('./routes/pojazdy');
const insurancesRoutes = require('./routes/ubezpieczenia');
const usersRoutes = require('./routes/users');
const garageRoutes = require('./routes/warsztaty');
//const resetEmailRoutes = require('./routes/sendEmail');

app.use('/api', vehiclesRoutes);
app.use('/api', insurancesRoutes);
app.use('/api', usersRoutes);
app.use('/api', garageRoutes);
//app.use('/api', resetEmailRoutes);

app.listen(PORT, () => {
    console.log(`Serwer uruchomiony na http://localhost:${PORT}`);
});