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
        fetch("http://localhost:3001/api/tasks", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        })
            .then(response => response.json())
            .then(data => { setTasks(data.tasks); console.log(data); })
    }, []);


    const handleSaveTask = (task, event) => {
        console.log(event)

        produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            fetch('http://localhost:3001/api/tasks', {
                method: "PUT",
                body: JSON.stringify(draft[index]),
                headers: {
                    "content-Type": "application/json",
                    "token": token
                }
            })
            .then(response => response.json())
            .then(data => { console.log(data); })
        });
    };

    const handleAddTask = () => {
        const newTask = {
            task: "New task"
        }

        try {
            fetch("http://localhost:3001/api/tasks", {
                // mode: "no-cors"
                method: "POST",
                body: JSON.stringify(newTask),
                headers: {
                    "Content-Type": "application/json",
                    "token": token
                }
            })

            fetch("http://localhost:3001/api/tasks", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
            })
                .then(response => response.json())
                .then(data => { setTasks(data.tasks); console.log(data); })

        } catch (error) {
            console.log(error);
        }

        setTasks(produce(tasks, draft => {
            draft.push(newTask);
        }));
    };

    const handleDeleteTask = (task) => {
        fetch("http://localhost:3001/api/tasks", {
            method: "DELETE",
            body: JSON.stringify(task),
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        })

        setTasks(produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft.splice(index, 1);
        }));
    };

    const handleTaskCompleted = (task, event) => {
        setTasks(produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].completed = !draft[index].completed;
        }));
    };

    const handleTaskTitle = (task, event) => {
        setTasks(produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].task = event.target.value;
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
                                <Checkbox defaultChecked={task.completed} name="completed" id="completed" onChange={(e) => handleTaskCompleted(task, e)} />
                                <Input type="text" name="task" id="task" defaultValue={task.task} onChange={(e) => handleTaskTitle(task, e)}/>
                            </Space>
                            <Button type="text" onClick={(e) => handleSaveTask(task, e)}>save</Button>
                            <Button type="text" onClick={(e) => handleDeleteTask(task, e)}><DeleteOutlined /></Button>
                        </Row>
                    </List.Item>}
                />
            </Col>
        </Row>
    )
}