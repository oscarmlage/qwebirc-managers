var WINDOW_STATUS = 1;
var WINDOW_QUERY = 2;
var WINDOW_CHANNEL = 3;

var UI = new Class({
  initialize: function(parentElement, windowClass, uiName) {
    this.windows = {};
    this.windowArray = [];
    this.windowClass = windowClass;
    this.parentElement = parentElement;
    this.parentElement.addClass("qwebirc");
    this.parentElement.addClass("qwebirc-" + uiName);
    this.firstClient = false;
  },
  newClient: function(client) {
    this.windows[client] = {}
    var w = this.newWindow(client, WINDOW_STATUS, "Status");
    this.selectWindow(w);
    if(!this.firstClient) {
      this.firstClient = true;
      w.addLine("", "qwebirc v" + QWEBIRC_VERSION);
      w.addLine("", "Copyright (C) 2008 Chris Porter. All rights reserved.");
      w.addLine("", "http://webchat.quakenet.org/");
      w.addLine("", "This is BETA quality software, please report bugs to slug@quakenet.org");
    }
    return w;
  },
  newWindow: function(client, type, name) {
    var identifier = name;
    if(type == WINDOW_STATUS)
      identifier = "";
      
    var w = this.windows[client][identifier] = new this.windowClass(this, client, type, name, identifier);
    this.windowArray.push(w);
    
    return w;
  },
  getActiveWindow: function() {
    return this.active;
  },
  __setActiveWindow: function(window) {
    this.active = window;
  },
  selectWindow: function(window) {
    if(this.active)
      this.active.deselect();
    window.select();  /* calls setActiveWindow */
  },
  __closed: function(window) {
    if(window.active) {
      this.active = undefined;
      if(this.windowArray.length == 1) {
        this.windowArray = [];
      } else {
        var index = this.windowArray.indexOf(window);
        if(index == 0) {
          this.selectWindow(this.windowArray[1]);
        } else {
          this.selectWindow(this.windowArray[index - 1]);
        }
        
        this.windowArray = this.windowArray.erase(window);
      }
    }
    
    delete this.windows[window.client][window.identifier];
  },
  loginBox: function(callback, initialNickname, initialChannels) {
    /*
      this shouldn't be called by overriding classes!
      some form of user input MUST be received before an
      IRC connection is made, else users are going to get
      tricked into getting themselves glined
    */

    var nick = prompt("Nickname:", initialNickname);
    if(!nick) {
      alert("Aborted.");
      return;
    }

    var chans = prompt("Channels (seperate by comma):", initialChannels);
    callback({"nickname": nick, "autojoin": chans});
  }
});