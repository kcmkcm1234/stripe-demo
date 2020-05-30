import { useState } from "react";
import Link from "next/link";

const Product = (props) => {
    const [product, setProduct] = useState(props.data);

    return (
        <div className="card text-centered" style={{ width: "18rem" }}>
            <img src={product.image} className="card-img-top" alt="..." />
            <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{product.price} {product.currency}</h6>
                <p className="card-text">{product.description.length > 140 ? product.description.substring(0, 140) + "..." : product.description}</p>
                <Link href={{ pathname: "/details", query: { product: product.id } }}><a className="btn btn-primary">Check details</a></Link>
            </div>
        </div>
    );
};

export default Product;