import React from 'react';
import {message, Form, Popover, Space} from 'antd';
import {DrawerForm, ProFormText} from '@ant-design/pro-form';
import {PlusOutlined, EditOutlined, FileImageOutlined} from '@ant-design/icons';
import './ArticleUpload.less';
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
            editorState: BraftEditor.createEditorState('<p></p>')
        }
    }

    componentDidMount = () => {
    }

    onFormSubmit = async (values) => {
        values.content = values.content.toHTML()
        values.tags = this.tagRef.current.state.tags
        let formData = new URLSearchParams(values)
        let isSuccess = false
        // console.log(formData.toString())
        // console.log(formData.values())
        await axios.post('apis/uploadArticle', formData, {
            baseURL: 'http://localhost:5000'
        })
            .then((response) => {
                let res = response.data;
                isSuccess = res.status
                if (isSuccess) {
                    message.success('Done');
                } else {
                    message.error('来者何人？');
                }
            })
            .catch((error) => {
                console.log(error);
                message.error('连接失败');
            });
        return isSuccess
    }

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
        const controls = ['bold', 'italic', 'underline', 'text-color', 'separator',
            'strike-through', 'code', 'text-align', 'emoji', 'link', 'separator', 'media',]
        const triggerContent = (
            <div style={{fontSize: 30}}>
                <Space size='middle'>
                    <DrawerForm
                        title="Whatever"
                        formRef={this.formRef}
                        trigger={<EditOutlined/>}
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
                    <FileImageOutlined/>
                </Space>
            </div>
        );

        return (this.props.userState.auth === 2 ?
                <Popover content={triggerContent} trigger="hover">
                    <PlusOutlined style={{color: 'blue'}}/>
                </Popover>
                : null
        );
    }

}

export default ArticleUpload;