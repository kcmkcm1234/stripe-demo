import { useState, useEffect } from "react";
import Product from "./product";
import api from "../services/api";

const ProductList = (props) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function loadData() {
            const data = await api.geProducts();
            console.log('received ' + data.length + ' products')
            setProducts(data)
        }
        loadData();
    }, []);

    return (
        <div className="row">
            <span>{products.length} products</span>
            <div className="card-columns">
                {products.map(p => <Product key={p.id} data={{
                    id: p.id,
                    image: p.assets.images[0].source,
                    name: p.name,
                    description: p.desc[0].desc,
                    price: p.price.amount,
                    currency: p.price.currency,
                }} />)}
            </div>
        </div>
    );
};

export default ProductList;