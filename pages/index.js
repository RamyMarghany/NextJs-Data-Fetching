import path from "path";
import fs from "fs/promises";

import Link from "next/link";

function HomePage(props) {
  const { products } = props;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/products/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  );
}

export async function getStaticProps(context) {
  console.log("(Re-)Generating...");
  // cwd => current working directory and the default directory is the root path, then folder name is written (data), then the fileName is written (dummy-data.json)
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  // if there's any problem in retrieving data, we can re-direct to a specific page (/no-data)
  if (!data) {
    return {
      redirect: {
        destination: "/no-data",
      },
    };
  }

  // if returned data doesn't have things to display, we can re-direct to 404 page automatically.
  if (data.products.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      products: data.products,
    },
    // number is seconds to decide on production env after how long we need to re-generate the page to display the newest data to the client, this revalidate doesn't matter on development env.
    revalidate: 10,
  };
}

export default HomePage;
