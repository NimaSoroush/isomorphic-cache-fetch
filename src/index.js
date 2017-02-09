"use strict";

import fetch from "isomorphic-fetch";

import nodeCache from "node-cache";

let cache = new nodeCache();

let fetchThru = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then((response) => {response.json()
                .then((body) => {
                    cache.set(url, body);
                    resolve(body);
                })
                .catch((error) => {
                    reject(error);
                });
            }).catch((error) => {
            reject(error);
        });
    })
};

let cacheFetch = (url, readThru) => {
    if (readThru) {
        return fetchThru(url);
    }

    return new Promise((resolve, reject) => {
        cache.get(url, (err, value) => {
            if (err || value == undefined) {
                fetchThru(url)
                    .then((response) => { resolve(response); })
                    .catch((error) => { reject(error); });
            } else {
                resolve(value);
            }
        });
    });
};

exports.fetch = cacheFetch;

