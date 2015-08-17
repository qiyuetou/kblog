var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

//
var Message = require('../component/messageForm.jsx');

var Reflux = require('reflux');
var listAction = require('./messageAction.jsx');
var listStore = require('./messageStore.jsx');

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
            list:[],
            page:[],
            totalPage:1,
            thisPage:1,
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
        this.listenTo(listStore, this.actionDispatch);
    },
    actionDispatch: function(type,data) {
        this[type] && this[type](data);
    },
    addOne: function(data){
        data.message.time = '刚刚';
        var newList = this.state.list;
        newList.unshift(data.message);
        console.log('****',newList);
        this.setState({list: newList});
    },
    loadList: function(lists){
        // deal with message
        lists.message.map(function(listVal){
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

            return listVal;
        })
        this.setState({list: lists.message});

        // deal with page
        var page = this.page(lists.page.thisPage, lists.page.totalPage);
        this.setState({page: page,totalPage: lists.page.totalPage,thisPage: lists.page.thisPage});
    },
    page: function(now, total) {
        var btns = [];
        btns = btns.concat(now > 1 ? [{type: 'start'}, {type: 'preview'}] : []);
        btns = btns.concat(now >= 4 ? [{type: 'ellipsis'}] : []);
        var start = now - 2 >= 1 ? now - 2 : 1;
        var end = now + 2 <= total ? now + 2 : total;
        for (var i = start; i <= end; i++) {
            btns.push({type: (i==now ? 'active' : 'page'),'number': i});
        }
        btns = btns.concat(now < total - 2 ? [{type: 'ellipsis'}] : []);
        btns = btns.concat(now !== total ? [{type: 'next'}, {type: 'end'}] : []);
        return btns;
    },
    replayMsg: function(id){
        var self = this;
        // console.log(id,this.state.list);
        var list = self.state.list.map(function(val){
            if(val._id == id){
                val.replay = true;
            }else{
                val.replay = false;
            }
        });
        self.setState(list);
        // var box = this.refs.replayBox.getDOMNode();
        // window.box = box;
        // console.log(box);
        return false;
    },
    render: function(){
        var self = this;
        return (
            <div>
                {this.state.list.map(function(listValue){
                    var name ;
                    var replay;
                    if (listValue.name && listValue.blog){
                        name =  <a href={listValue.blog} className="comment-info-name">{listValue.name}</a>
                    } else {
                        name = <span className="comment-info-name">{ listValue.name ? listValue.name : 'Mofei的好伙伴'}</span>
                    }
                    if (listValue.replay == true){
                        replay = <Message ref = "replayBox" open="true" />
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
                                            <a href="#" cid={listValue._id} className="messageRep" onClick={self.replayMsg.bind(this,listValue._id)}>&#xe082; 回复</a>
                                        </span>
                                        <div className="comment-text">{listValue.content}</div>
                                    </div>
                                </div>
                                {replay}
                            </div>
                })}
                <section className="blog-list-page">
                    {this.state.page.map(function(pageV){
                        if(pageV.type == 'start'){
                            return <span class="blogpagesellip"  onClick={listAction.loadList.bind(this, {page:1})} >首页</span>
                        }
                        if(pageV.type == 'preview'){
                            return <span class="blogpagesellip" onClick={listAction.loadList.bind(this, {page:self.state.thisPage-1})} >上一页</span>
                        }
                        if(pageV.type == 'next'){
                            return <span class="blogpagesellip" onClick={listAction.loadList.bind(this, {page:self.state.thisPage+1})} >下一页</span>
                        }
                        if(pageV.type == 'end'){
                            return <span class="blogpagesellip" onClick={listAction.loadList.bind(this, {page:self.state.totalPage})} >尾页</span>
                        }
                        if(pageV.type == 'ellipsis'){
                            return <span class="blogpagesellip">...</span>
                        }
                        if(pageV.type == 'active'){
                            return <span  className="active">{pageV.number}</span>
                        }
                        if(pageV.type == 'page'){
                            return <span href={"?page="+pageV.number} onClick={listAction.loadList.bind(this, {page:pageV.number})} >{pageV.number}</span>
                        }
                    })}
                    {'共' + this.state.totalPage + '页'}
                </section>
            </div>
        )
    }
});

module.exports = messageList;