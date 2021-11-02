import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { User } from "../../models/User";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import Layout from "../../components/Layout";

type Query = {
  uid: string;
};

const UserShow = () => {
  const [user, setUser] = useState<User>(null);
  const router = useRouter();
  const query = router.query as Query;

  useEffect(() => {
    const loadUser = async () => {
      if (query.uid === undefined) {
        return;
      }

      const db = getFirestore();
      const ref = doc(collection(db, "users"), query.uid);
      const userDoc = await getDoc(ref);
      console.log(userDoc.data());

      if (!userDoc.exists()) {
        console.log("returned");
        return;
      }

      const gotUser = userDoc.data() as User;
      gotUser.uid = userDoc.id;
      setUser(gotUser);
    };
    loadUser();
  }, [query.uid]);

  return (
    <Layout>
      {user && (
        <div className="text-center">
          <h1 className="h4">{user.name}さんのページ</h1>
          <div className="m-5">{user.name}さんに質問しよう！</div>
        </div>
      )}
    </Layout>
  );
};

export default UserShow;
