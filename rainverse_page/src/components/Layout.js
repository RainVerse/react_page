import {Col, Layout, Menu, Row, Divider, List} from 'antd';
import {SyncOutlined} from '@ant-design/icons';
import VisibilitySensor from "react-visibility-sensor";
import React from 'react';
import './Layout.less';
import axios from 'axios'
import QueueAnim from 'rc-queue-anim';
import ArticleCard from './ArticleCard'
import LoginWindow from "./LoginWindow";
import ArticleUpload from "./ArticleUpload";
import store from "store";

const {Header, Content, Footer} = Layout;
const loadNum = 5

class RainLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: true,
            showArticle: false,
            data: [],
            currentOffset: 0,
            isEnd: false,
            userState: {
                guestName: null,
                isLogin: false,
                auth: null,
                avatar: null,
            }
        }
    }

    changeUserState = (userState) => {
        this.setState({
            userState: userState
        })
    }

    componentDidMount = () => {
        let userData = store.get('userData')
        if (userData) {
            this.setState({
                userState: {
                    guestName: userData.guestName,
                    isLogin: userData.isLogin,
                    auth: userData.auth,
                    avatar: null
                }
            })
        }
        axios.get('apis/get_article_list', {
            params: {
                offset: this.state.currentOffset,
                limit: loadNum
            },
            baseURL: 'http://localhost:5000'
        })
            .then((response) => {
                this.setState({
                    showLoading: false,
                    showArticle: true,
                    data: response.data.articleList,
                    currentOffset: this.state.currentOffset + loadNum,
                    isEnd: response.data.isEnd
                })
                // console.log(this.state.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    renderArticleCard = (article) => {
        return (
            <QueueAnim
                ease="easeInOutQuart"
                duration={1000}
            >
                <div key={article.title}>
                    <ArticleCard
                        title={article.title}
                        content={article.content}
                        article_type={article.article_type}
                        create_time={article.create_time}
                        last_edit_time={article.last_edit_time}
                        is_private={article.is_private}
                        userState={this.state.userState}
                    />
                    <br/>
                </div>
            </QueueAnim>
        );
    }

    loadMoreArticle = (isVisible) => {
        if (isVisible && this.state.data.length) {
            axios.get('apis/get_article_list', {
                params: {
                    offset: this.state.currentOffset,
                    limit: loadNum
                },
                baseURL: 'http://localhost:5000'
            })
                .then((response) => {
                    this.setState({
                        showLoading: false,
                        data: this.state.data.concat(response.data.articleList),
                        currentOffset: this.state.currentOffset + loadNum,
                        isEnd: response.data.isEnd
                    })
                    // console.log(this.state.data)

                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    render() {
        const loader =
            <VisibilitySensor onChange={this.loadMoreArticle}>
                <div style={{textAlign: "center", fontSize: 40}}>
                    <SyncOutlined spin/>
                </div>
            </VisibilitySensor>
        const loadFinish =
            <Divider orientation="center" plain>
                没有更多了
            </Divider>

        return (
            <Layout className="layout">
                <Header>
                    <div className="loginWindow">
                        <LoginWindow
                            userState={this.state.userState}
                            changeUserState={this.changeUserState}
                        />
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
                                padding: '0 50px',
                                minHeight: 'calc(100vh - 186px)'
                            }}>
                                <Divider orientation="left" plain>
                                    本来无一物，何处惹尘埃。
                                    <ArticleUpload
                                        userState={this.state.userState}
                                    />
                                </Divider>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={this.state.data}
                                    renderItem={this.renderArticleCard}
                                />
                                {this.state.isEnd ? loadFinish : loader}
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