import {Layout, Menu, Breadcrumb, Row, Col} from 'antd';
import React from 'react';
import './layout.less';
import axios from 'axios'
import ArticalCard from './ArticalCard'

const {Header, Content, Footer} = Layout;

class RainLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: true,
            showArtical: false,
        }
        this.data = null
    }

    componentDidMount = () => {
        axios.get('apis/get_article_list', {
            baseURL: 'http://localhost:5000'
        })
            .then((response) => {
                var articalData = response.data.map((artical) =>
                    <ArticalCard title={artical.content} content={artical.content} key={artical.content}/>
                );
                this.data=articalData
                this.setState({
                    showLoading: false,
                    showArtical: true,
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
                    <div className="logo"/>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1">nav 1</Menu.Item>
                        <Menu.Item key="2">nav 2</Menu.Item>
                        <Menu.Item key="3">nav 3</Menu.Item>
                    </Menu>
                </Header>
                <div className='bg'>
                    <Row>
                        <Col xs={0} sm={1} md={2} lg={6} xl={5}/>
                        <Col xs={24} sm={22} md={20} lg={16} xl={14}>
                            <Content style={{padding: '0 50px'}}>
                                <Breadcrumb style={{margin: '16px 0'}}>
                                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                                    <Breadcrumb.Item>List</Breadcrumb.Item>
                                    <Breadcrumb.Item>App</Breadcrumb.Item>
                                </Breadcrumb>
                                {this.state.showArtical ? (this.data) : null}
                            </Content>
                        </Col>
                        <Col xs={2} sm={3} md={4} lg={5} xl={5}/>
                    </Row>
                </div>


                <Footer style={{textAlign: 'center'}}>
                    <p>Developed by RainVerse 2021 <a href="mailto:rainverse@qq.com">Contact me</a></p>
                    <a href='https://beian.miit.gov.cn/'>辽ICP备17013470号-2</a>
                </Footer>
            </Layout>

        );
    }
}

export default RainLayout;