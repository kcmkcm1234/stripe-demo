import { useState, useEffect } from "react";
import Product from "./product";
import GyftedApi from "../services/gyfted-api";
import SearchBar from "./searchbar";
import InfiniteScroll from "react-infinite-scroll-component";

const countries = [
    'USA', 'Spain', 'Canada', 'France'
];

const ProductList = () => {

    const [filter, setFilter] = useState({
        query: "",
        location: countries[0],
        page: 0,
        size: 12
    });
    const [results, setResults] = useState({
        products: [],
        hasMore: true,
        total: 0
    });

    const loadData = async () => {
        console.log(filter);

        const response = await GyftedApi.instance().search(filter);

        const list = results.products.concat(response.data);
        console.log(list);
        setResults({
            products: list,
            hasMore: response.hasNext,
            total: response.total
        });
    }

    useEffect(() => {
        loadData();
    }, [filter]);

    const clearResults = () => {
        console.log("clearing result set");
        setResults({
            products: [],
            hasMore: true,
            total: 0
        });
    }

    const nextPage = () => {
        console.log("calling next page...");
        const { query, location, page, size } = filter;
        setFilter({ query, location, page: page + 1, size });
    };

    const newSearch = (searchFilter) => {
        console.log("new search handler...");
        const { page, size } = filter;
        clearResults();
        setFilter({ query: searchFilter.query, location: searchFilter.country, page, size });
    };

    return (
        <div className="row">
            <SearchBar list={countries} callback={newSearch}></SearchBar>
            <span>{results.products.length} of {results.total} products</span>
            <InfiniteScroll
                className="row row-cols-1 row-cols-md-3 row-cols-lg-4"
                dataLength={results.products.length}
                next={nextPage}
                hasMore={true}
            >
                {results.products.map((p, idx) => (
                    <Product key={idx} data={{
                        id: p.id,
                        image: p.assets.images[0].source,
                        name: p.name,
                        description: (p.desc && p.desc.length > 0) ? p.desc[0].desc : "",
                        price: p.price.amount,
                        currency: p.price.currency,
                    }} />
                ))}
            </InfiniteScroll>
        </div >
    );
};

export default ProductList;