import React from 'react';
import {Form, message,} from 'antd';
import {
    ModalForm,
    ProFormText
} from '@ant-design/pro-form';
import axios from "axios";
import BraftEditor from "braft-editor";

class CommentForm extends React.Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            editorState: BraftEditor.createEditorState('<p></p>')
        }
    }

    componentDidMount = () => {
    }

    checkContent = (rule, value) => {
        if (!value.isEmpty()) {
            return Promise.resolve();
        }
        return Promise.reject('请输入评论内容');
    };

    onFormSubmit = async (values) => {
        values.content = values.content.toHTML()
        if (this.props.articleId) {
            values['articleId'] = this.props.articleId
        }
        if (this.props.commentId) {
            values['commentId'] = this.props.commentId
        }
        if (this.props.userState.guestName) {
            values['guestName'] = this.props.userState.guestName
        }

        console.log(values)
        let formData = new URLSearchParams(values)
        let isSuccess = false
        await axios.post('apis/uploadComment', formData, {
            baseURL: 'http://localhost:5000'
        })
            .then((response) => {
                let res = response.data;
                isSuccess = res.status
                if (isSuccess) {
                    message.success('评论成功');
                    axios.get('apis/get_article_comment', {
                        params: {
                            articleId: this.props.articleId
                        },
                        baseURL: 'http://localhost:5000'
                    })
                        .then((response) => {
                            this.props.changeComment(response.data.comments, this.props.articleNum)
                        })
                        .catch((error) => {
                            message.error('连接失败');
                        });
                } else {
                    message.error('连接失败');
                }
            })
            .catch((error) => {
                console.log(error);
                message.error('连接失败');
            });
        return isSuccess
    }

    render() {
        const controls = ['bold', 'italic', 'underline', 'text-color', 'separator',
            'strike-through', 'code', 'text-align', 'emoji', 'link', 'separator']

        return (
            <ModalForm
                formRef={this.formRef}
                trigger={this.props.trigger}
                onFinish={this.onFormSubmit}
                width={'80%'}
            >
                {!this.props.userState.isLogin &&
                <ProFormText
                    name="guestName"
                    label="ID"
                    placeholder="留下你的ID吧"
                    rules={[{required: true}]}
                />
                }
                <Form.Item
                    label="评论"
                    name="content"
                    initialValue={this.state.editorState}
                    rules={[{
                        required: true,
                        validator: this.checkContent,
                        validateTrigger: 'onBlur'
                    }]}>
                    <BraftEditor

                        value={this.state.editorState}
                        onChange={this.handleContentChange}
                        controls={controls}
                        placeholder="留下你的评论"
                        contentStyle={{height: '40vh', boxShadow: 'inset 0 1px 5px rgba(0,0,0,.1)'}}
                    />
                </Form.Item>
            </ModalForm>
        );
    }
}

export default CommentForm;