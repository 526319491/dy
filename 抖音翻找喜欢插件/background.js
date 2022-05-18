// let queryApiDs = "https://up.reefun.com/finddouyin/douyin.php";//获取任务【地市站】
let queryApiDs = "http://up.reefun2.com/finddouyin/douyin.php";//获取任务【地市站】

chrome.runtime.onInstalled.addListener(async () => {

});

// 获取抖音找人任务并且与内容页通信开始任务
function dyGetTask() {
    // chrome.storage.sync.clear()
    chrome.storage.sync.get(["isTask"], function (result) {
        // 没有任务的时候才去获取任务
        if (!result['isTask']) {
            let fetchRes = fetch(queryApiDs + "?tag=gettask");
            fetchRes.then(res => res.json()).then(d => {
                console.log(d)
                // 有任务的时候通信
                if (d.length > 0) {
                    chrome.storage.sync.set({"arraylist":d})
                    mis()
                } else {
                    console.log("无任务")
                }
            })
        }else{
            console.log("任务开始了")
        }
    });

}

// 与内容页通信
function sendTaskMessage() {
    let queryOptions = {active: true, currentWindow: true};
    chrome.tabs.query(queryOptions, function (tabs) {
        let id = tabs[0]["id"]
        chrome.storage.sync.get(["arraylist"], function (result) {
            if(result.arraylist.length>0){
                let nowone=result.arraylist[0]
                let all=result.arraylist;
                all.shift()
                chrome.storage.sync.set({"arraylist":all})
                chrome.tabs.update(id,{active:true,url:'https://www.douyin.com/search/'+nowone['keyword']+'?source=normal_search&type=user'},function(){
                    console.log('更新网址,5秒后发送消息给网址,开始执行任务')
                    setTimeout(function () {
                        console.log('开始发送消息给网站，执行任务')
                        chrome.tabs.sendMessage( id, {"messageType":"taskFirststep",'one':nowone});
                    },5000)
                });
            }else{
                chrome.storage.sync.set({"isTask":false})
                chrome.storage.sync.set({"arraylist":[]})
            }
        })
    });
}
function returnMsg(request) {
    console.log(request)
    var arr = []; //定义数组
    for (var i in request) {
        arr[i]=request[i]
    }
    console.log(arr)
    fetch(queryApiDs + "?tag=getres", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(request),
    }).then(response => response.json()).then(json => {
        console.log(json)
    })
    mis()
}
// 开始任务
function mis() {
    let queryOptions = {active: true, currentWindow: true};
    chrome.tabs.query(queryOptions, function (tabs) {
        let id = tabs[0]["id"]
        chrome.tabs.sendMessage( id, {"messageType":"missionReady"});
    })
}
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request)
        switch (request.messageType) {
            case "dyGetTask":
                chrome.storage.sync.get(["FULLBEGIN"], function (result) {
                    console.log(result['FULLBEGIN'])
                    if(result['FULLBEGIN']){
                        dyGetTask()
                    }

                })

                return true;
            case "returnmsg":
                chrome.storage.sync.get(["FULLBEGIN"], function (result) {
                    if(result['FULLBEGIN']){
                        returnMsg(request)
                    }
                })

                break;
            case "startOnetask":
                chrome.storage.sync.get(["FULLBEGIN"], function (result) {
                    if(result['FULLBEGIN']){
                        sendTaskMessage()
                    }
                })
                break;
        }
        return true;
    }
);
