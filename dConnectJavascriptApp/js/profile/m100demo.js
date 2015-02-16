/**
 m100demo.js
 Copyright (c) 2015 NTT DOCOMO,INC.
 Released under the MIT license
 http://opensource.org/licenses/mit-license.php
 */

// For debug.
// M100 IP Address.
var devIpAddr = "192.168.100.14:4035";
// Update Counter.
var counter = 40;
// Update Interval (mSec).
var updateInterval = 500
// timer variable.
var timer = null;


// Setting parameter.
var M100IpAddr = null;
var M100DemoCurrentClientId = null;
var M100DemoAccessToken = null;
var M100ServiceID = null;
var M100EiNormalMin = null;
var M100EiNormalMax = null;
var M100EiNormalColor = null;
var M100EiWarnupMin = null;
var M100EiWarnupMax = null;
var M100EiWarnupColor = null;
var M100EiFitnessMin = null;
var M100EiFitnessMax = null;
var M100EiFitnessColor = null;
var M100EiCardioMin = null;
var M100EiCardioMax = null;
var M100EiCardioColor = null;
var M100EiTrainingMin = null;
var M100EiTrainingMax = null;
var M100EiTrainingColor = null;

var isCookie = 0;
var isDrawable = 0;

var width = 150;
var height = 200;
var PosX = 10;
var PosY = 60;

/** 
 * M100 Demonstration
 */
function showM100Demo(serviceId) {
    initAll();
    setTitle("Demo Top");
    readParam();

    var btnStr = "";
        btnStr += '<center><input data-icon="grid" data-inline="true" data-mini="true" onclick="javascript:M100DemoAuthorization();" type="button" value="accessToken" /></center>';

    reloadHeader(btnStr);

    var str = "";
        str += '<li><a href="javascript:showHRDeviceSetup(\'' + serviceId + '\');" >Device Setup</a></li>';
        str += '<li><a href="javascript:showHRParamSetup(\'' + serviceId + '\');" >Parameter Setup</a></li>';
        str += '<li><a href="javascript:showHRValue(\'' + serviceId + '\');" >Show Heart Rate</a></li>';
    reloadList(str);
}

/** 
 * Read Parameter
 */
function readParam() {

    // Check cookie enable.
    document.cookie = "UseCookie=1";
    if (document.cookie.length == 0) {
        // Cookie unavailable.
        // Setting is not saved.
        // At the time of the first call, set the default value.
        isCookie = 0;

        if (M100IpAddr          == null) M100IpAddr          = devIpAddr;
        if (M100EiNormalMin     == null) M100EiNormalMin     = "40";
        if (M100EiNormalMax     == null) M100EiNormalMax     = "90";
        if (M100EiNormalColor   == null) M100EiNormalColor   = "#00fdff";
        if (M100EiWarnupMin     == null) M100EiWarnupMin     = "91";
        if (M100EiWarnupMax     == null) M100EiWarnupMax     = "110";
        if (M100EiWarnupColor   == null) M100EiWarnupColor   = "#00f900";
        if (M100EiFitnessMin    == null) M100EiFitnessMin    = "111";
        if (M100EiFitnessMax    == null) M100EiFitnessMax    = "130";
        if (M100EiFitnessColor  == null) M100EiFitnessColor  = "#ff9300";
        if (M100EiCardioMin     == null) M100EiCardioMin     = "131";
        if (M100EiCardioMax     == null) M100EiCardioMax     = "150";
        if (M100EiCardioColor   == null) M100EiCardioColor   = "#ff40ff";
        if (M100EiTrainingMin   == null) M100EiTrainingMin   = "151";
        if (M100EiTrainingMax   == null) M100EiTrainingMax   = "165";
        if (M100EiTrainingColor == null) M100EiTrainingColor = "#ff2600";
    } else {
        // Cookie available.
        isCookie = 1;

　　　   M100IpAddr = getCookie('M100IpAddr');
        if (M100IpAddr == null) M100IpAddr = devIpAddr;

        var result = M100IpAddr.split(":");
        var token = 'M100DemoAccessToken' + result[0];
        M100DemoAccessToken = getCookie(token);

        M100EiNormalMin = getCookie("M100EiNormalMin");
        if (M100EiNormalMin == null) M100EiNormalMin = "40";

        M100EiNormalMax = getCookie("M100EiNormalMax");
        if (M100EiNormalMax == null) M100EiNormalMax = "90";

        M100EiNormalColor = getCookie("M100EiNormalColor");
        if (M100EiNormalColor == null) M100EiNormalColor = "#00fdff";

        M100EiWarnupMin = getCookie("M100EiWarnupMin");
        if (M100EiWarnupMin == null) M100EiWarnupMin = "91";

        M100EiWarnupMax = getCookie("M100EiWarnupMax");
        if (M100EiWarnupMax == null) M100EiWarnupMax = "110";

        M100EiWarnupColor = getCookie("M100EiWarnupColor");
        if (M100EiWarnupColor == null) M100EiWarnupColor = "#00f900";

        M100EiFitnessMin = getCookie("M100EiFitnessMin");
        if (M100EiFitnessMin == null) M100EiFitnessMin = "111";

        M100EiFitnessMax = getCookie("M100EiFitnessMax");
        if (M100EiFitnessMax == null) M100EiFitnessMax = "130";

        M100EiFitnessColor = getCookie("M100EiFitnessColor");
        if (M100EiFitnessColor == null) M100EiFitnessColor = "#ff9300";

        M100EiCardioMin = getCookie("M100EiCardioMin");
        if (M100EiCardioMin == null) M100EiCardioMin = "131";

        M100EiCardioMax = getCookie("M100EiCardioMax");
        if (M100EiCardioMax == null) M100EiCardioMax = "150";

        M100EiCardioColor = getCookie("M100EiCardioColor");
        if (M100EiCardioColor == null) M100EiCardioColor = "#ff40ff";

        M100EiTrainingMin = getCookie("M100EiTrainingMin");
        if (M100EiTrainingMin == null) M100EiTrainingMin = "151";

        M100EiTrainingMax = getCookie("M100EiTrainingMax");
        if (M100EiTrainingMax == null) M100EiTrainingMax = "165";

        M100EiTrainingColor = getCookie("M100EiTrainingColor");
        if (M100EiTrainingColor == null) M100EiTrainingColor = "#ff2600";
    }
}

