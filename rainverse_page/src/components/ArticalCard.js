import {Card} from 'antd';
import React from 'react';
import './ArticalCard.less';

class ArticalCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            title: props.title,
            content: props.content
        }
    }

    componentDidMount = () => {

    }

    render() {
        return (
            <Card title={this.state.title}>
                <p>{this.state.content}</p>
            </Card>
        );
    }
}

export default ArticalCard;