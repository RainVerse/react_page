import {Card, Comment, Tooltip, Avatar, Divider, List, Affix} from 'antd';
import {HeartTwoTone, MessageTwoTone} from '@ant-design/icons';
import CommentForm from "./CommentForm";
import moment from 'moment';
import './SideComment.less';
import React from 'react';

class SideComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetail: false,
            loading: true,
            data: []
        }

    }

    componentDidMount = () => {
        let detail = document.querySelector('body').offsetWidth > 720;
        this.setState({
            showDetail: detail,
            loading: false,
        })
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    renderComment = (item) => {
        return (
            <Comment
                actions={[
                    <Tooltip title={'喜欢'}>
                        <HeartTwoTone className='comment-action'/> {item.love_mark}
                    </Tooltip>
                ]}
                author={<p>{item.guestName}</p>}
                avatar={
                    <Avatar
                        src={item.avatar}
                        alt={item.guestName}
                    />
                }
                content={
                    <div dangerouslySetInnerHTML={{__html: item.content}} className='content'/>
                }
                datetime={
                    <Tooltip title={moment().format(item.create_time)}>
                        <span>{moment().from(item.create_time)}</span>
                    </Tooltip>
                }
            >
            </Comment>
        );
    }
    changeComment = (commentData, articleNum) => {
        this.setState({
            data: commentData
        })
    }
    handleResize = e => {
        if (e.target.innerWidth > 720) {
            this.setState({
                showDetail: true,
            })
        } else {
            this.setState({
                showDetail: false,
            })
        }
    }

    render() {
        const comments = (
            <div>
                <Divider/>
                <List
                    dataSource={this.state.data}
                    renderItem={this.renderComment}
                />
            </div>
        );
        return (
            <div className='side-comment'>
                <Affix offsetTop={120} onChange={affixed => console.log(affixed)}>
                    <p>{this.state.showDetail ? 'detail' : 'hide'}</p>
                    <Card
                        loading={this.state.loading}
                        // bodyStyle={{height: 500}}
                        actions={[
                            <CommentForm
                                userState={this.props.userState}
                                changeComment={this.changeComment}
                                trigger={
                                    <Tooltip title={'评论'}>
                                        <MessageTwoTone/>
                                    </Tooltip>
                                }
                            />,
                        ]}
                    >
                        {this.state.loading ? null : comments}
                    </Card>
                </Affix>
            </div>
        );
    }

}

export default SideComment;