/**
 * Show HR Device Setup
 *
 * @param {String}serviceId サービスID
 */
function showHRDeviceSetup(serviceId){
    initAll();
    setTitle("Device Setup");

    var sessionKey = currentClientId;

    var btnStr = getBackButton('Demo Top', 'doHRDeviceBack', serviceId, sessionKey);
    reloadHeader(btnStr);
    reloadFooter(btnStr);
    
    var str = "";
    str += '<li><a href="javascript:showDeviceM100Setup(\'' + serviceId + '\');" >M100 Setup</a></li>';
/*    str += '<li><a href="javascript:showDeviceMioSetup(\'' + serviceId + '\');" >Mio Alpha Setup</a></li>';*/
    str += '<li><a href="javascript:doDeviceMioSetup(\'' + serviceId + '\');" >Mio Alpha Setup</a></li>';
    reloadList(str);
}

/**
 * Show Device M100 Setup
 *
 * @param {String}serviceId サービスID
 */
function showDeviceM100Setup(serviceId){
    initAll();
    setTitle("M100 Setup");

    var sessionKey = M100DemoCurrentClientId;

    var btnStr = getBackButton('Device Setup Top', 'doM100SetupBack', serviceId, sessionKey);
    reloadHeader(btnStr);
    reloadFooter(btnStr);
    
    var str = "";
    str += '<form name="M100ParamForm">';
    str += 'M100 IP Address<br>';
    str += '<input type="text" id="M100IpAddr" width="100%" value="' + M100IpAddr + '"/>';
    str += '<input type="button" name="setButton" id="setButton" value="Set" onclick="doSetM100Parameter();"/>';
    str += '</form>';
    reloadContent(str);
}

/**
 * Show Device Mio Alpha Setup
 *
 * @param {String}serviceId サービスID
 */
function showDeviceMioSetup(serviceId){
    initAll();
    setTitle("Mio Alpha Setup");

    var sessionKey = M100DemoCurrentClientId;

    var btnStr = getBackButton('Device Setup Top', 'doM100SetupBack', serviceId, sessionKey);
    reloadHeader(btnStr);
    reloadFooter(btnStr);
    
    var str = "";
    str += '<form name="MioParamForm">';
    str += 'M100 IP Address<br>';
    str += '<input type="button" name="setButton" id="setButton" value="Set" onclick="doSetMioParameter();"/>';
    str += '</form>';
    reloadContent(str);
}

/**
 * Device Mio Alpha Setup
 *
 * @param {String}serviceId サービスID
 */
