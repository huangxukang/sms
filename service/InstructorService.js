/**
 * @description 数据表instructor相关操作配置信息
 */

const BaseService = require("./BaseService.js");

/**
 * @class InstructorService 数据表instructorinfo的数据操作
 * @extends BaseService 继承基础Service
 */

class InstructorService extends BaseService {
    constructor() {
        super("instructor");
    }

    /**
     * @name checkInstructorname 检测辅导员是否存在
     * @param {string} dname 需要检测的辅导员
     * @returns {boolean} true为存在，false为不存在
     */
    async checkInstructorname(instructorname) {
        let strSql = super.createCountSql(" and instructorname=? ");
        let result = await this.executeSql(strSql, [instructorname]);
        if (result[0].totalCount > 0) {
            //存在
            return true;
        } else {
            //不存在
            return false;
        }
    }

    /**
     * @name addInstructor 新增辅导员信息
     * @returns {Promise} 返回executeSql执行的Promise
     */
    addInstructor({
        instructorid,
        instructorname,
        instructorsex,
        instructortel,
        instructoremail,
        instructorIDCard
    }) {
        let strSql = `insert into ${this.tableName} (instructorid,instructorname, instructorsex, instructortel,instructoremail,instructorIDCard) values (?,?,?,?,?,?)`;
        return this.executeSql(strSql, [instructorid, instructorname, instructorsex, instructortel, instructoremail, instructorIDCard]);
    }

    /**
     * @name deleteByInstructorid 根据辅导员号删除辅导员信息
     * @param {Array} cksValue 要删除的辅导员号
     * @returns {boolean} true代表删除成功,false代表删除失败
     */
    async deleteByInstructorid(cksValue) {
        let cksValueString = cksValue.join("','");
        let strSql = `update ${this.tableName} set isDel=true where instructorid in ('${cksValueString}')`;
        let result = await this.executeSql(strSql);
        if (result.affectedRows > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @name findByInstructorid 根据辅导员编号查询辅导员信息
     * @param {string} Instructorid 辅导员的编号
     * @returns {Promise} executeSql执行的结果
     */
    findByInstructorid(instructorid) {
        let strSql = `select * from ${this.tableName} where isDel=false and instructorid = ? `;
        return this.executeSql(strSql, [instructorid]);
    }

    /**
     * @name editInstructorByInstructorid 根据辅导员编号编辑辅导员信息
     * @returns {boolean} true代表编辑成功 false代表编辑失败
     */
    async editInstructorByInstructorid({
        instructorname,
        instructorsex,
        instructortel,
        instructoremail,
        instructorIDCard,
        instructorid
    }) {
        let strSql = `UPDATE sms.departmentinfo SET instructorname=?, instructorsex=?, instructortel=?, instructoremail=?, instructorIDCard=? WHERE instructorid=?`;
        let result = await this.executeSql(strSql, [instructorname, instructorsex, instructortel, instructoremail, instructorIDCard, instructorid]);
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
    exportToExcel() {
        let strSql = `select * from instructor where isDel=false`;
        return this.executeSql(strSql);
    }

}

module.exports = InstructorService;