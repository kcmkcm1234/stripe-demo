import axios from "axios";

const API_URL = "https://dev-api.gyfted.io"

const getProductDetails = id => {
    return axios.get(API_URL + "/catalog/products/" + id)
        .then(res => {
            if (res.status === 200) {
                return res.data;
            } else {
                return null;
            }
        })
        .then(data => {
            if (!data || data.error) {
                console.error("API error:", { data });
                throw Error("API Error");
            } else {
                return data;
            }
        });
};

const getProducts = () => {
    console.log('retriving products from API');
    return axios.get(API_URL + "/catalog/products")
        .then(res => {
            if (res.status === 200) {
                return res.data.content;
            } else {
                return null;
            }
        })
        .then(data => {
            if (!data || data.error) {
                console.error("API error:", { data });
                throw Error("API Error");
            } else {
                return data;
            }
        });
};


const api = {
    getProductDetails: getProductDetails,
    geProducts: getProducts
};

export default api;