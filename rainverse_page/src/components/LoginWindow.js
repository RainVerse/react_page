import {Modal, Button, Form, Input, message, Avatar, Tooltip} from 'antd';
import {UserOutlined, SmileFilled} from '@ant-design/icons';
import React from 'react';
import './LoginWindow.less';
import axios from "axios";
import store from 'store'

class LoginWindow extends React.Component {

    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            isLogin: false,
            auth: 0,
            guestName: null,
            avatar: null,
            modalVisible: false,
        }
    }

    componentDidMount = () => {
        let userData = store.get('userData')
        if (userData) {
            this.setState({
                isLogin: userData.isLogin,
                auth: userData.auth,
                guestName: userData.guestName,
            })
            console.log(userData)
        }
    }

    showModal = () => {
        this.setState({
            modalVisible: true,
        })
    };

    handleOk = values => {
        let formData = new URLSearchParams(values)
        axios.post('apis/login', formData, {
            baseURL: 'http://localhost:5000'
        })
            .then((response) => {
                let res = response.data;
                if (res.status) {
                    store.set('userData', {
                        isLogin: res.status,
                        auth: res.auth,
                        guestName: res.username,
                    })
                    this.setState({
                        isLogin: res.status,
                        auth: res.auth,
                        guestName: res.username,
                        modalVisible: false
                    })
                    if (res.auth === 1) {
                        message.success('欢迎，' + res.username);
                    } else if (res.auth === 2) {
                        message.success('欢迎回来');
                    }
                } else {
                    this.formRef.current.resetFields();
                    message.error('麻烦来点阳间的ID');
                }
            })
            .catch((error) => {
                console.log(error);
                message.error('连接失败');
            });

    };

    handleFailed = errors => {
    };

    handleCancel = () => {
        this.setState({
            modalVisible: false,
        })
    };

    handleLogout = () => {
        axios.get('apis/logout', {
            baseURL: 'http://localhost:5000'
        })
            .then((response) => {
                let res = response.data;
                if (res.status) {
                    store.remove('userData')
                    this.setState({
                        isLogin: false,
                        auth: null,
                        guestName: null,
                    })
                    message.success('登出成功')
                }
            })
            .catch((error) => {
                console.log(error);
                message.error('连接失败');
            });
    };

    render() {
        const logoutInfo = (
            <div style={{textAlign: "center"}}>
                {this.state.auth === 2 ? null : ('你好,' + this.state.guestName )}
                {this.state.auth === 2 ? null : <br/>}
                点击登出
            </div>);
        return (
            <div>
                {this.state.isLogin ?
                    <div>
                        <Tooltip title={logoutInfo}>
                            <Avatar
                                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                icon={<UserOutlined/>}
                                onClick={this.handleLogout}
                            />
                        </Tooltip>
                    </div>
                    :
                    <div>
                        <SmileFilled onClick={this.showModal}
                                     style={{fontSize: 20, color: 'white'}}/>
                        <Modal
                            title="Title"
                            visible={this.state.modalVisible}
                            onCancel={this.handleCancel}
                            footer={null}
                        >
                            <Form
                                name="guestLogin"
                                onFinish={this.handleOk}
                                onFinishFailed={this.handleFailed}
                                ref={this.formRef}
                            >
                                <Form.Item
                                    label="Username"
                                    name="username"
                                    rules={[{required: true, message: '你的ID'}]}
                                >
                                    <Input/>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                }


            </div>
        );
    }

}

export default LoginWindow;