import { Checkbox, Col, Form, Input, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { loginApi } from "../src/redux/thunks/userAuth";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../src/components/form/InputBox";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";
import styled from "styled-components";
import { LoginImageNew } from "../public";
import { ButtonWrapper } from "../src/components/button/ButtonWrapper";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../src/axios";

const StyledContent = styled.div`
  .form-label {
    text-align: left;
    margin-bottom: 8px;
    font-size: 16px;
  }
  .top-image {
    position: relative;
    width: 100%;
  }
  .card-wrapper {
    width: 448px;
    height: 512px;
    /* padding: 0 32px; */
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }

  .banner-wrapper {
    textalign: left;
    position: relative;
    top: -80px;
    left: 0px;

    p {
      font-size: 16px;
      margin: 0;
      color: #000000a6;
    }
  }

  .forgot-password {
    margin-top: 16px;
    text-align: center;
    a {
      color: #1d194d;
    }
  }
`;
const Home = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, isLoggedIn } = useSelector((state) => state.loginAuth);

  const onFinish = async (values) => {
    const validatedValues = await form.validateFields();

    if (validatedValues) {
      const valuesWithNav = {
        validatedValues,
        router,
      };
      dispatch(loginApi(valuesWithNav));
    }
  };

  const onFinishFailed = (errorInfo) => { };

  useEffect(() => {
     router.push("/dashboard");
  }, []);

  return (
    <>
      <Row className="h-screen flex justify-center">
        <Col span={8} className="flex justify-center items-center">
          <StyledContent>
            <div className="card-wrapper">
              <img className="top-image" src={LoginImageNew} alt="Logo" />
              <div className="banner-wrapper pl-4">
                <p className="text-white">
                  <b>Welcome Back</b>
                </p>
                <p className="text-white">Sign in to continue</p>
              </div>

              <Form
                className="px-6"
                form={form}
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <h4 className="form-label">Username</h4>
                <InputBox
                  className="mb-3"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input your username!",
                    },
                  ]}
                />
                <h4 className="form-label">Password</h4>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password className="mb-3" />
                </Form.Item>

                {/* <div style={{ margin: "24px 0", textAlign: "left" }}>
                  <Form.Item name="remember" valuePropName="checked">
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                </div> */}

                <ButtonWrapper
                  className="mt-8"
                  size="large"
                  htmlType="submit"
                  loading={isLoading}
                >
                  Login
                </ButtonWrapper>
              </Form>
            </div>
          </StyledContent>
        </Col>
      </Row>
    </>
  );
};

export default Home;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Login",
      },
    },
  };
}
