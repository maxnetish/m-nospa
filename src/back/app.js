/**
 * Setup express
 */
const path = require('path'),
    express = require('express'),
    responseTime = require('response-time'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    serveStatic = require('serve-static'),
    emojiFavicon = require('emoji-favicon'),
    requestLanguage = require('express-request-language'),
    poetCustoms = require('./poet-customs')
;

const app = express();

// to properly work behind nginx
app.set("trust proxy", true);
app.use(emojiFavicon('large_orange_diamond'));
app.use(responseTime());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(requestLanguage({
    // supported langs
    languages: ['en', 'ru', 'en-GB'],
    // url query param
    queryName: 'locale'
}));
app.set('view engine', 'pug');
app.set('views', '../views');

/**
 * assets will be in build/assets, virtual path will be '/assets/bla-bla.js'
 */
app.use('/assets', serveStatic('../assets', {
    index: false
}));

/**
 * Setup poet router
 */
poetCustoms.setupPoet(app);

/**
 * Main entry
 */
app.get(['/'], (req, res) => {
    res.redirect('/posts/1');
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