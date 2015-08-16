var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var React = require('react');
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
ThemeManager.setTheme(ThemeManager.types.DARK);

var FlatButton = mui.FlatButton;
var TextField = mui.TextField;
var FontIcon = mui.FontIcon;

var messageForm = React.createClass({
    canPost: false,
    getInitialState:function(){
        return {
            btnTxt: '&#xe0c5; 留言 Leave a message',
            vcodeSrc: '/verification/img',
            vcodeShow: false,
            name: $.cookie('article-name') || '',
            email: $.cookie('article-email') || '',
            blog: $.cookie('article-blog') || ''
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
    openMessage: function(e){
        var self = this;
        if(!this.canPost){
            this.canPost = !this.canPost;
            var refs = this.refs;
            refs.messageBox.getDOMNode().style.height = '315px';
            refs.messageBox.getDOMNode().style.paddingTop = '0';
            refs.messageShowBtn.getDOMNode().style.top = 'auto';
            refs.messageShowBtn.getDOMNode().style.bottom = '0';
            self.setState({
                btnTxt:'发布留言 Post a message'
            })
            setTimeout(function(){
                refs.messageShowBtn.getDOMNode().style.position = 'relative';
                refs.messageBox.getDOMNode().style.height = 'auto';
                if(!self.state.vcodeShow){
                    self.setState({
                        vcodeShow: true,
                        vcodeSrc: '/verification/img?v=' + Math.random()
                    })
                }
            },400);
            return false;
        }
    },
    postMessage: function(){
        var dom = this.refs.messageFrom.getDOMNode();
        var formData = $(dom).serializeArray();
        var url = $(dom).attr('action');
        console.log('post message', formData, url);
        $.ajax({
            url: url,
            method: 'POST',
            data: formData,
            success: function(data){
                if(data.code == 200){
                    alert('发布成功')
                }else{
                    alert('发布失败')
                }
                console.log('form callback',data)
            }
        })
        return false;
    },
    focus: function(){
        console.log(this.state.vcodeShow);
    },
    changeVcode: function(){
        this.setState({
            vcodeSrc: '/verification/img?v=' + Math.random()
        })
    },
    saveVal: function(e){
        var name = e.target.name;
        var val = e.target.value;
        var obj={}
        obj[name]=val;
        this.setState(obj)
        $.cookie('article-' + name, val, {
            expires: 365,
            path: '/'
        });
    },
    render: function(){
        var vcodeStyle = {'display':'none'};
        if(this.state.vcodeShow){
            vcodeStyle.display = 'block';
        }
        return (
            <form className="comment-box" action="/api/message" method="post" onSubmit={this.postMessage} ref="messageFrom">
                <div style={{height: 0,overflow:'hidden','padding-top':36}} ref="messageBox" className="messageBox" onFocus={this.focus} >
                    <TextField hintText="Nickname" name="name" type="text" fullWidth={true} onChange={this.saveVal} value={this.state.name} />
                    <TextField hintText="Email" name="email" type="email" fullWidth={true}  onChange={this.saveVal} value={this.state.email} />
                    <TextField hintText="WebSite/Blog" name="blog" type="url" fullWidth={true}  onChange={this.saveVal} value={this.state.blog} />
                    <TextField hintText="Verification code" name="vcode" type="text" required="required" fullWidth={true} />
                    <TextField hintText="Let's say some thing" name="content" required="required" multiLine={true} fullWidth={true} />
                    <img class="verification-image" src={this.state.vcodeSrc} style={vcodeStyle} onClick={this.changeVcode} />
                    <FlatButton onClick={this.openMessage} className="messageShowBtn" ref="messageShowBtn" style={{position:'absolute','left':0,'top':0,'width':'100%','fontFamily': 'message'}} type="submit" fullWidth={true} >
                        <div dangerouslySetInnerHTML={{__html:this.state.btnTxt}}></div>
                    </FlatButton>
                </div>
            </form>
        );
    }
});

module.exports = messageForm;