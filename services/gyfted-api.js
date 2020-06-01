import axios from "axios";
const url = process.env.API_URL;
class GyftedApi {

    api_base = process.env.API_URL || 'https://dev-api.gyfted.io';

    instance() {
        console.log(url);
        console.log(process.env)
        return new GyftedApi();
    }

    async getProductDetails(id) {

        return axios.get(this.api_base + "/catalog/products/" + id)
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

    async getProducts() {
        console.log('retriving products from API');
        return axios.get(this.api_base + "/catalog/products")

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

    async search(filter) {
        return axios.get(`${this.api_base}/search?query=${filter.query}&size=${filter.size}&page=${filter.page}&filters=location:${filter.location}`)
            .then(res => {
                if (res.status === 200) {
                    return {
                        data: res.data.content,
                        total: res.data.totalElements,
                        hasNext: !res.data.last
                    };
                } else {
                    return null;
                }
            })
            .then(data => {
                if (!data) {
                    throw Error("API Error");
                }
                return data;
            });
    };

    async getCart(user) {
        return axios.get(`${this.api_base}/checkout/carts/${user}`)
            .then(res => {
                if (res.status === 200) {
                    return res.data;
                } else {
                    return null;
                }
            })
            .then(data => {
                if (!data) {
                    throw Error("API Error");
                }
                return data;
            });
    };

    async addToCart(item) {
        console.log(item);
        return axios.post(`${this.api_base}/checkout/carts/${item.user}/items`, { item: item.product, qty: item.qty })
            .then(res => {
                if (res.status === 200) {
                    return res.data;
                } else {
                    return null;
                }
            })
            .then(data => {
                if (!data) {
                    throw Error("API Error");
                }
                return data;
            });
    };
}

export default new GyftedApi();