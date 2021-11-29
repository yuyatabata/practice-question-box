import Layout from "../../../components/Layout";
import { Answer } from "../../../models/Answer";
import { Question } from "../../../models/Question";

type Props = {
  answer: Answer;
  question: Question;
};

const getDescription = (answer: Answer) => {
  const body = answer.body.trim().replace(/[ \r\n]/g, "");
  if (body.length < 140) {
    return body;
  }
  return body.substring(0, 140) + "...";
};

export const getServerSideProps = async ({ query }) => {
  const res = await fetch(process.env.API_URL + `/api/answers/${query.id}`);
  const json = await res.json();
  return { props: json };
};

const AnswersShow = (props: Props) => {
  const description = getDescription(props.answer);

  return (
    <Layout>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <>
            <div className="card">
              <div className="card-body">{props.question.body}</div>
            </div>

            <section className="text-center mt-4">
              <h2 className="h4">回答</h2>

              <div className="card">
                <div className="card-body text-left">{props.answer.body}</div>
              </div>
            </section>
          </>
        </div>
      </div>
    </Layout>
  );
};

export default AnswersShow;
