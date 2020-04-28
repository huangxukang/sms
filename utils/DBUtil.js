/**
 * @description 数据库核心操作对象配置信息
 */

const mysql = require("mysql");
const dbConfig = require("../config/dbConfig.js");

/**
 * @class DBUtil
 * @description 数据库核心操作对象
 */
class DBUtil {
    
    /**
     * @name getConn 获取数据库连接
     * @returns {Object} conn数据库连接对象
     */
    getConn() {
        let conn = mysql.createConnection(dbConfig);
        conn.connect();
        return conn;
    }

    /**
     * @param {string} strSql 要执行的SQL语句
     * @param {Array} params  执行SQL语句的参数
     * @returns {Promise} 返回异步的promise
     */
    executeSql(strSql, params = []) {
        let promise = new Promise((resolve, reject) => {
            // 获取数据库的连接
            let conn = this.getConn();
            // 执行SQL语句
            conn.query(strSql, params, (err, result) => {
                if (err) {
                    // 执行失败，指catch
                    reject(err);
                } else {
                    // 执行成功继续操作，指then
                    resolve(result);
                }
                conn.end();
            })
        });
        return promise;
    }

}

module.exports = DBUtil;