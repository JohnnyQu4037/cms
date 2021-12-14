import { Result, Button } from "antd";
import { useRouter } from 'next/router';

export default function SuccessPage({ style,courseId }) {
  const router = useRouter();
  return (
    <Result
      style={{ ...style}}
      status="success"
      title="Successfully Create Course!"
      extra={[
        <Button
          type="primary"
          key="detail"
          onClick={() =>
            router.push(`${courseId.courseId}`)
          }
        >
          Go Course
        </Button>,
        <Button
          key="again"
          onClick={() => {
            router.reload();
          }}
        >
          Create Again
        </Button>,
      ]}
    />
  );
}
