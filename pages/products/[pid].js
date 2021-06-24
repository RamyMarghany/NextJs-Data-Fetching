import path from "path";
import fs from "fs/promises";

import { Fragment } from "react";

function ProductDetailPage(props) {
  const { loadedProduct } = props;

  // Use this conditional if we use Fallback: true in getStaticPaths function
  if (!loadedProduct) {
    return <p>Loading...</p>;
  }

  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  );
}

// Code enhancement to re-use this function many times
async function getData() {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  return data;
}

export async function getStaticProps(context) {
  // we can access the dynamic path through useRouter(but useRouter run on the client-side on the browser) as we know, but if we need to prepare the data in the serve to pre-generate the page, then we need to use getStaticProps function because it's run and execute on the server and before the execution of the component
  const { params } = context;

  const productId = params.pid;

  const data = await getData();

  const product = data.products.find((product) => product.id === productId);

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      loadedProduct: product,
    },
  };
}

// when working on a page with a dynamic path, we need to use getStaticPaths function to let NextJS understand and get more information about the concrete path for the page and to know how many instance this page will render, and it always return an object with (paths) array
export async function getStaticPaths() {
  const data = await getData();

  const ids = data.products.map((product) => product.id);
  const pathsWithParams = ids.map((id) => ({ params: { pid: id } }));

  return {
    paths: pathsWithParams,
    // we can use fallback with true value, to just pre-generate highly visited pages, and postpone the generation to less frequented pages to safe time and resources because to all pages visited with the same frequency, but with this approach we are going to face a problem, if the URL has been changed to match a query param, the page won't generated yet and this raise an error, so we can either make if conditional to display loading message, or set the value of the fallback with (blocking) in string
    fallback: true,
  };
}

export default ProductDetailPage;
