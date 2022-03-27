$(function () {
  // 初始化右侧滚动条
  // 这个方法定义在scroll.js中
  resetui()

  // 为发送按钮绑定鼠标点击事件
  $('#btnSend').on('click', function () {
    var text = $('#ipt').val().trim()
    if (text.length <= 0) {
      return $('#ipt').val('')
    }
    // 如果用户输入了聊天内容，则将聊天内容追加到页面上显示
    $('#talk_list').append('<li class="right_word"><img src="img/person02.jpg" /> <span>' + text + '</span></li>')
    $('#ipt').val('')
    // 重置滚动条的位置
    resetui()
    // 发起请求，获取聊天内容
    getMsg(text)
  })

  // 获取聊天机器人发送回来的消息
  function getMsg(text) {
    $.ajax({
      url: '//www.liulongbin.top:3006/api/robot?spoken='+text,
      dataType:'jonsp',
      error: function (error) {
        if (JSON.parse(error.responseText).message === 'success') {
          // 接收聊天消息
          var msg = JSON.parse(error.responseText).data.info.text
          $('#talk_list').append('<li class="left_word"><img src="img/person01.jpg" /> <span>' + msg + '</span></li>')
          // 重置滚动条的位置
          resetui()
          // 调用 getVoice 函数，把文本转化为语音
          getVoice(msg)
        }
      }
    })
  }

  // 把文字转化为语音进行播放
  function getVoice(text) {
    $.ajax({
      url: '//www.liulongbin.top:3006/api/synthesize?text='+text,
      dataType:'jonsp',
      error: function (error) {
        // console.log(res)
        if (JSON.parse(error.responseText).status === 200) {
          // 播放语音
          $('#voice').attr('src', JSON.parse(error.responseText).voiceUrl)
        }
      }
    })
  }

  // 为文本框绑定 keyup 事件
  $('#ipt').on('keyup', function (e) {
    // console.log(e.keyCode)
    if (e.keyCode === 13) {
      // console.log('用户弹起了回车键')
      $('#btnSend').click()
    }
  })
  /* 移动端的触屏滑动 */
  //拿到talk_list
  var talkList = document.querySelector('.talk_list');
  //拿main
  var main = document.querySelector('.main');
  //拿到右侧滚动条
  var drager = document.querySelector('.drager');
  //绑定touch事件
  talkList.addEventListener('touchstart',function (e){
    if(talkList.offsetHeight>=640) {//当聊天列表大于640px的时候才产生滑动效果
      //拿到刚触摸时候的y坐标
      var base_y = e.targetTouches[0].clientY;
      var base_top = talkList.offsetTop;
      //绑定touchmove事件
      talkList.addEventListener('touchmove', function (e) {
        //拿到移动后的y坐标
        var change_y = e.targetTouches[0].clientY;
        //计算y上的移动距离
        var dy = change_y - base_y;
        //移动到dy的值
        talkList.style.top = base_top + dy + 'px';
        //如果到顶了就限制往上
        if(talkList.offsetTop>=0) {
          talkList.style.top = 0;
        }
        //如果到底了就限制往下
        if(talkList.offsetTop<=-(talkList.offsetHeight-main.offsetHeight)) {//如果到顶了就限制往上
          talkList.style.top= -(talkList.offsetHeight-main.offsetHeight)+'px';
        }
        //右侧滚动条跟随
        drager.style.top = (-talkList.offsetTop) / main.offsetHeight * drager.offsetHeight + 'px';
        

      })
    }
  })
})