import {ConfigProvider } from "antd";
import { ReactNode, useState } from "react";
import { Layout, Menu } from "antd";
import { useEffect } from "react";
import { CurrUser, UserInList } from "../script/type";
import {
  getUsers,
  getUsersList,
  logout,
} from "../script/checkToken";
import Detail from "./Detail";
import UsersTable from "./UsersTable";

export default function Dashboard() {
  const [data, setData] = useState<UserInList[]>([]);
  const [isChange, setIsChange] = useState<boolean>(true);
  const [userDetail, setUserDetail] = useState<boolean>(false);
  const [currUser, setCurrUser] = useState<CurrUser>();
  const { Content, Sider } = Layout;

  useEffect(() => {
    getUsersList().then((newData) => {
      Array.isArray(newData) ? setData(newData) : setData([]);
    });
  }, [isChange]);

  async function switchToUser(id:number) {
    const user = await getUsers(id);
    console.log(user);

    if (user === undefined) return;
    setCurrUser({
      id: user.id,
      email: user.email,
      username: user.username,
      createAt: user.createdAt,
      role: user.role,
      isActive: user.isActive,
    });

    setUserDetail(true);
  }
  const order = [
    {
      label: <span>Admin</span>,
      key: "admin",
    },
    {
      label: <span>User</span>,
      key: "user",
    },
  ];
  const sidebar = [
    {
      key: 0,
      label: "Home",
    },
    {
      key: 1,
      label: "User",
    },
    {
      key: 2,
      label: "Logout",
    },
  ];

  return (
    <section className="dashboard-section">
      <ConfigProvider
        theme={{
          components: {
            Layout: {
              lightSiderBg: "#E3F8FF"
            },
          },
        }}
      >
        <Layout style={{ backgroundColor: "transparent" }}>
          <Sider
            theme="light"
            style={{ borderRadius: "8px 0 0 8px" }}
            width="20%"
          >
            <Menu
              mode="inline"
              selectedKeys={[userDetail?"1":"0"]}
              items={sidebar}
              onClick={({ key }) => {
                if (key === "2") {
                  logout();
                } else if (key === "1") {
                  switchToUser(Number(localStorage.getItem("user_id")));
                } else if (key === "0") {
                  console.log(key);

                  setUserDetail(false);
                }
              }}
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "20px",
                borderRadius: "8px 0 0 8px",
                padding: "0px 20px",
              }}
            />
          </Sider>
          <Content
            style={{
              backgroundColor: "#FFD3B6",
              borderRadius: "0 8px 8px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {userDetail ? (
              <Detail info={currUser} />
            ) : (
              <UsersTable
                setData={setData}
                setIsChange={setIsChange}
                switchToUser={switchToUser}
                order={order}
                data={data}
              />
            )}
          </Content>
        </Layout>
      </ConfigProvider>
    </section>
  );
}
