import { Button, Descriptions } from "antd";
import { CurrUser } from "../script/type";
import { getUserMessages } from "../script/checkToken";

interface DetailProps {
  info: CurrUser | undefined;
}

export default function Detail(props: DetailProps) {
  return (
    <Descriptions
      title={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1>User Info</h1>
          <Button
            color="orange"
            variant="outlined"
            onClick={async () => {
              const a =  props.info?.id ?await getUserMessages(props.info?.id) : "";
              console.log(a)
            }}
          >
            Check Messages
          </Button>
        </div>
      }
      bordered
      column={2}
      style={{
        backgroundColor: "#f9f9f9",
        padding: "60px 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Descriptions.Item label="Username" span={2}>
        {props.info?.username}
      </Descriptions.Item>
      <Descriptions.Item label="Email" span={2}>
        {props.info?.email}
      </Descriptions.Item>
      <Descriptions.Item label="Created At" span={2}>
        {new Date(props.info?.createAt || "").toLocaleString()}
      </Descriptions.Item>

      <Descriptions.Item label="Role">
        {props.info?.role ? "Admin" : "User"}
      </Descriptions.Item>
      <Descriptions.Item label="Status">
        {props.info?.isActive ? "Normal" : "Banned"}
      </Descriptions.Item>
    </Descriptions>
  );
}
