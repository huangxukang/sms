/**
 * @description 数据库配置信息
 */

let dbConfig = {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "123456",
    database: "sms",
    multipleStatements: true // 开启多条SQL语句执行
}

module.exports = dbConfig;