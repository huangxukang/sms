/**
 * @description 操作Excel文件配置信息
 */

const xlsx = require("node-xlsx");
const fs = require("fs");

/**
 * @class ExcelUtil 操作Excel文件
 */
class ExcelUtil {
    constructor() {
        throw new Error("当前对象不允许new调用");
    }

    /**
     * @name resultToExcel 导出为excel文件
     * @param {Array} result 生成的excel数据
     * @param {string} excelPath 保存excel文件的位置
     */
    static resultToExcel(result, excelPath) {
        if (result instanceof Array && result.length > 0) {
            let excelData = [];
            // 构建表头的数组
            excelData.push(Object.keys(result[0]));
            //构建Excel所需的数据
            result.forEach(item => {
                let values = Object.values(item);
                excelData.push(values);
            });
            let excelBuffer = xlsx.build([{
                name: "Sheet1",
                data: excelData
            }]);
            fs.writeFileSync(excelPath, excelBuffer);
        } else {
            throw new Error("要导出的数组必须是数组必须是数组，且不能为空");
        }
    }

}

module.exports = ExcelUtil;