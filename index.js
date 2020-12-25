// import IO from "socket.io-client";
const IO = require("./src/utils/socket.io.js");
export default {

	install(Vue) {
    let socketGather = {};
    let messageListeners = {};
    let connectListen = {};
    let disconnectListen = {};
    let codeSerialNumber = 0;

    /**
     * @description 创建socket实例
     * @param {*} connection 链接地址
     * @param {*} opts 链接属性参数 socketKey为socket标记必传
     */
    let createSocket = function(connection, opts){
      if(opts.socketKey){
        socketGather[opts.socketKey] = IO((connection || ""), opts, openCallback);

        socketGather[opts.socketKey].on("connect",()=>{
          console.log(opts.socketKey+"链接成功");
          openCallback && openCallback();
          Object.keys(connectListen).forEach(key=>{
            Object.keys(connectListen[key]).forEach(fun=>{
              if(fun==opts.socketKey){
                connectListen[key][fun](evt);
              };
            });
          });
        });

        socketGather[opts.socketKey].on("disconnect",()=>{
          console.log(opts.socketKey+"链接已关闭");
          Object.keys(disconnectListen).forEach(key=>{
            Object.keys(disconnectListen[key]).forEach(fun=>{
              if(fun==opts.socketKey){
                disconnectListen[key][fun](evt);
              };
            });
          });
        });

        socketGather[opts.socketKey].on("message",(evt)=>{
          Object.keys(messageListeners).forEach(key=>{
            Object.keys(messageListeners[key]).forEach(fun=>{
              if(fun==opts.socketKey){
                messageListeners[key][fun](evt);
              };
            });
          });
        });
      }else{
        throw new Error("需要定义socketKey以便socket链接做区分");
      };
    };

    /**
     * @description 获取socket对应实例
     * @param {*} socketKey socket标记
     */
    let getSocket = function(socketKey){
      if(socketKey){
        return socketGather[socketKey];
      }else{
        throw new Error("需要获取的实例不明确");
      };
    };

    /**
     * @description 主动关闭指定实例
     * @param {*} socketKey socket标记
     */
    let closeSocket = function(socketKey){
      if(socketGather[socketKey]){
        socketGather[socketKey].disconnect();
      }else{
        throw new Error(socketKey+"实例不存在");
      };
    };

    /**
     * @description 添加监听
     */
		let addListeners = function() {
			if (this.$options.socket) {

        this.$options.socket.code = (codeSerialNumber+"");
        codeSerialNumber++;
        
        let conf = this.$options.socket;

				if (conf.connection) {
          createSocket(conf.connection, conf.options);
				};

				if (conf.events && conf.options && conf.options.socketKey) {
					let prefix = conf.prefix || "";
					Object.keys(conf.events).forEach((key) => {
						let func = conf.events[key].bind(this);
						socketGather[conf.options.socketKey].on(prefix + key, func);
						conf.events[key].__binded = func;
					});
        };
        
        // 注册消息监听事件
        if(conf.messageListeners){
          Object.keys(conf.messageListeners).forEach(key=>{
            if(!messageListeners[this.$options.socket.code]){
              messageListeners[this.$options.socket.code]={};
            };
            messageListeners[this.$options.socket.code][key] = conf.messageListeners[key].bind(this);
          });
        };

        // 注册链接成功监听事件
        if(conf.connectListen){
          Object.keys(conf.connectListen).forEach(key=>{
            if(!connectListen[this.$options.socket.code]){
              connectListen[this.$options.socket.code]={};
            };
            connectListen[this.$options.socket.code][key] = conf.connectListen[key].bind(this);
          });
        };

        // 注册关闭监听事件
        if(conf.disconnectListen){
          Object.keys(conf.disconnectListen).forEach(key=>{
            if(!disconnectListen[this.$options.socket.code]){
              disconnectListen[this.$options.socket.code]={};
            };
            disconnectListen[this.$options.socket.code][key] = conf.disconnectListen[key].bind(this);
          });
        };

			}
		};

    /**
     * @description 删除监听
     */
		let removeListeners = function() {
			if (this.$options.socket) {
				let conf = this.$options.socket;

				if (conf.connection) {
          closeSocket((conf.options && conf.options.socketKey));
				};

				if (conf.events && conf.options && conf.options.socketKey) {
					let prefix = conf.prefix || "";
					Object.keys(conf.events).forEach((key) => {
						socketGather[conf.options.socketKey].off(prefix + key, conf.events[key].__binded);
					});
        };
        
        if(conf.messageListeners){
          delete messageListeners[this.$options.socket.code];
        };
        if(conf.connectListen){
          delete connectListen[this.$options.socket.code];
        };
        if(conf.disconnectListen){
          delete disconnectListen[this.$options.socket.code];
        };
			}
		};

    // 方法混入
		Vue.mixin({
      // 创建前执行添加
      beforeCreate: addListeners,
      // 销毁前执行删除
      beforeDestroy: removeListeners,
      // 载入方法
      methods: {
        $IO_getSocket: getSocket,
        $IO_createSocket: createSocket,
        $IO_closeSocket: closeSocket
      },
		});

	}

};