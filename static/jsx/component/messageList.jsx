var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

//
var Reflux = require('reflux');
var listAction = Reflux.createActions([
    'loadList'
]);

var listStore = Reflux.createStore({
    listenables: listAction,
    onLoadList:function(){
        var self = this;
        console.log('????',arguments);
        $.get('/api/message',function(data){
            //?limit=2&page=1
            console.log('*****get',data);
            self.trigger(data.message);
        })
    }
});
//

var React = require('react');
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
ThemeManager.setTheme(ThemeManager.types.DARK);

var Card = mui.Card;
var CardHeader = mui.CardHeader;
var CardText = mui.CardText;
var Avatar = mui.Avatar;


var messageList = React.createClass({
    mixins: [Reflux.ListenerMixin],
    getInitialState:function(){
        return {
            list:[]
        }
    },
    childContextTypes: {
        muiTheme: React.PropTypes.object
    },
    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },
    componentWillMount: function() {
        listAction.loadList();
    },
    componentDidMount: function(){
        this.listenTo(listStore, this.listDataReceived);
    },
    listDataReceived: function(lists){
        lists.map(function(listVal){
            var time = new Date(listVal.time);
            var month = time.getMonth()+1;
            var date =  time.getDate();
            var hours = time.getHours();
            var minutes =  time.getMinutes();
            var seconds = time.getSeconds();
            var timeStr = time.getFullYear() +'/';
            timeStr += (month < 10 ? '0' + month : month) + '/';
            timeStr += date < 10 ? '0' + date : date;
            timeStr += ' ';
            timeStr += (hours<10 ? '0' + hours : hours) + ':';
            timeStr += (minutes<10 ? '0' + minutes : minutes) + ':';
            timeStr += (seconds<10 ? '0' + seconds : seconds) ;
            listVal.time = timeStr ;

            // listVal.name = listVal.name || 'Mofei的好伙伴';
            return listVal;
        })
        this.setState({list: lists});
    },
    render: function(){
        return (
            <div>
                {this.state.list.map(function(listValue){
                    var name ;
                    if (listValue.name && listValue.blog){
                        name =  <a href={listValue.blog} className="comment-info-name">{listValue.name}</a>
                    } else {
                        name = <span className="comment-info-name">{ listValue.name ? listValue.name : 'Mofei的好伙伴'}</span>
                    }
                    return <div className="comment-block">
                                <div className="comment-block-imgbg">
                                    <img src={listValue.avatar} onerror="this.src='/img/avatar/nobody.jpg'" className="comment-block-avatar" />
                                </div>
                                <div className="comment-info">
                                    <div className="comment-info-head">
                                        {name}
                                        <span>{listValue.time}</span>
                                        <span className="comment-info-replay">
                                            <a href="#" cid={listValue._id}>m回复</a>
                                        </span>
                                        <div className="comment-text">{listValue.content}</div>
                                    </div>
                                </div>
                            </div>
                })}
            </div>
        )
    }
});

module.exports = messageList;