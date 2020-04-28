/**
 * @description 消息弹窗配置信息
 */

/**
 * @class MessageBox 消息弹窗
 */
class MessageBox {
   constructor() {
      throw new Error("当前对象不允许new调用");
   }

   /**
    * @name alertAndBack 弹窗消息并跳转到指定页面
    * @param {string} msg 弹出的消息
    * @param {string} url 跳转的页面
    * @param {*} resp Response对象
    */
   static alertAndRedirect(msg, url, resp) {
      resp.send(`<script>alert("${msg}");location.href="${url}";</script>`);
   }

   /**
    * @name alertAndBack 弹窗消息并返回
    * @param {string} msg 弹出的消息
    * @param {*} resp Response对象
    */
   static alertAndBack(msg, resp) {
      resp.send(`<script>alert("${msg}");history.back();</script>`);
   }
   
}

module.exports = MessageBox;