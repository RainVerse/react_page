import {Card} from 'antd';
import React from 'react';
import './ArticleCard.less';

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

    render() {
        return (
            <Card
                title={this.props.title}
                loading={this.state.loading}
                // bodyStyle={{height: 500}}
            >
                <div dangerouslySetInnerHTML={{__html: this.props.content}} className='content'/>
                <p>{this.props.create_time}</p>
                {this.props.userState.isLogin && <p>logged in</p>}
            </Card>
        );
    }

}

export default ArticleCard;