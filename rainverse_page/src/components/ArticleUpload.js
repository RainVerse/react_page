import React from 'react';
import {message, Form} from 'antd';
import {DrawerForm, ProFormText} from '@ant-design/pro-form';
import {PlusOutlined} from '@ant-design/icons';
import './ArticleUpload.less';
import store from "store";
import axios from "axios";
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import TagInput from "./TagInput";


class ArticleUpload extends React.Component {
    formRef = React.createRef();
    tagRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            isLogin: false,
            auth: null,
            guestName: null,
            editorState: BraftEditor.createEditorState('<p></p>')
        }
    }

    componentDidMount = () => {
        let userData = store.get('userData')
        if (userData) {
            this.setState({
                isLogin: userData.isLogin,
                auth: userData.auth,
                guestName: userData.guestName
            })
            console.log(userData)
        }
    }

    onFormSubmit = values => {
        values.content = values.content.toHTML()
        values.tags = this.tagRef.current.state.tags
        let formData = new URLSearchParams(values)
        console.log(formData.toString())
        console.log(formData.values())
        axios.post('apis/uploadArticle', formData, {
            baseURL: 'http://localhost:5000'
        })
            .then((response) => {

            })
            .catch((error) => {
                console.log(error);
                message.error('连接失败');
            });

    };

    handleContentChange = (editorState) => {
        this.setState({
            editorState: editorState
        })
    }

    checkContent = (rule, value) => {
        if (!value.isEmpty()) {
            return Promise.resolve();
        }
        return Promise.reject('摸了？');
    };

    render() {
        const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator', 'media']
        return (this.state.auth === 2 ?
                <DrawerForm
                    title="Whatever"
                    formRef={this.formRef}
                    trigger={
                        <PlusOutlined style={{color: 'blue'}}/>
                    }
                    onFinish={this.onFormSubmit}
                    width='80%'
                >
                    <ProFormText
                        name="title"
                        width="l"
                        label="标题"
                        placeholder="Can we begin again?"
                        rules={[{required: true}]}
                    />
                    <Form.Item
                        label="正文"
                        name="content"
                        rules={[{
                            required: true,
                            validator: this.checkContent,
                            validateTrigger: 'onBlur'
                        }]}>
                        <BraftEditor
                            value={this.state.editorState}
                            onChange={this.handleContentChange}
                            controls={controls}
                            placeholder="Just start it over."
                            contentStyle={{height: '60vh', boxShadow: 'inset 0 1px 5px rgba(0,0,0,.1)'}}
                        />
                    </Form.Item>

                    <Form.Item
                        label="标签"
                        name="tags"
                    >
                        <TagInput ref={this.tagRef}/>
                    </Form.Item>

                </DrawerForm>
                : null
        );
    }

}

export default ArticleUpload;