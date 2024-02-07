require('dotenv').config(); //.env
const { app } = require('./middleware');
const routes = require('./routes');
const PORT = process.env.PORT ;
const HOST =  process.env.HOST ; // Your local IP address
// Use the routes defined in the "routes.js" file
app.use('/', routes);

app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
  console.log(`Swagger is running on ${HOST}:${PORT}/api-docs`);
});
