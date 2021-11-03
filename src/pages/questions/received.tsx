import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useAuthentication } from "../../hooks/authentication";
import { Question } from "../../models/Question";
import Layout from "../../components/Layout";
import dayjs from "dayjs";
import "dayjs/locale/ja";

dayjs.locale("ja");

const QuesionReceived = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const { user } = useAuthentication();

  useEffect(() => {
    if (!process.browser) {
      return;
    }

    if (user === null) {
      return;
    }

    const loadQuestions = async () => {
      const db = getFirestore();
      const q = query(
        collection(db, "questions"),
        where("receiverUid", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return;
      }

      const gotQuestions = snapshot.docs.map((doc) => {
        const question = doc.data() as Question;
        question.id = doc.id;
        return question;
      });
      setQuestions(gotQuestions);
    };

    loadQuestions();
  }, [process.browser, user]);

  return (
    <Layout>
      <h1 className="h4">受け取った質問一覧</h1>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          {questions.map((question) => (
            <div className="card my-3" key={question.id}>
              <div className="card-body">
                <div className="text-truncate">{question.body}</div>
                <div className="text-muted text-end">
                  <small>
                    {dayjs(question.createdAt.toDate()).format(
                      "YYYY/MM/DD HH:mm"
                    )}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default QuesionReceived;
