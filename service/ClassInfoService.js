/**
 * @description 数据表classinfo相关操作配置信息
 */

const BaseService = require("./BaseService.js");

/**
 * @class ClassInfoService 数据表classinfo的数据操作
 * @extends BaseService 继承基础Service
 */
class ClassInfoService extends BaseService {
    constructor() {
        super("classinfo");
    }

    /**
     * @name getListByPage 分页查询方法
     * @returns {Promise} 返回executeSql 执行的Primise
     */
    getListByPage({
        cname,
        instructorid,
        did,
        pageIndex
    } = {}) {
        // 默认情况下，pageIndex不会有值
        pageIndex = pageIndex || 1;
        let strWhere = "";
        if (cname) {
            strWhere += " and classinfo.cname like '%" + cname + "%'";
        }
        if (instructorid) {
            strWhere += " and classinfo.instructorid='" + instructorid + "'";
        }
        if (did) {
            strWhere += " and classinfo.did='" + did + "'";
        }
        let strSql = `SELECT classinfo.*,instructor.instructorname,departmentinfo.dname FROM classinfo INNER JOIN instructor on classinfo.instructorid=instructor.instructorid INNER JOIN departmentinfo on departmentinfo.did=classinfo.did where classinfo.isDel=false ${strWhere} limit ?,?`;
        let countSql = this.createCountSql(strWhere);
        // 执行两条sql语句
        return this.executeSql(strSql + ";" + countSql, [(pageIndex - 1) * this.pageSize, this.pageSize]);
    }

    /**
     * @name checkCname 检测班级编号是否存在
     * @param {string} cname 需要检测的班级编号
     * @returns {boolean} true为存在，false为不存在
     */
    async checkCname(cname) {
        let strSql = super.createCountSql(" and cname=? ");
        let result = await this.executeSql(strSql, [cname]);
        if (result[0].totalCount > 0) {
            //存在
            return true;
        } else {
            //不存在
            return false;
        }
    }

    /**
     * @name addClassInfo 新增班级信息
     * @returns {Promise} 返回executeSql执行的Promise
     */
    addClassInfo({
        cname,
        did,
        instructorid,
        maxCount
    }) {
        let strSql = `insert into ${this.tableName} (cname,did,instructorid,maxCount) values (?,?,?,?) `;
        return this.executeSql(strSql, [ cname, did, instructorid, maxCount]);
    }

    /**
     * @name deleteByCid 根据班级号删除班级信息
     * @param {Array} cksValue 要删除的班级号
     * @returns {boolean} true代表删除成功,false代表删除失败
     */
    async deleteByCid(cksValue) {
        let cksValueString = cksValue.join("','");
        let strSql = `update ${this.tableName} set isDel=true where cid in ('${cksValueString}')`;
        let result = await this.executeSql(strSql);
        if (result.affectedRows > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @name findByCid 根据班级编号号查询班级信息
     * @param {string} cid 班级的编号
     * @returns {Promise} executeSql执行的结果
     */
    findByCid(cid) {
        let strSql = `select * from ${this.tableName} where isDel=false and cid = ? `;
        return this.executeSql(strSql, [cid]);
    }

    /**
     * @name editStuInfoBySid 根据班级编号编辑班级信息
     * @returns {boolean} true代表编辑成功 false代表编辑失败
     */
    async editClassInfoByCid({
        cname,
        did,
        instructorid,
        maxCount,
        cid
    }) {
        let strSql = `UPDATE sms.classinfo SET cname=?, did=?, instructorid=?, maxCount=? WHERE cid=? `;
        let result = await this.executeSql(strSql, [cname, did, instructorid, maxCount,cid]);
        if (result.affectedRows > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @name exportToExcel 导出Excel
     * @returns {Promise} executeSql执行的结果
     */
    exportToExcel({
        cname,
        instructorid,
        did
    } = {}) {
        let strWhere = "";
        if (cname) {
            strWhere += " and classinfo.cname like '%" + cname + "%'";
        }
        if (instructorid) {
            strWhere += " and classinfo.instructorid='" + instructorid + "'";
        }
        if (did) {
            strWhere += " and classinfo.did='" + did + "'";
        }
        let strSql = `SELECT classinfo.*,instructor.instructorname,departmentinfo.dname FROM classinfo INNER JOIN instructor on classinfo.instructorid=instructor.instructorid INNER JOIN departmentinfo on departmentinfo.did=classinfo.did where classinfo.isDel=false ${strWhere}`;
        return this.executeSql(strSql);
    }

}

module.exports = ClassInfoService;