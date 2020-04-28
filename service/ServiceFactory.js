/**
 * @description Service工厂类，工厂模式创建Service配置信息
 */

class ServiceFactory {
  constructor() {
    // 静态方法
    throw new Error("当前对象不允许使用new来创建");
  }

  /**
   * 创建管理员信息模块AdminInfoService
   */
  static createAdminInfoService() {
    let AdminInfoService = require("./AdminInfoService");
    return new AdminInfoService();
  }

  /**
   * 创建学生信息模块StuInfoService
   */
  static createStuInfoService() {
    let StuInfoService = require("./StuInfoService");
    return new StuInfoService();
  }

  /**
   * 创建班级信息模块ClassInfoService
   */
  static createClassInfoService() {
    let ClassInfoService = require("./ClassInfoService");
    return new ClassInfoService();
  }


  /**
   * 创建院系信息模块DepartmentInfoService
   */
  static createDepartmentInfoService() {
    let DepartmentInfoService = require("./DepartmentInfoService");
    return new DepartmentInfoService();
  }

  /**
   * 创建辅导员信息模块InstructorService
   */
  static createInstructorService() {
    let InstructorService = require("./InstructorService");
    return new InstructorService();
  }

}

module.exports = ServiceFactory;