import { Form, Input, Button, Row, Col, notification} from "antd";
import { useNavigate } from "react-router";

export default function Register() {
    const navigate = useNavigate();

    // Handle form submission

    const onFinish = (values) => {
        console.log('Success:', values);
        fetch("http://localhost:3001/register", {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status !== "Username already exists") {
                notification.success({ message: 'Registered' });
                navigate("/login");
            }
            notification.error({
                message: 'Username already exists'
            });
        }
    )}

    return (
        <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
            <Col span={4}>
                <h1>Register</h1>
                <Button type="text" onClick={() => navigate("/login")}>Back</Button>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ username: "", password: "" }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}