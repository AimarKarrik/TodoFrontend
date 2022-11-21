import { DeleteOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, List, Col, Row, Space, Divider } from "antd";
import produce from "immer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";


export default function TaskList() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState();

    var token;
    if (localStorage.getItem("token")) {
        token = localStorage.getItem("token");
    }
    useEffect(() => {
        if (!token) return;
        fetch("http://demo2.z-bit.ee/tasks", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => response.json())
            .then(data => { setTasks(data); console.log(data); })
    }, []);


    const handleNameChange = (task, event) => {
        console.log(event)
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].title = event.target.value;
            fetch('http://demo2.z-bit.ee/tasks/' + task.id, {
                method: "PUT",
                body: JSON.stringify(draft[index]),
                headers: {
                    "content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(response => response.json())
                .then(data => { console.log(data); })
        });
        setTasks(newTasks);
    };

    const handleMarkedAsDoneChange = (task, event) => {
        console.log(event)
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].marked_as_done = event.target.checked;

            fetch('http://demo2.z-bit.ee/tasks/' + task.id, {
                method: "PUT",
                body: JSON.stringify(draft[index]),
                headers: {
                    "content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(response => response.json())
                .then(data => { console.log(data); })
        });
        setTasks(newTasks);
    };

    const handleAddTask = () => {
        const newTask = {
            title: "New task",
            marked_as_done: false
        }

        setTasks(produce(tasks, draft => {
            draft.push(newTask);
        }));

        fetch("https://demo2.z-bit.ee/tasks", {
            method: "POST",
            body: JSON.stringify(newTask),
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        });
    };

    const handleDeleteTask = (task) => {
        setTasks(produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft.splice(index, 1);
        }));
    };

    return (
        <Row type="flex" justify="center" style={{ minHeight: '100vh', marginTop: '6rem' }}>
            <Col span={12}>
                <div>
                    <Button type="text" onClick={() => navigate("/login")}>Login</Button>
                    <Button type="text" onClick={() => navigate("/logout")}>Logout</Button>
                </div>
                <h1>Task List</h1>
                <Button onClick={handleAddTask}>Add Task</Button>
                <Divider />
                <List
                    size="small"
                    bordered
                    dataSource={tasks}
                    renderItem={(task) => <List.Item key={task.id}>
                        <Row type="flex" justify="space-between" align="middle" style={{ width: '100%' }}>
                            <Space>
                                <Checkbox checked={task.marked_as_done} onChange={(e) => handleMarkedAsDoneChange(task, e)} />
                                <Input value={task.title} onChange={(event) => handleNameChange(task, event)} />
                            </Space>
                            <Button type="text" onClick={() => handleNameChange(task)}>save</Button>
                            <Button type="text" onClick={() => handleDeleteTask(task)}><DeleteOutlined /></Button>
                        </Row>
                    </List.Item>}
                />
            </Col>
        </Row>
    )
}