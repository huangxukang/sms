/**
 * @description 数据表stuinfo的相关操作配置信息
 */

const BaseService = require("./BaseService.js");

/**
 * @class StuInfoService 数据表stuinfo的数据操作
 * @extends BaseService 继承基础Service
 */
class StuInfoService extends BaseService {
    constructor() {
        super("stuinfo");
    }

    /**
     * @name getListByPage 分页查询方法
     * @returns {Promise} 返回executeSql 执行的Promise
     */
    getListByPage({
        sid,
        sname,
        ssex,
        cid,
        pageIndex
    } = {}) {
        // 默认情况下，pageIndex不会有值
        pageIndex = pageIndex || 1;
        let strWhere = "";
        if (sid) {
            // 学号有值，%模糊查询
            strWhere += " and stuinfo.sid like '%" + sid + "%'";
        }
        if (sname) {
            strWhere += " and stuinfo.sname like '%" + sname + "%'";
        }
        if (ssex) {
            strWhere += " and stuinfo.ssex='" + ssex + "'";
        }
        if (cid) {
            strWhere += " and stuinfo.cid='" + cid + "'";
        }
        let strSql = `SELECT stuinfo.*,classinfo.cname FROM stuinfo INNER JOIN classinfo on stuinfo.cid=classinfo.cid where stuinfo.isDel=false ${strWhere} limit ?,?`;
        let countSql = this.createCountSql(strWhere);
        // 执行两条sql语句
        return this.executeSql(strSql + ";" + countSql, [(pageIndex - 1) * this.pageSize, this.pageSize]);
    }

    /**
     * @name checkSid 检测学号是否存在
     * @param {string} sid 需要检测的学号
     * @returns {boolean} true为存在，false为不存在
     */
    async checkSid(sid) {
        let strSql = super.createCountSql(" and sid=? ");
        // select count(*) `totalCount` from stuinfo where isDel =false and sid =?
        let result = await this.executeSql(strSql, [sid]);
        if (result[0].totalCount > 0) {
            //存在
            return true;
        } else {
            //不存在
            return false;
        }
    }

    /**
     * @name addStuInfo 新增学生信息
     * @returns {Promise} 返回executeSql执行的Promise
     */
    addStuInfo({
        sid,
        sname,
        ssex,
        sbirthday,
        snation,
        sIDCard,
        saddr,
        smail,
        stel,
        cid,
        sphoto
    }) {
        let strSql = `INSERT INTO ${this.tableName} (sid, sname, ssex, sbirthday, snation, sIDCard, saddr, smail, stel, cid,sphoto) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
        return this.executeSql(strSql, [sid, sname, ssex, sbirthday, snation, sIDCard, saddr, smail, stel, cid, sphoto]);
    }

    /**
     * @name deleteStuBySid 根据学号删除学生信息
     * @param {Array} cksValue 需要删除的学生id
     * @returns {Boolean} true删成功，false删除失败
     */
    async deleteStuBySid(cksValue) {
        let cksValueString = cksValue.join("','");
        // 将isDel改为true
        // update stuinfo set isDel=true where sid in('xxx','xxx','xxx')
        let strSql = `update ${this.tableName} set isDel=true where sid in('${cksValueString}')`;
        let result = await this.executeSql(strSql);
        if (result.affectedRows > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @name findBySid 根据学号查询学生信息
     * @param {string} sid 学生的学号
     * @returns {Promise} executeSql执行的结果
     */
    findBySid(sid) {
        let strSql = `select * from ${this.tableName} where isDel=false and sid = ? `;
        return this.executeSql(strSql, [sid]);
    }

    /**
     * @name editStuInfoBySid 根据学号编辑学生信息
     * @returns {boolean} true代表编辑成功 false代表编辑失败
     */
    async editStuInfoBySid({
        sname,
        ssex,
        sbirthday,
        snation,
        sIDCard,
        saddr,
        smail,
        stel,
        cid,
        sid
    }) {
        let strSql = `UPDATE sms.stuinfo SET sname=?, ssex=?, sbirthday=?, snation=?, sIDCard=?, saddr=?, smail=?, stel=?, cid=? WHERE sid=? `;
        let result = await this.executeSql(strSql, [sname, ssex, sbirthday, snation, sIDCard, saddr, smail, stel, cid, sid]);
        if (result.affectedRows > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @name exportToExcel 导出为Excel
     * @param {Promise} 返回executeSql执行的Promise
     */
    exportToExcel({
        sid,
        sname,
        ssex,
        cid
    } = {}) {
        let strWhere = "";
        if (sid) {
            strWhere += " and stuinfo.sid like '%" + sid + "%'";
        }
        if (sname) {
            strWhere += " and stuinfo.sname like '%" + sname + "%'";
        }
        if (ssex) {
            strWhere += " and stuinfo.ssex='" + ssex + "'";
        }
        if (cid) {
            strWhere += " and stuinfo.cid='" + cid + "'";
        }
        let strSql = `SELECT stuinfo.*,classinfo.cname FROM stuinfo INNER JOIN classinfo on stuinfo.cid=classinfo.cid where stuinfo.isDel=false ${strWhere}`;
        return this.executeSql(strSql);
    }

}

module.exports = StuInfoService;