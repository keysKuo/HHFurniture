const PORT = process.env.PORT || 3000;
const db = require('./config/database');
const router = require('./resources/routes');

const app = require('./config/server').init();

db.connect();

router(app);

app.get('/home', (req, res, next) => {
    res.render('pages/home/home');
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
