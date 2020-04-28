/**
 * @description 分页配置信息
 */

const appConfig = require("../config/appConfig.js");

/**
 * @class pageModel
 * @description 分页信息
 */
class pageModel {
    /**
     * @param {Number} totalCount 总数
     * @param {Number} pageIndex 页码
     */
    constructor(totalCount, pageIndex) {
        this.totalCount = totalCount;
        this.pageIndex = pageIndex;
        // 总的页数
        this.pageCount = Math.ceil(this.totalCount / appConfig.pageSize);
        // 页码过多手动指定开始与结束
        this.pageStart = this.pageIndex - 4 > 1 ? this.pageIndex - 4 : 1;
        this.pageEnd = this.pageStart + 9 < this.pageCount ? this.pageStart + 9 : this.pageCount;
    }
}

module.exports = pageModel;