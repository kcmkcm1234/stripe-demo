import { useState } from "react";
import Link from "next/link";
import api from "../services/gyfted-api";

const Product = (props) => {
    const [product, setProduct] = useState(props.data);
    const [processing, setProcessing] = useState(false);

    const addToCart = async (evt) => {
        evt.preventDefault();
        console.log(evt)
        console.log(product)
        setProcessing(true);
        const result = await api.addToCart({
            user: 1,
            product: product.id,
            qty: 1
        });
        setProcessing(false);
    }

    const buttonContent = () => {
        return processing ? (
            <>
                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                <span className="sr-only">Loading...</span>
            </>
        ) :
            (
                <svg className="bi bi-cart-check" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M11.354 5.646a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L8 8.293l2.646-2.647a.5.5 0 0 1 .708 0z" />
                    <path fillRule="evenodd" d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                </svg>
            );
    }

    const buttonOptions = {
        background: "none",
        zIndex: 2,
        position: "relative"
    }

    return (
        <div className="col mb-4">
            <div className="card text-centered h-100" >
                <img src={product.image} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{product.price} {product.currency}</h6>
                    <p className="card-text mh-100">{product.description.length > 140 ? product.description.substring(0, 140) + "..." : product.description}</p>
                    <div className="clearfix">
                        <Link href={{ pathname: "/details", query: { product: product.id } }}><a className="text-secondary float-left stretched-link">Check details</a></Link>
                        <button onClick={addToCart} className="border border-0 text-secondary btn-link btn-light float-right" style={buttonOptions} disabled={processing}>
                            {buttonContent()}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;