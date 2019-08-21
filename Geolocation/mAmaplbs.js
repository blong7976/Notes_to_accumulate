/**
    * Created by ly-wangweiq on 2015/7/29.
    * * support mobile
    */
    //用户位置定位   使用geolocation定位
    var mMap=function(){
    function rad(d){
        return d*Math.PI/180.0;
    }
    this.map={},
    this.geolocation={},
    this.k=0,
    //加载地图，调用浏览器定位服务
    this.initMap=function(mapContainer,completFunc){
        if(typeof(AMap)=="object"){
            this.map = new AMap.Map(mapContainer, {
             resizeEnable: true
         });
     this.map.plugin('AMap.Geolocation', function () {
            this.geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true,        //显示定位按钮，默认：true
                buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });
            this.map.addControl(this.geolocation);
            AMap.event.addListener(this.geolocation, 'complete', onComplete);//返回定位信息
            AMap.event.addListener(this.geolocation, 'error', onError);      //返回定位出错信息
        });
        function onComplete(data){
            console.log(completFunc)
            console.log(data)
            if(completFunc){
                completFunc(data);
            }
        }
        function onError(){
            var str = '定位失败,';
            str += '错误信息：'
            switch(data.info) {
                case 'PERMISSION_DENIED':
                    str += '浏览器阻止了定位操作';
                    break;
                case 'POSITION_UNAVAILBLE':
                    str += '无法获得当前位置';
                    break;
                case 'TIMEOUT':
                    str += '定位超时';
                    break;
                default:
                    str += '未知错误';
                    break;
            }
            alert(str)
        }
    }
 
},
 this.getCurrentPosition=function(callback){
    if(typeof(this.geolocation.getCurrentPosition)!='undefined'){
        this.geolocation.getCurrentPosition();
    }else{
        setTimeout(function(){
            //将获得的经纬度信息，放入sessionStorge
            this.getSessionLocation(callback)
        },200)
    }
 
},
 
this.distance = function(obj1,obj2){//return：m
    var lng=new AMap.LngLat(obj1.lng, obj1.lat);
    var lag=new AMap.LngLat(obj2.lng, obj2.lat);
    var ss=lng.distance(lag);
    return ss;
},
this.getSessionLocation=function(callback){
    if(sessionStorage.getItem('location')){
        callback();
    }else{
        this.initMap('',function(data){
            sessionStorage.setItem("location",JSON.stringify(data))
            callback();
        });
        this.getCurrentPosition(callback);
       }
    },
    /*
     *两点之间的距离
   *（lng1.lat1）地址一的经纬度
   *（lng2.lat2）地址一的经纬度
   *单位米
*/ 
 this.serverDistance = function(obj1,obj2){//return：m
    var radLat1 = rad(obj1.lat);
    var radLat2 = rad(obj2.lat);
    var a = radLat1 - radLat2;
    var b = rad(obj1.lng)- rad(obj2.lng);
    var s =  2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
        s = s *6378137;
        s = Math.round(s * 10000)/10000 ;
    return s;
}
return this;
}();