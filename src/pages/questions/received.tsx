import { useEffect, useRef, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  startAfter,
  query,
  where,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { useAuthentication } from "../../hooks/authentication";
import { Question } from "../../models/Question";
import Layout from "../../components/Layout";
import dayjs from "dayjs";
import "dayjs/locale/ja";

dayjs.locale("ja");

const QuesionReceived = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isPaginationFinished, setIsPaginationFinished] = useState(false);
  const { user } = useAuthentication();
  const scrollContainerRef = useRef(null);

  const createBaseQuery = () => {
    const db = getFirestore();
    return query(
      collection(db, "questions"),
      where("receiverUid", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(10)
    );
  };

  const appendQuestions = (snapshot: QuerySnapshot<DocumentData>) => {
    const gotQuestions = snapshot.docs.map((doc) => {
      const question = doc.data() as Question;
      question.id = doc.id;
      return question;
    });
    setQuestions(questions.concat(gotQuestions));
  };

  const loadQuestions = async () => {
    const snapshot = await getDocs(createBaseQuery());

    if (snapshot.empty) {
      setIsPaginationFinished(true);
      return;
    }

    appendQuestions(snapshot);
  };

  const loadNextQuestions = async () => {
    if (questions.length === 0) {
      return;
    }

    const lastQuestion = questions[questions.length - 1];
    const snapshot = await getDocs(
      query(createBaseQuery(), startAfter(lastQuestion.createdAt))
    );

    if (snapshot.empty) {
      return;
    }

    appendQuestions(snapshot);
  };

  useEffect(() => {
    if (!process.browser) {
      return;
    }

    if (user === null) {
      return;
    }

    loadQuestions();
  }, [process.browser, user]);

  const onScroll = () => {
    if (isPaginationFinished) {
      return;
    }

    const container = scrollContainerRef.current;
    if (container === null) {
      return;
    }

    const rect = container.getBoundingClientRect();
    if (rect.top + rect.height > window.innerHeight) {
      return;
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [questions, scrollContainerRef.current, isPaginationFinished]);

  return (
    <Layout>
      <h1 className="h4">受け取った質問一覧</h1>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6" ref={scrollContainerRef}>
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
