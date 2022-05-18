let n=0;
let timeup=30
let an=setInterval(function () {
    chrome.storage.sync.get("run",function (result) {
        if(result.run){
            n++;
            let t=$(window).scrollTop()
            $('body,html').animate({'scrollTop':t+1000},500)
            console.log('滑动'+n+'次')
            if(n>100){
                // clearInterval(an)
                // console.log(getCurrentDate(new Date()))
                // let time2= (new Date()).valueOf();
                // timeup=time2-time1;
                // let timelist=[time1,time2,timeup]//开始时间，结束时间，使用时间
                // upres(timelist,r)
            }
        }
    })

},1500)