document.addEventListener('DOMContentLoaded', function (evt) {
    'use strict';

    const INIT_FUNCTIONS = {
        'index.html': function () {
            globalNavigation.classList.remove('flat');
            globalNavigation.classList.add('circle');
        },
        '': function () {
            INIT_FUNCTIONS['index.html']();
        },
        'default': function () {
            globalNavigation.classList.add('flat');
            globalNavigation.classList.remove('circle');
        }
    };

    function runInitFunction(url) {
        let initFunctionKey = url.substring(url.lastIndexOf('/') + 1),
            initFunction = INIT_FUNCTIONS[initFunctionKey] || INIT_FUNCTIONS['default'];

        if (initFunction) {
            initFunction();
        }
    }

    let menuElements = document.body.querySelectorAll('.menu-element'),
        homeLink = document.body.querySelector('header > h1 > a'),
        globalNavigation = document.body.querySelector('nav.global-navigation'),
        mainElement = document.body.querySelector('main'),
        titleElement = document.head.querySelector('title');

    menuElements.forEach(function (element) {
        element.addEventListener('click', linkClicked);
    });
    homeLink.addEventListener('click', linkClicked);

    window.addEventListener('popstate', function (evt) {
        let request = new XMLHttpRequest(),
            url;

        try {
            url = evt.state.url
        } catch (e) {
            url = document.location.href;
        }

        request.addEventListener('load', function () {
            let response = this,
                newDocument;

            try {
                newDocument = response.responseXML.documentElement;
            } catch (e) {
                let parser = new DOMParser();

                newDocument = parser.parseFromString(
                    response.responseText, 'application/xhtml+xml'
                );
            }

            let newTitle = newDocument.querySelector('title').innerHTML;

            mainElement.innerHTML = newDocument.querySelector('main').innerHTML;
            titleElement.innerHTML = newTitle;

            runInitFunction(url);
        });
        request.open('GET', url);
        request.send();
    });

    function linkClicked(evt) {
        evt.preventDefault();

        let self = this,
            url = self.getAttribute('href'),
            request = new XMLHttpRequest();

        request.addEventListener('load', function () {
            let response = this,
                newDocument;

            try {
                newDocument = response.responseXML.documentElement;
            } catch (e) {
                let parser = new DOMParser();

                newDocument = parser.parseFromString(
                    response.responseText, 'application/xhtml+xml'
                );
            }

            let newTitle = newDocument.querySelector('title').innerHTML;

            mainElement.innerHTML = newDocument.querySelector('main').innerHTML;
            titleElement.innerHTML = newTitle;

            history.pushState({url: url}, newTitle, url);

            runInitFunction(url);
        });
        request.open('GET', url);
        request.send();

        globalNavigation.classList.add('flat');
        globalNavigation.classList.remove('circle');
    };
});
