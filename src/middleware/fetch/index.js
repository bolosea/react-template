/*
 *action参数
 **type---redux，将要执行的动作
 **playload---普通对象，存在ajax请求的参数
 **playload参数
 ***url-----------ajax请求的地址
 ***type----------ajax请求类型
 ***contentType---ajax请求的"content-type"
 ***param---------ajax请求参数
*/
import Fetch from './fetch';
import * as types from './index.types';

export default ({dispatch, getState}) => (next) => async (action) => {
  //通过playload里面的URL是否存在，存在就执行fetch，否则执行下一个中间件
  if (action.playload && action.playload.url) {
    let {type, playload} = action;

    dispatch({
      type: types.SHOWLODING,
      spinning: true
    });

    try {
      let result = await Fetch(playload);

      //关闭加载器
      dispatch({
        type: types.SHOWLODING,
        spinning: false
      });
      
      //成功之后
      if (result && result.code === 0) {
        dispatch({
          type: type,
          playload: {
            data: result.result.data,
            message: result.msg,
            code: result.code,
            page: result.result.page
          }
        })
      } else { //失败
        dispatch({
          type: `${type}_FAIL`,
          playload: {
            message: result.msg,
            code: result.code
          }
        });
      }
    } catch (err) {
      console.log(`fetch catch:${err}`);
      //关闭加载器
      dispatch({
        type: types.SHOWLODING,
        spinning: false
      });

      //网络异常、404等
      dispatch({
        type:  `${type}_FAIL`,
        playload: {
          code: err.res.status
        }
      });
    }
  } else {
    return next(action)
  }
}
