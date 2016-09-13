/**
 demo.js
 Copyright (c) 2014 NTT DOCOMO,INC.
 Released under the MIT license
 http://opensource.org/licenses/mit-license.php
 */

/** Revision of this apps. */
var versionRev = 'V2.0.0 Rev.10';
/** Client ID. */
var currentClientId = null;
/** AccessTonen. */
var accessToken = null;
/** IPアドレスを保持する. */
var ip;
/** 削除モード. */
var deleteMode = false;
/** 画像読み込み中Flag. */
var loadFlag = false;

/** Logメッセージを表示 */
var DEBUG = true;
/** デバイス名をキャッシュ */
var myDeviceName = '';
/** サービス一覧のキャッシュ. */
var cachedServices = [];

/**
 * 初期化処理.
 */
function init() {
  currentClientId = Math.random().toString(36).slice(-8);

  // Versionを表示
  $('#version').html(versionRev);

  // 接続先ipアドレスを取得(指定がない場合は、localhost)
  ip = getIpString();

  // accessTokenをcookieから取得
  accessToken = getCookie('accessToken' + ip);

  // 接続先IPアドレスをページに表示
  $('#host').html('connecting:' + ip);

  // Tokenをページに表示
  $('#token').html('accessToken:' + accessToken);

  if (isAndroid() &&
    location.href.indexOf('file:///') == -1) {
      dConnect.setAntiSpoofing(true);
  }
  dConnect.setHost(ip);
  dConnect.setSSLEnabled(location.protocol === 'https:');
  openWebsocketIfNeeded();
  searchDevice();
}

/**
 * ユーザエージェントがAndroidであることを確認する.
 */
function isAndroid() {
  var userAgent = window.navigator.userAgent.toLowerCase();
  return (userAgent.indexOf('android') != -1);
}

/**
 * Device Connect Managerを起動後、デモ画面に遷移する.
 */
function startManagerAndDemo() {
  $(window).trigger("hashchange");

  startManager(function(apiVersion) {
    if (DEBUG) {
      console.log('Manager has been available already. version=' + apiVersion);
    }
    openWebsocketIfNeeded();
    location.hash = "";
    location.hash = '#demo';
    if (DEBUG) {
      console.log('URL: ' + location.href);
    }
  });
}

function openWebsocketIfNeeded() {
  if (!dConnect.isWebSocketReady()) {
    if (dConnect.isConnectedWebSocket()) {
      dConnect.disconnectWebSocket();
    }
    dConnect.connectWebSocket(accessToken, function(code, message) {
      if (code >= 2) {
        console.error('Received websocket error: ' + code + ' - ' + message);
      } else {
        console.log('Received websocket event: ' + code + ' - ' + message);
      }
    });
    console.log('WebSocket opened.');
  } else {
    console.log('WebSocket is ready.');
  }
}

/**
 * Device Connect Managerが起動していることを確認する.
 */
function checkDeviceConnect() {
  startManager(function(apiVersion) {
    alert('Device Connect API version:' + apiVersion);
  });
}

/**
 * Device Connect Managerが起動していることを確認する.
 * @param {function} onavailable
 *                すでに起動していた場合、または起動された場合に呼ばれる関数
 */
function startManager(onavailable) {
  var requested = false;
  var appId = '994422987';
  var errorCallback = function(errorCode, errorMessage) {
    switch (errorCode) {
      case dConnect.constants.ErrorCode.ACCESS_FAILED:
        if (!requested) {
          requested = true;
          dConnect.startManager();
          alert('Requested to start Device Connect Manager.');

          var userAgent = navigator.userAgent.toLowerCase();
          if (userAgent.search(/iphone|ipad|ipod/) > -1) {
            setTimeout(function() {
              location.href = 'itmss://itunes.apple.com/us/app/devicewebapibrowser/id' +
                      appId + '?mt=8&ign-mpt=uo%3D4';
            }, 250);
          }
        }
        setTimeout(function() {
          dConnect.checkDeviceConnect(onavailable, errorCallback);
        }, 500);
        break;
      case dConnect.constants.ErrorCode.INVALID_SERVER:
        alert('WARNING: Device Connect Manager may be spoofed.');
        break;
      case dConnect.constants.ErrorCode.INVALID_ORIGIN:
        alert('WARNING: Origin of this app is invalid. Maybe the origin is not registered in whitelist.');
        break;
      default:
        alert(errorMessage);
        break;
    }
  };

  dConnect.checkDeviceConnect(onavailable, errorCallback);
}

/**
 * Local OAuthのアクセストークンを取得する.
 */
