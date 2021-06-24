function UserProfilePage(props) {
  return <h1>{props.username}</h1>;
}

export default UserProfilePage;

// getServerSideProps run only on server, after deployment and will be execute with each request on the server, and the component file with this function doesn't need (getStaticPaths) function, plus we can add 'revalidate' key value-pair to the returned object to configure after how many seconds we need to re-generate this component again and make build and deployment automatically.
export async function getServerSideProps(context) {
  const { params, req, res } = context;

  return {
    props: {
      username: "Ramy",
    },
  };
}
