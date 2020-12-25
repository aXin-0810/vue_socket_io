vue全局插件 socket.io
===

  * 支持创建多消息通道与管理，接收

原作者
===

  * levy

创建时间
===

  * 2020-12-22

使用案例
===

main.js文件
===
```javascript

import socketIo from "@axin_0810/vue-socket-io";
Vue.use(socketIo);

```

test.vue文件
===
```javascript


//创建socket实例【socketKey标记字段必传，更多参数可以查看socket官网】
this.$IO_createSocket("http://...",{
  socketKey:"testSocket",
  // ......
},function(){
  console.log("testSocket链接成功");
});
// 附属：如果多页面或者多组件需要监听链接成功事件时
// 注意：需要在页面或者组件都加载完成后链接成功事件才能接收。

//获取socket实例【得到实例后可做更多的操作，更多操作可以查看socket官网】
this.$IO_getSocket("testSocket");

//主动关闭socket实例
this.$IO_closeSocket("testSocket");

//推送消息【更多消息类型以及参数可以查看socket官网】
this.$IO_getSocket("testSocket").send("消息内容");

// 添加自定义事件
this.$IO_getSocket("testSocket").on("push_event",function(msg){
  console.log(msg);
});

//更多使用方法查看官网......

export default {
  socket:{

    /**
     * 支持组件或者页面配置形式创建socket,配置形式只支持挂载是创建一个通道，并且在注销是会关闭通道
     */
    //链接地址
    connection:"http://",
    //参数
    options:{
      socketKey:"testSocket2",
      // ......
    },
    // 自定义事件
    events:{
      define_events(msg){
        console.log(msg);
      }
    },
    /******************************************************************************/

    //可以在任何页面或组件监听消息数据接收
    messageListeners:{
      testSocket(msg){
        console.log(msg);
      },
      testSocket2(msg){
        console.log(msg);
      },
      // 多socket通道可以追加标记方法接收......
    },
    //可以在任何页面或组件监听通道链接成功
    connectListen:{
      testSocket(){
        console.log("testSocket链接成功");
      },
      testSocket2(){
        console.log("testSocket2链接成功");
      },
      // ......
    },
    //可以在任何页面或组件监听通道关闭
    disconnectListen:{
      testSocket(){
        console.log("testSocket链接关闭");
      },
      testSocket2(){
        console.log("testSocket2链接关闭");
      },
      // ......
    }

  },
  // ......
}

```

更新时间
===

  * 2020-12-22 （levy）
