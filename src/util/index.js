import moment from 'moment';
import Toast from '../components/prompt/toast';
import Dialog from '../components/dialog/index'
import * as Qiniu from 'qiniu-js';
import Fetch from '../middleware/fetch/fetch';
import * as __URL__ from '../../config/';

const createUrl = (request) => {
  let url = request.url;
  let param = request.param;
  let isExport = request.isExport;

  if (param) {
    if (!isExport) {
      url = !url.includes('?') && url + '?';
      for (let key of Object.keys(param)) {
        url = url + key + '=' + param[key] + '&';
      }
    } else {//列表导出接口不需要传pageSize&curPage
      for (let key of Object.keys(param)) {
        if (key === 'pageSize' || key === 'curPage') {
          continue;
        } else {
          url = url + key + '=' + param[key] + '&';
        }
      }
    }
    if (url.endsWith('&')) {
      url = url.substring(0, url.length - 1);
    }
  }
  return url;
};

const getUrlArg = (name) => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let arg = window.location.search.substr(1).match(reg);
  return arg ? arg[2] : '';
};
const getAuthUrl = () => {
    const ENV = process.env.CURRENT_ENV ;
    let authUrl = __URL__[ENV]['authUrl'];
    let apiUrl = __URL__[ENV]['apiUrl'];
    return authUrl + '?originUrl=' + apiUrl;
}
//判断字符串/数组/对象/不为空时返回true
const isNotNull = (obj) => {
  if (obj instanceof Object) {
    for (var a in obj) {
      return true;
    }
    return false;
  }
  return typeof(obj) != 'undefined' && obj !== null && (Array.isArray(obj) ? obj.length !== 0 : obj !== "");
};

//转标准日期
const fmtDate = (obj) => {
  var date = new Date(obj);
  var y = 1900 + date.getYear();
  var m = "0" + (date.getMonth() + 1);
  var d = "0" + date.getDate();
  return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
};

//毫秒数或中国标准时间转日期：
function msToDate(msec) {
  let datetime = new Date(msec);
  let year = datetime.getFullYear();
  let month = datetime.getMonth();
  let date = datetime.getDate();
  let hour = datetime.getHours();
  let minute = datetime.getMinutes();
  let second = datetime.getSeconds();
  let result1 = year +
    '-' +
    ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) +
    '-' +
    ((date + 1) < 10 ? '0' + date : date) +
    ' ' +
    ((hour + 1) < 10 ? '0' + hour : hour) +
    ':' +
    ((minute + 1) < 10 ? '0' + minute : minute) +
    ':' +
    ((second + 1) < 10 ? '0' + second : second);

  let result2 = year +
    '-' +
    ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) +
    '-' +
    ((date + 1) < 10 ? '0' + date : date);

  let result = {
    hasTime: result1,
    withoutTime: result2
  };
  return result;
}

//向data里面添加初始化（initalValue）值
const setInitialValue = (items, values) => {
  let initialValue = {};
  items && items.forEach((item) => {
    if (item.type === 'cascader') {
      setInitialValue(item.linkage, values);
    }
    let value = item.initialWorld ?(values && values[item.initialWorld]):(values && values[item.id]);
    let value1 = values && values[item.id];
    if (value === 0 || value) {
      if (item.type === 'datepicker') {
        value = moment(fmtDate(value), 'YYYY-MM-DD');
      } else if (item.type === 'switch') {
        value === 0 ? value = false : value = true;
      }
      item.initialValue = value;
      item.initialWorld ?initialValue[item.id] = value1:{};
    } else {
      item.initialValue = '';
    }
  });
    items.initialValue = initialValue;
};

/*
 *argus: object，里面包含参数
 *status
 *code
 *message
 *params: 当前列表搜索的参数值，fetch成功之后，无刷新更改浏览器URL
 *isShowDialog: 控制当code不等于-1、0的时候，是否显示Dialog，还是Toast
*/
const fetchCallback = (argus) => {
  const {nextProps,status, code, message, params, updateStatus, successCallback, isShowToastSuccess, successText, isShowDialog,isNotReplaceState} = argus;
  if (status) {
    updateStatus();

    if (code && code !== 0) {
      if (code >= 500) {
        Toast.show('服务器异常');
      } else if (code >= 400) {
        if (code == 404) {
          Toast.show('服务器找不到请求地址');
        } else if (code == 414) {
          Toast.show('请求的 URI（通常为网址）过长，服务器无法处理');
        } else {
          Toast.show('错误请求');
        }
      } else if (code >= 300) {
        Toast.show('网络异常');
      } else if (code == -1) {
        window.location.href = getAuthUrl();
      } else if (code === -2){
        if (nextProps){
          const {history,history:{location}} = nextProps
          history.push('/'+location.pathname.split('/')[1]+'/error')
        }
      }
      else {
        !isShowDialog ? Toast.show(message) : Dialog.open({
          message: message,
          dialogButton: [
            {
              text: '确定',
              type: 'primary',
              clickHandle: () => {
                Dialog.close();
              }
            }
          ]
        });
      }
    } else if (code === 0) {
      isShowToastSuccess ? Toast.show(successText || message) : null;

      if (params) {
        //获取列表数据成功之后，无刷新更新URL
        if(isNotReplaceState===true){
        }else {
          let url = createUrl({
            url: window.location.origin + window.location.pathname,
            param: params
          });
          window.history.replaceState({}, 0, url);
        }
      }

      successCallback && successCallback();
    }
  }
};

const getCookie = (cookieName) => {
  let cookieStr = decodeURI(document.cookie);
  let arr = cookieStr.split("; ");
  let cookieValue = '';
  for (let i = 0; i < arr.length; i++) {
    let temp = arr[i].split("=");
    if (temp[0] == cookieName) {
      cookieValue = temp[1];
      break;
    }
  }
  return decodeURI(cookieValue);
}




export {
  createUrl,
  getUrlArg,
  isNotNull,
  msToDate,
  fmtDate,
  setInitialValue,
  fetchCallback,
  getCookie,
  getAuthUrl
}