/**
 * Setup express
 */
const path = require('path'),
    express = require('express'),
    responseTime = require('response-time'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    serveStatic = require('serve-static'),
    Poet = require('poet');

const app = express();

const poet = Poet(app, {
    postsPerPage: 3,
    posts: '../../_posts',
    metaFormat: 'json',
    routes: {
        '/:post': 'post',
        '/:page': 'page',
        '/tag/:tag': 'tag',
        '/cat/:category': 'category'
    }
});

// to properly work behind nginx
app.set("trust proxy", true);
// app.use(favicon(path.join(__dirname, 'pub/favicon.ico')));
app.use(responseTime());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'pug');
app.set('views', '../views');

/**
 * assets will be in build/assets, virtual path will be '/assets/bla-bla.js'
 */
app.use('/assets', serveStatic('../assets', {
    index: false
}));

/**
 * Main entry
 */
app.get(['/'], (req, res) => {

    let pp = poet;

    res.render('index');
});

/**
 * Setup poet
 */
poet.init().then(() => {
    console.info('Poet up');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    let status = typeof err === 'number' ? err : 500;
    res.status(status).send('Internal error');
});

/**
 * begin listen port
 */
let portToListen = process.env.PORT || 3000;
app.listen(portToListen, function () {
    console.info(`${app.name} started and listening on port ${portToListen}`);
});