function doDeviceMioSetup(serviceId){
    var builder = new dConnect.URIBuilder();
    builder.setProfile("system");
    var uri = builder.build();

    if(DEBUG) console.log("Uri:"+uri)

    dConnect.get(uri, null, null, function(json) {
        if (DEBUG) console.log("Response: ", json);
        for (var i = 0; i < json.plugins.length; i++) {
        if (DEBUG) console.log("id : " + json.plugins[i].id + " name : " + json.plugins[i].name);
        if (json.plugins[i].name == "BLE(HeartRate)デバイスプラグイン") {
                launchDevicePlugin(json.plugins[i].id);
                break;
            }
        }
    });
}

/**
 * Show HR Parameter Setup
 *
 * @param {String}serviceId サービスID
 */
function showHRParamSetup(serviceId){
    initAll();
    setTitle("Parameter Setup");

    var sessionKey = currentClientId;

    var btnStr = getBackButton('Demo Top', 'doHRParamBack', serviceId, sessionKey);
    reloadHeader(btnStr);
    reloadFooter(btnStr);

    var str = "";
    str += '<form name="ParamForm">';

    str += '<div data-role="rangeslider" id="EiNormal">';
    str += '  <label for="EiNormalMin">Exercise intensity (Normal)：</label>';
    str += '  <input id="EiNormalMin" name="EiNormalMin" type="range" min="30" max="130" step="1" value="' + M100EiNormalMin + '"/>';
    str += '  <label for="EiNormalMax">Exercise intensity (Normal) MAX：</label>';
    str += '  <input id="EiNormalMax" name="EiNormalMax" type="range" min="30" max="130" step="1" value="' + M100EiNormalMax + '"/>';
    str += '</div>';
    str += '<input id="EiNormalColor" name="EiNormalColor" type="color" value="' + M100EiNormalColor + '"/>';

    str += '<div data-role="rangeslider" id="EiWarnup">';
    str += '  <label for="EiWarnupMin">Exercise intensity (Warm up)：</label>';
    str += '  <input id="EiWarnupMin" name="EiWarnupMin" type="range" min="40" max="140" step="1" value="' + M100EiWarnupMin + '"/>';
    str += '  <label for="EiWarnupMax">Exercise intensity (Warm up) MAX：</label>';
    str += '  <input id="EiWarnupMax" name="EiWarnupMax" type="range" min="40" max="140" step="1" value="' + M100EiWarnupMax + '"/>';
    str += '</div>';
    str += '<input id="EiWarnupColor" name="EiWarnupColor" type="color" value="' + M100EiWarnupColor + '"/>';

    str += '<div data-role="rangeslider" id="EiFitness">';
    str += '  <label for="EiFitnessMin">Exercise intensity (Fitness)：</label>';
    str += '  <input id="EiFitnessMin" name="EiFitnessMin" type="range" min="60" max="160" step="1" value="' + M100EiFitnessMin + '"/>';
    str += '  <label for="EiFitnessMax">Exercise intensity (Fitness) MAX：</label>';
    str += '  <input id="EiFitnessMax" name="EiFitnessMax" type="range" min="60" max="160" step="1" value="' + M100EiFitnessMax + '"/>';
    str += '</div>';
    str += '<input id="EiFitnessColor" name="EiFitnessColor" type="color" value="' + M100EiFitnessColor + '"/>';

    str += '<div data-role="rangeslider" id="EiCardio">';
    str += '  <label for="EiCardioMin">Exercise intensity (Cardio)：</label>';
    str += '  <input id="EiCardioMin" name="EiCardioMin" type="range" min="80" max="180" step="1" value="' + M100EiCardioMin + '"/>';
    str += '  <label for="EiCardioMax">Exercise intensity (Cardio) MAX：</label>';
    str += '  <input id="EiCardioMax" name="EiCardioMax" type="range" min="80" max="180" step="1" value="' + M100EiCardioMax + '"/>';
    str += '</div>';
    str += '<input id="EiCardioColor" name="EiCardioColor" type="color" value="' + M100EiCardioColor + '"/>';

    str += '<div data-role="rangeslider" id="EiTraining">';
    str += '  <label for="EiTrainingMin">Exercise intensity (Training)：</label>';
    str += '  <input id="EiTrainingMin" name="EiTrainingMin" type="range" min="95" max="195" step="1" value="' + M100EiTrainingMin + '"/>';
    str += '  <label for="EiTrainingMax">Exercise intensity (Training) MAX：</label>';
    str += '  <input id="EiTrainingMax" name="EiTrainingMax" type="range" min="95" max="195" step="1" value="' + M100EiTrainingMax + '"/>';
    str += '</div>';
    str += '<input id="EiTrainingColor" name="EiTrainingColor" type="color" value="' + M100EiTrainingColor + '"/>';

    str += '<input type="button" name="setButton" id="setButton" value="Set" onclick="doSetParameter();"/>';
    str += '</form>';
    reloadContent(str);
}

