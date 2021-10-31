import Head from "next/head";
import Link from "next/link";
import { useAuthentication } from "../hooks/authentication";

const Home = () => {
  const { user } = useAuthentication();

  return (
    <div>
      <Head>
        <title>Page2</title>
        <link rel="icon" href="/favicon" />
      </Head>

      <p>{user?.uid || "未ログイン"}</p>
      <Link href="/">
        <a>Go back</a>
      </Link>
    </div>
  );
};

export default Home;
