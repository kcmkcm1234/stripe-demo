import { useState, useEffect } from "react";

const style = {
    width: "100%",
    marginTop: "2%",
    marginBottom: "5%"
};

const scrollable = {
    height: "auto",
    maxHeight: "320px",
    width: "auto",
    maxWidth: "200px",
    overflowX: "hidden"
};

const SearchBar = (props) => {
    const [countries] = useState(props.list)
    const [filter, setFilter] = useState({
        query: "",
        country: countries[0]
    });

    const callback = props.callback ? props.callback : () => { };

    const changeCountry = async (evt) => {
        evt.preventDefault();
        const { query } = filter;
        setFilter({ query, country: evt.target.text });
    };

    const changeQuery = async (evt) => {
        evt.preventDefault();
        console.log(evt.target.value);
        const { country } = filter;
        setFilter({ query: evt.target.value, country });
    };

    useEffect(() => {
        async function invokeCallback() {
            console.log('invoking callback');
            callback(filter);
        };
        invokeCallback();
    }, [filter]);

    return (
        <div className="row searchbar" style={style}>
            <div className="col-xs-8 col-xs-offset-2" style={{ width: "100%" }}>
                <div className="input-group">
                    <div className="input-group-btn search-panel">
                        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                            <span id="search_concept">{filter.country}</span>
                            <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu scrollable-dropdown" role="menu" style={scrollable}>
                            {countries.map((country, idx) => <li key={idx}><a onClick={changeCountry} href="#">{country}</a></li>)}
                        </ul>
                    </div>
                    <input type="hidden" name="search_param" value={filter.param} id="search_param" />
                    <input type="text" name="x" onChange={changeQuery} id="search" className="form-control" placeholder="Search" />
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="button">
                            <span className="fa fa-search"></span>
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;