import Layout from "../../components/layout";
import { useRouter } from "next/router";
import ProductDetails from "../../components/detail";

const DetailPage = () => {
    const route = useRouter();

    return (
        <Layout>
            <ProductDetails itemId={route.query.product} />
        </Layout>
    );
};

export default DetailPage;