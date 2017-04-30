import 'core-js/es6/promise';
import 'whatwg-fetch';
import buildUrl from 'build-url';

const userAvatarId = 'user-avatar';
const viewModel = {};

fetch('https://api.github.com/users/maxnetish', {
    method: 'GET',
    body: null,
    headers: {},
    credentials: 'omit' // or same-origin or include
})
    .then(function (userResponse) {
        return userResponse.json();
    })
    .then(function (userParsedResponse) {
        viewModel.user = userParsedResponse;
        let nextUri = buildUrl(userParsedResponse.repos_url, {
            queryParams: {
                page: 1,
                per_page: 5,
                type: 'all',
                sort: 'pushed'
            }
        });
        return fetch(nextUri, {
            method: 'GET',
            body: null,
            headers: {},
            credentials: 'omit' // or same-origin or include
        });
    })
    .then(function (reposResponse) {
        return reposResponse.json();
    })
    .then(function (reposParsedResonse) {
        viewModel.repos = reposParsedResonse;
        return viewModel
    })
    .then(function (viewModelReposnse) {
        let html = cardTemplate(viewModelReposnse);
        let elm = document.getElementById('github-card');
        elm.innerHTML = html;
        return viewModelReposnse;
    })
    .catch(function (err) {
        console.warn(err);
    });