/**
 * Show HR Value
 *
 * @param {String}serviceId サービスID
 */
function showHRValue(serviceId){
    initAll();
    setTitle("Show Heart Rate");

    var sessionKey = currentClientId;

    var btnStr = getBackButton('Demo Top', 'doHRValueBack', serviceId, sessionKey);
    reloadHeader(btnStr);
    reloadFooter(btnStr);
    
    var str = "";
    str += '<form name="upForm">';
    str += '<input type="button" name="startButton" id="startButton" value="Start" onclick="doStartHeartRate();"/>';
    str += '<input type="button" name="stopButton" id="stopButton" value="Stop" onclick="stopInterval();"/>';
    str += 'Heart Rate<br>';
    str += '<center><canvas id="canvas" width="' + width + '" height="' + height + '" ></canvas></center>';
    str += '</form>';
    reloadContent(str);
}

/**
 * Backボタン
 *
 * serviceId サービスID
 * sessionKey セッションKEY
 */
function doM100SetupBack(serviceId, sessionKey){
    showHRDeviceSetup(serviceId);
}

/**
 * Backボタン
 *
 * serviceId サービスID
 * sessionKey セッションKEY
 */
function doHRDeviceBack(serviceId, sessionKey){
    showM100Demo(serviceId);
}

/**
 * Backボタン
 *
 * serviceId サービスID
 * sessionKey セッションKEY
 */
function doHRParamBack(serviceId, sessionKey){
    showM100Demo(serviceId);
}

/**
 * Backボタン
 *
 * serviceId サービスID
 * sessionKey セッションKEY
 */
function doHRValueBack(serviceId, sessionKey){

/*    doHeartRateUnregist(serviceId, sessionKey);*/
    stopInterval();
    showM100Demo(serviceId);
}

/**
 * Heart Rate Event Regist
 */
function doHeartRateRegist(serviceId, sessionKey) {
    var builder = new dConnect.URIBuilder();
    builder.setProfile("health");
    builder.setAttribute("heartrate");
    builder.setServiceId(serviceId);
    builder.setAccessToken(accessToken);
    builder.setSessionKey(sessionKey);
    var uri = builder.build();
    if (DEBUG) console.log("Uri: " + uri);

    dConnect.addEventListener(uri,function(message) {
        // イベントメッセージが送られてくる
        if(DEBUG) console.log("Event-Message:"+message)
        var json = JSON.parse(message);
        if (json.heartRate && isDrawable == 1) {
            /* Draw canvas. */
            canvasDraw(json.heartRate);
        }
    }, null, function(errorCode, errorMessage){
        alert(errorMessage);
    });
}

/**
 * Heart Rate Event Unregist
 */
function doHeartRateUnregist(serviceId, sessionKey) {

    var builder = new dConnect.URIBuilder();
    builder.setProfile("health");
    builder.setAttribute("heartrate");
    builder.setServiceId(serviceId);
    builder.setAccessToken(accessToken);
    builder.setSessionKey(sessionKey);
    var uri = builder.build();
    if (DEBUG) console.log("Uri : "+uri);

    dConnect.removeEventListener(uri, null, function(errorCode, errorMessage){
        alert(errorMessage);
    });
    isDrawable = 0;
}

/**
 * Set M100 Parameter
 */
function doSetM100Parameter() {
    // add cookie
    if (DEBUG) console.log(document.M100ParamForm.elements[0].value);
    M100IpAddr = document.M100ParamForm.elements[0].value;
    document.cookie = "M100IpAddr=" + encodeURIComponent(M100IpAddr);
    if (DEBUG) console.log("length:"+document.cookie.length);
    if (DEBUG) console.log("cookie:"+document.cookie);
    M100DemoAuthorization();
}

/**
 * Set Parameter
 */
