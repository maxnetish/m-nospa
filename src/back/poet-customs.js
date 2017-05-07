const Poet = require('poet');
const moment = require('moment');

function dateToLocaleString({date, locale = 'en', momentFormat = 'LL'} = {}) {
    if (!date) {
        return null;
    }
    moment.locale(locale);
    return moment(date).format(momentFormat);
}

function customMapPost({locale = 'en'} = {}) {
    return function (post) {
        if (!post) {
            return null;
        }
        return Object.assign(post, {
            dateToDisplay: dateToLocaleString({date: post.date, locale})
        });
    };
}

exports.setupPoet = function setupPoet(expressInstance) {

    const poet = Poet(expressInstance, {
        postsPerPage: 5,
        posts: '../../_posts',
        metaFormat: 'json',
        routes: {
            '/post/:post': 'post',
            '/posts/:page': 'page',
            '/tag/:tag': 'tag',
            '/cat/:category': 'category'
        },
        readMoreLink: post => `<p class="poet-read-more"><a href="${post.url}" title="Read more of ${post.title}">Читать всё</a></p>`,
        showDrafts: false, // comment ro default (false if PRODUCTION)
        showFuture: false // comment to default (false if PRODUCTION)
    });

    poet.addRoute('/post/:post', function (req, res) {
        let locale = req.language;
        let post = customMapPost({locale})(poet.helpers.getPost(req.params.post));

        if (post) {
            res.render('post', {post});
        } else {
            res.send(404);
        }
    });

    poet.addRoute('/posts/:page', function (req, res) {
        let
            postsPerPage = poet.options.postsPerPage,
            page = parseInt(req.params.page, 10),
            lastPost = page * postsPerPage,
            posts = poet.helpers.getPosts(lastPost - postsPerPage, lastPost),
            locale = req.language;
        posts = posts || [];
        posts = posts.map(customMapPost({locale}));
        if (posts.length) {
            res.render('page', {posts, page});
        } else {
            res.send(404);
        }
    });

    poet.addRoute('/tags/:tag', function (req, res) {
        let locale = req.language;
        let tag = req.params.tag;
        let posts = poet.helpers.postsWithTag(tag);
        posts = posts || [];
        posts = posts.map(customMapPost({locale}));
        if (posts.length) {
            res.render('tag', {posts, tag});
        } else {
            res.send(404);
        }
    });

    poet.addRoute('/cat/:category', function (req, res) {
        let locale = req.language;
        let category = req.params.category;
        let posts = poet.helpers.postsWithCategory(category);
        posts = posts || [];
        posts = posts.map(customMapPost({locale}));
        if (posts.length) {
            res.render('category', {posts, category});
        } else {
            res.send(404);
        }
    });

    poet
        .watch(() => console.info('Poet reloaded'))
        .init()
        .then(() => console.info('Poet up'), err => console.warn(err));
};