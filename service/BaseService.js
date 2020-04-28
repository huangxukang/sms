/** 
 * @description 基础业务逻辑操作配置信息
 */

const DBUtil = require("../utils/DBUtil.js");
const appConfig = require("../config/appConfig.js");

/**
 * @class BaseService
 */
class BaseService extends DBUtil {
    /**
     * @param {string} tableName 数据表名称 
     */
    constructor(tableName) {
        super();
        this.tableName = tableName;
        this.pageSize = appConfig.pageSize; // 分页页容量
    }

    /**
     * @name getList 获取所有人员列表
     * @returns {promise} 返回executeSql执行的promise
     */
    getAllList() {
        let strSql = `select * from ${this.tableName} where isDel=false`;
        //返回的是一个promise
        return this.executeSql(strSql);
    }

    /**
     * @name createCountSql 生成count总数的SQL语句
     * @param {string}} strWhere 查询条件 
     * @returns {string} countSql 生成好的SQL语句
     */
    createCountSql(strWhere) {
        let countSql = `select count(*) 'totalCount' from ${this.tableName} where isDel=false ${strWhere}  `
        return countSql;
    }

}

module.exports = BaseService;