function doSetParameter() {
    // Check range.
    var errMsg = "Please check parameter.\n";
    var err = "";
    if (document.ParamForm.EiWarnupMin.value <= document.ParamForm.EiNormalMax.value) {
        err += "  Normal(Max) - Warm up(Min)\n";
    }
    if (document.ParamForm.EiFitnessMin.value <= document.ParamForm.EiWarnupMax.value) {
        err += "  Warm up(Max) - Fitness(Min)\n";
    }
    if (document.ParamForm.EiCardioMin.value <= document.ParamForm.EiFitnessMax.value) {
        err += "  Fitness(Max) - Cardio(Min)\n";
    }
    if (document.ParamForm.EiTrainingMin.value <= document.ParamForm.EiCardioMax.value) {
        err += "  Cardio(Max) - Training(Min)\n";
    }
    if (err != "") {
        alert(errMsg + err);
        return;
    }

    // add cookie
    M100EiNormalMin= document.ParamForm.elements[0].value;
    document.cookie = "M100EiNormalMin=" + encodeURIComponent(M100EiNormalMin);
    M100EiNormalMax = document.ParamForm.elements[1].value;
    document.cookie = "M100EiNormalMax=" + encodeURIComponent(M100EiNormalMax);
    M100EiNormalColor = document.ParamForm.elements[2].value;
    document.cookie = "M100EiNormalColor=" + encodeURIComponent(M100EiNormalColor);
    M100EiWarnupMin = document.ParamForm.elements[3].value;
    document.cookie = "M100EiWarnupMin=" + encodeURIComponent(M100EiWarnupMin);
    M100EiWarnupMax = document.ParamForm.elements[4].value;
    document.cookie = "M100EiWarnupMax=" + encodeURIComponent(M100EiWarnupMax);
    M100EiWarnupColor = document.ParamForm.elements[5].value;
    document.cookie = "M100EiWarnupColor=" + encodeURIComponent(M100EiWarnupColor);
    M100EiFitnessMin = document.ParamForm.elements[6].value;
    document.cookie = "M100EiFitnessMin=" + encodeURIComponent(M100EiFitnessMin);
    M100EiFitnessMax = document.ParamForm.elements[7].value;
    document.cookie = "M100EiFitnessMax=" + encodeURIComponent(M100EiFitnessMax);
    M100EiFitnessColor = document.ParamForm.elements[8].value;
    document.cookie = "M100EiFitnessColor=" + encodeURIComponent(M100EiFitnessColor);
    M100EiCardioMin = document.ParamForm.elements[9].value;
    document.cookie = "M100EiCardioMin=" + encodeURIComponent(M100EiCardioMin);
    M100EiCardioMax = document.ParamForm.elements[10].value;
    document.cookie = "M100EiCardioMax=" + encodeURIComponent(M100EiCardioMax);
    M100EiCardioColor = document.ParamForm.elements[11].value;
    document.cookie = "M100EiCardioColor=" + encodeURIComponent(M100EiCardioColor);
    M100EiTrainingMin = document.ParamForm.elements[12].value;
    document.cookie = "M100EiTrainingMin=" + encodeURIComponent(M100EiTrainingMin);
    M100EiTrainingMax = document.ParamForm.elements[13].value;
    document.cookie = "M100EiTrainingMax=" + encodeURIComponent(M100EiTrainingMax);
    M100EiTrainingColor = document.ParamForm.elements[14].value;
    document.cookie = "M100EiTrainingColor=" + encodeURIComponent(M100EiTrainingColor);

/*    confirm("Set Success.");*/
    alert("Set Success.");
}

/**
 * Start Heart Rate
 */
function doStartHeartRate() {

    if (timer == null) {
        searchM100();
    } else {
        alert("Already started.");
    }
}

function sendImageBinary(blob) {
    //バイナリ化した画像をPOSTで送る関数
    var formData = new FormData();
    
    formData.append('serviceId', M100ServiceID);
    formData.append('accessToken', M100DemoAccessToken);
    formData.append('filename', 'heartrate.png');
    formData.append('mimeType', 'image/png');
    formData.append('data', blob);

    $.ajax({
        type:'POST',
        url:'http://' + M100IpAddr + '/gotapi/canvas/drawimage',
        data:formData,
        contentType:false,
        processData:false,
        success:function(data, dataType) {
            console.log('success');
        },
        error:function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('error');
        }
    });
}

