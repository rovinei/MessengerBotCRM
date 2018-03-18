import React, {Component} from 'react';
import {connect} from 'react-redux';
import BotListView from '../../containers/BotListView';
import {getMessengerPageBots} from '../../actions/bot';
import {messengerPageBots} from '../../reducers/bot';

class MessengerBot extends Component {
    componentDidMount() {
        
    }
    render() {
        return (
            <div className="content">
                <BotListView
                    {...this.props}
                />
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    ...messengerPageBots(state),
    is_loading: false,
});

const mapDispatchToProps = (dispatch) => ({
    fetchMessengerBots: (filter) => {
        dispatch(getMessengerPageBots(filter))
    }
})
  
export default connect(mapStateToProps, mapDispatchToProps)(MessengerBot);