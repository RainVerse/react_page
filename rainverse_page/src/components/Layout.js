import {Col, Layout, Menu, Row, Space, Divider} from 'antd';
import React from 'react';
import './Layout.less';
import axios from 'axios'
import QueueAnim from 'rc-queue-anim';
import ArticleCard from './ArticleCard'
import LoginWindow from "./LoginWindow";

const {Header, Content, Footer} = Layout;

class RainLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: true,
            showArticle: false,
        }
        this.data = null
    }

    componentDidMount = () => {
        axios.defaults.withCredentials = true
        axios.get('apis/get_article_list', {
            baseURL: 'http://localhost:5000'
        })
            .then((response) => {
                this.data = response.data.map((article) =>
                    <ArticleCard title={article.content} content={article.content} key={article.content}/>
                )
                this.setState({
                    showLoading: false,
                    showArticle: true,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (

            <Layout className="layout">
                <Header>
                    <div className="loginWindow">
                        <LoginWindow/>
                    </div>
                    <div className="logo">
                    </div>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1">nav 1</Menu.Item>
                        <Menu.Item key="2">nav 2</Menu.Item>

                    </Menu>
                </Header>
                <div className='bg'>
                    <Row>
                        <Col xs={0} sm={1} md={2} lg={6} xl={5}/>
                        <Col xs={24} sm={22} md={20} lg={16} xl={14}>
                            <Content style={{
                                padding: '0 50px', height: 'calc(100vh - 186' +
                                    'px)'
                            }}>
                                <Divider orientation="left" plain>
                                    本来无一物，何处惹尘埃。
                                </Divider>
                                <QueueAnim animConfig={[
                                    {opacity: [1, 0], translateX: [0, 200]},
                                    {opacity: [1, 0], translateX: [0, -200]}
                                ]}
                                           ease="easeInOutQuart"
                                >
                                    <Space direction="vertical" size='middle' style={{width: '100%'}}>
                                        {this.state.showArticle ? (this.data) : null}
                                    </Space>
                                </QueueAnim>
                            </Content>
                        </Col>
                        <Col xs={2} sm={3} md={4} lg={5} xl={5}/>
                    </Row>
                    <Footer style={{textAlign: 'center'}}>
                        <p>Developed by RainVerse 2021 <a href="mailto:rainverse@qq.com">Contact me</a></p>
                        <a href='https://beian.miit.gov.cn/'>辽ICP备17013470号-2</a>
                    </Footer>
                </div>
            </Layout>

        );
    }
}

export default RainLayout;