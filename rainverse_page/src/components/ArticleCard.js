import {Card, Comment, Tooltip, Avatar, Tag, Divider, List} from 'antd';
import {HeartTwoTone, MessageTwoTone} from '@ant-design/icons';
import moment from 'moment';
import React from 'react';
import './ArticleCard.less';
import CommentForm from "./CommentForm";

const colorList = ['purple', 'cyan', 'geekblue', 'blue']

class ArticleCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        }

    }

    componentDidMount = () => {
        this.setState({
            loading: false
        })
    }

    renderComment = (item) => {
        return (
            <Comment
                actions={[
                    <Tooltip title={'喜欢'}>
                        <HeartTwoTone className='comment-action'/> {item.love_mark}
                    </Tooltip>
                    ,
                    <CommentForm
                        userState={this.props.userState}
                        articleId={this.props.articleData.id}
                        articleNum={this.props.articleData.num}
                        commentId={item.id}
                        changeComment={this.props.changeComment}
                        trigger={
                            <span key="comment-basic-reply-to">回复</span>
                        }
                    />,
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
                {item.sub_comments.length ?
                    <List
                        dataSource={item.sub_comments}
                        renderItem={this.renderComment}
                    />
                    : null}
            </Comment>
        );
    }

    render() {
        const articleInfo = (
            <div>
                <div style={{textAlign: "right"}}>

                    <Divider orientation="right" plain>
                        <Tooltip
                            title={'最后编辑于: ' + moment().format(this.props.articleData.last_edit_time)}
                            placement="topRight"
                        >
                            <div
                                style={{color: "grey"}}>{moment().format(this.props.articleData.create_time)}
                            </div>
                        </Tooltip>
                    </Divider>
                    {this.props.articleData.is_private && <p style={{color: "lightgrey", paddingRight: '8%'}}>私有财产</p>}
                </div>
                {this.props.articleData.tags.length ?
                    <div>
                        <List
                            dataSource={this.props.articleData.tags}
                            renderItem={item => (
                                <Tag color={colorList[Math.floor(4 * Math.random())]}>{item}</Tag>
                            )}
                        />
                    </div>
                    : null
                }
            </div>
        );
        const comments = (
            <div>
                <Divider/>
                <List
                    dataSource={this.props.articleData.comments}
                    renderItem={this.renderComment}
                />
            </div>
        );
        return (
            <Card
                title={this.props.articleData.title}
                loading={this.state.loading}
                // bodyStyle={{height: 500}}
                actions={[
                    <Tooltip title={'喜欢'}>
                        <HeartTwoTone/> {this.props.love_mark}
                    </Tooltip>,
                    <CommentForm
                        userState={this.props.userState}
                        articleId={this.props.articleData.id}
                        articleNum={this.props.articleData.num}
                        changeComment={this.props.changeComment}
                        trigger={
                            <Tooltip title={'评论'}>
                                <MessageTwoTone/>
                            </Tooltip>
                        }
                    />,
                ]}
            >
                <div dangerouslySetInnerHTML={{__html: this.props.articleData.content}} className='content'/>
                {articleInfo}
                {this.props.articleData.comments.length ? comments : null}
            </Card>
        );
    }

}

export default ArticleCard;