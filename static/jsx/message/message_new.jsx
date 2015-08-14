var React = require('react');

var Message = require('../component/messageForm.jsx');
var MessageList = require('../component/messageList.jsx');

React.render(<Message/>,document.getElementById('msgForm'));
React.render(<MessageList/>,document.getElementById('commentList'));

