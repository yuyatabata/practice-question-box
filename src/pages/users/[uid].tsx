import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { User } from "../../models/User";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";

type Query = {
  uid: string;
};

const UserShow = () => {
  const [user, setUser] = useState<User>(null);
  const router = useRouter();
  const query = router.query as Query;

  useEffect(() => {
    const loadUser = async () => {
      console.log(query);
      if (query.uid === undefined) {
        return;
      }

      const db = getFirestore();
      const ref = doc(collection(db, "user"), query.uid);
      const userDoc = await getDoc(ref);

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

  return <div>{user ? user.name : "Loading..."}</div>;
};

export default UserShow;
