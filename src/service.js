const Axios = require('axios');

const http = Axios.create({
    baseURL: "https://api.unsplash.com/search/photos?client_id=ACCESS_ID&per_page=50&query=",
    timeout: 300000,
});

// const unsplash = new Unsplash({ accessKey: "QY5l98wJh1aADPlEYenDT_4fAnLw3I1oYi381xrurr4" });





export const get = async (url) => {
    return http.get(url).then(response => {
        return response.data;
    }).catch(error => {
        console.warn(error);
        throw error;
    });
};

export const post = function (url, payload) {
    return http.post(url, payload).then(response => {
        return response.data;
    }).catch(error => {
        console.warn(error);
        throw error;
    });
};

export const put = function (url, payload) {
    return http.put(url, payload);
};