function canvasDraw(heartRate) {
    var canvas =  document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var orderText = "bpm";
    var heartText = " ♥";

    context.beginPath();
    context.clearRect(0, 0, height, width);

    // Set background color.
    if (heartRate >= M100EiNormalMin && heartRate <= M100EiNormalMax) {
        context.fillStyle = M100EiNormalColor;
    } else if (heartRate >= M100EiWarnupMin && heartRate <= M100EiWarnupMax) {
        context.fillStyle = M100EiWarnupColor;
    } else if (heartRate >= M100EiFitnessMin && heartRate <= M100EiFitnessMax) {
        context.fillStyle = M100EiFitnessColor;
    } else if (heartRate >= M100EiCardioMin && heartRate <= M100EiCardioMax) {
        context.fillStyle = M100EiCardioColor;
    } else if (heartRate >= M100EiTrainingMin && heartRate <= M100EiTrainingMax) {
        context.fillStyle = M100EiTrainingColor;
    } else {
        context.fillStyle = M100EiTrainingColor;
        context.fillStyle = '#0433ff'; 
    }

    // Canvas clear.
    context.fillRect(0, 0, height, width);
    context.stroke();
    context.restore();
    context.save();

    // Draw heart rate.
    context.beginPath();
    context.font = "18pt Arial";
    context.fillStyle = 'rgb(0, 0, 0)'; 
    if (heartRate < 100) {
        context.fillText(" " + heartRate, PosX+16, PosY+16);
    } else {
        context.fillText(heartRate, PosX+16, PosY+16);
    }
    context.fillText(orderText, PosX+60, PosY+16);
    context.fillStyle = 'rgb(255, 0, 0)'; 
    context.fillText(heartText, PosX+110, PosY+16);
    context.restore();
    context.save();

    // Get image binary data.
    canvas = $('#canvas')[0].toDataURL();
    var base64Data = canvas.split(',')[1],
    data = window.atob(base64Data),
    buff = new ArrayBuffer(data.length),
    arr = new Uint8Array(buff),
    blob, i, dataLen;
    
    //Create blob.
    for (i = 0, dataLen = data.length; i < dataLen; i++) {
        arr[i] = data.charCodeAt(i);
    }
    blob = new Blob([arr], {type: 'image/png'});
    sendImageBinary(blob);
}

/**
 * Get Local OAuth accesstoken.
 */
function M100DemoAuthorization(){
    var result = M100IpAddr.split(":");
    var ip = result[0];
    if (DEBUG) console.log("ip : " + ip);
    dConnect.setHost(ip);
    var scopes = Array("servicediscovery", "battery", "connect", "deviceorientation", "file_descriptor", "file", "media_player",
                    "mediastream_recording", "notification", "phone", "proximity", "settings", "vibration", "light",
                    "remote_controller", "drive_controller", "mhealth", "sphero", "dice", "temperature","camera", "canvas", "keyevent");
        dConnect.authorization('http://www.deviceconnect.org/demo/', scopes, 'サンプル',
            function(clientId, clientSecret, newAccessToken) {
                // Client ID
                M100DemoCurrentClientId = clientId;
                
                // accessToken
                M100DemoAccessToken = newAccessToken;
                
                // debug log
                console.log("accessToken:" + M100DemoAccessToken);

                // add cookie
                document.cookie = 'M100DemoAccessToken' + ip + '=' + encodeURIComponent(M100DemoAccessToken);

                if (dConnect.isConnectedWebSocket()) {
                    dConnect.disconnectWebSocket();
                }
                dConnect.connectWebSocket(clientId, function(errorCode, errorMessage) {});

        },
        function(errorCode, errorMessage) {
              alert("Failed to get accessToken.");
        });
}

/**
 * Search of M100.
 */
function searchM100() {

    var result = M100IpAddr.split(":");
    var ip = result[0];
    if (DEBUG) console.log("ip : " + ip);
    dConnect.setHost(ip);
    dConnect.discoverDevices(M100DemoAccessToken, function(obj){
        if(DEBUG) console.log("response: ", obj);

        for (var i = 0; i < obj.services.length; i++) {
            if(obj.services[i].name == "Host") {
                M100ServiceID = obj.services[i].id;
                if(DEBUG) console.log('M100ServiceID:' + M100ServiceID);
                if(DEBUG) console.log('M100DemoCurrentClientId:' + M100DemoCurrentClientId);

                isDrawable = 1;
//                doHeartRateRegist(M100ServiceID, M100DemoCurrentClientId);
//                canvasDraw();
//                timer = setInterval('canvasDraw()', updateInterval);
                timer = setInterval('debugDrawProcess()', updateInterval);
                break;
            }
        }
    }, function(readyState, status) {
    });
}

function debugDrawProcess() {
    canvasDraw(counter)
    if (counter++ > 160) {
        counter = 40;
    }
}

function stopInterval() {
/*    doHeartRateUnregist(M100ServiceId, M100DemoCurrentClientId);*/
    clearInterval(timer);
    timer = null;
}