function authorization(callback, oncalcel) {
  var scopes = Array('servicediscovery', 'serviceinformation', 'system',
              'battery', 'connect', 'deviceorientation', 'filedescriptor',
              'file', 'mediaplayer', 'mediastreamrecording', 'notification',
              'phone', 'proximity', 'settings', 'vibration', 'light',
              'remotecontroller', 'drivecontroller', 'mhealth', 'sphero',
              'dice', 'temperature', 'camera', 'canvas', 'health',
              'touch', 'humandetect', 'keyevent', 'omnidirectionalimage',
               'tv', 'powermeter','humidity','illuminance', 'videochat',
               'airconditioner','gpio');
  dConnect.authorization(scopes, 'Demo Web Site',
      function(clientId, newAccessToken) {
        // Client ID
        currentClientId = clientId;

        // accessToken
        accessToken = newAccessToken;

        // debug log
        console.log('accessToken:' + accessToken);

        // add cookie
        document.cookie = 'accessToken' + ip + '=' + accessToken;

        if (dConnect.isConnectedWebSocket()) {
          dConnect.disconnectWebSocket();
        }
        dConnect.connectWebSocket(accessToken, function(code, message) {
          console.log("WebSocket. [code: " + code + ", message: " + message + "]");
        });

        // rewrite html
        $('#token').html('accessToken:' + accessToken);
        if (callback) {
          callback();
        }
      },
      function(errorCode, errorMessage) {
        if (confirm('Failed to get accessToken. Do you try again?')) {
          if (callback) {
            callback();
          }
        } else {
          if (oncalcel) {
            oncalcel();
          }
        }
      });
}

/**
 * 本アプリからリモートアクセスする端末のIPアドレス指定を取得する.
 */
function getIpString() {
  if (1 < document.location.search.length) {
    var query = document.location.search.substring(1);
    var parameters = query.split('&');
    for (var i = 0; i < parameters.length; i++) {
      var element = parameters[i].split('=');
      var paramName = decodeURIComponent(element[0]);
      var paramValue = decodeURIComponent(element[1]);
      if (paramName == 'ip') {
        return paramValue;
      }
    }
  }
  return 'localhost';
}

/**
 * Cookieに保存していた値を取得する.
 *
 * @param {String} name Cookie名
 */
function getCookie(name) {
  var result = null;
  var cookieName = name + '=';
  var allcookies = document.cookie;
  var position = allcookies.indexOf(cookieName);
  if (position != -1) {
    var startIndex = position + cookieName.length;
    var endIndex = allcookies.indexOf(';', startIndex);
    if (endIndex == -1) {
      endIndex = allcookies.length;
    }
    result = decodeURIComponent(allcookies.substring(startIndex, endIndex));
  }
  return result;
}

/**
 * 文字列を比較(大小文字の違いがあっても一致とみなす).
 * 
 * @param {String} string 比較する文字列
 * @param {String} cmpString 比較される文字列
 * 
 * @return 0以外 一致する
 * @return 0 一致しない
 * 
 */
function isEqualToStringIgnoreCase(string, cmpString) {
  return string.toLowerCase() == cmpString.toLowerCase();
}

/**
 * プロファイルごとの分岐.
 *
 * @param {String} serviceId サービスID
 * @param {String} profile プロファイル名
 */
function searchProfile(serviceId, profile) {
  if (isEqualToStringIgnoreCase(profile, dConnect.constants.notification.PROFILE_NAME)) {
    showNotification(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, dConnect.constants.vibration.PROFILE_NAME)) {
    showVibration(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, dConnect.constants.media_stream_recording.PROFILE_NAME)) {
    showMediastreamRecording(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, dConnect.constants.device_orientation.PROFILE_NAME)) {
    showDeviceOrientation(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, 'drivecontroller')) {
    showDriveController(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, 'remotecontroller')) {
    showRemoteController(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, dConnect.constants.file.PROFILE_NAME)) {
    showFile(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, dConnect.constants.file_descriptor.PROFILE_NAME)) {
    showFileDescriptor(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, 'light')) {
    showSearchLight(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, dConnect.constants.phone.PROFILE_NAME)) {
    showPhone(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, dConnect.constants.connect.PROFILE_NAME)) {
    showConnect(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, dConnect.constants.settings.PROFILE_NAME)) {
    showSetting(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, dConnect.constants.media_player.PROFILE_NAME)) {
    showMediaPlayer(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, dConnect.constants.battery.PROFILE_NAME)) {
    showBattery(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, 'camera')) {
    showCamera(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, 'dice')) {
    showDice(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, 'mhealth')) {
    showMhealth(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, 'temperature')) {
    showTemperature(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, dConnect.constants.proximity.PROFILE_NAME)) {
    showProximity(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, 'sphero')) {
    showSphero(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, dConnect.constants.canvas.PROFILE_NAME)) {
    showCanvas(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, 'health')) {
    showHealth(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, dConnect.constants.touch.PROFILE_NAME)) {
    showTouch(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, 'humandetect')) {
    showHumanDetect(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, dConnect.constants.keyevent.PROFILE_NAME)) {
    showKeyEvent(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, 'videochat')) {
    showVideoChat(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, 'omnidirectionalimage')) {
    showOmnidirectionalImage(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, dConnect.constants.serviceinformation.PROFILE_NAME)) {
    showServiceInformation(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, 'humidity')) {
    showHumidity(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, 'illuminance')) {
    showIlluminance(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, 'powermeter')) {
    showPowerMeter(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, 'tv')) {
    showTV(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, 'airconditioner')) {
    showAirConditioner(serviceId);
  } else if (isEqualToStringIgnoreCase(profile, 'gpio')) {
    showGPIO(serviceId);
  }
}
