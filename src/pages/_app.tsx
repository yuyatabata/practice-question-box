import { RecoilRoot } from "recoil";
import "../styles/globals.scss";
import "../lib/firebase";
import "../hooks/authentication";

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
