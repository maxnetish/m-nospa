/**
 * Setup express
 */
const path = require('path'),
    express = require('express'),
    responseTime = require('response-time'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    serveStatic = require('serve-static'),
    Poet = require('poet'),
    emojiFavicon = require('emoji-favicon')
;

const app = express();

// to properly work behind nginx
app.set("trust proxy", true);
app.use(emojiFavicon('large_orange_diamond'));
app.use(responseTime());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'pug');
app.set('views', '../views');

const poet = Poet(app, {
    postsPerPage: 5,
    posts: '../../_posts',
    metaFormat: 'json',
    routes: {
        '/post/:post': 'post',
        '/:page': 'page',
        '/tag/:tag': 'tag',
        '/cat/:category': 'category'
    },
    readMoreLink: post => `<p class="poet-read-more"><a href="${post.url}" title="Read more of ${post.title}">Читать всё</a></p>`
});

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

    res.redirect('/1');

    // res.render('index');
});

/**
 * Setup poet
 */
poet.init()
    .then(() => console.info('Poet up'), err => console.warn(err));

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