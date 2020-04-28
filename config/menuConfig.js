/**
 * @description 菜单配置信息
 */

const menuConfig = [
    {
        text: "学生管理",
        id: "StuInfo",
        subMenu: [
            {
                text: "学生列表",
                href: "/StuInfo/List"
            },
            {
                text: "新增学生",
                href: "/StuInfo/addStuInfo"
            }
        ]
    },
    {
        text: "班级管理",
        id: "ClassInfo",
        subMenu: [
            {
                text: "班级列表",
                href: "/ClassInfo/List"
            },
            {
                text: "新增班级",
                href: "/ClassInfo/addClassInfo"
            }
        ]
    },
    {
        text: "院系管理",
        id: "DepartmentInfo",
        subMenu: [
            {
                text: "院系列表",
                href: "/DepartmentInfo/List"
            },
            {
                text: "新增院系",
                href: "/DepartmentInfo/addDepartmentInfo"
            }
        ]
    },
    {
        text: "辅导员管理",
        id: "Instructor",
        subMenu: [
            {
                text: "辅导员列表",
                href: "/Instructor/List"
            },
            {
                text: "新增辅导员",
                href: "/Instructor/addInstructor"
            }
        ]
    },
    {
        text: "管理员管理",
        id: "AdminInfo",
        subMenu: [
            {
                text: "管理员列表",
                href: "/AdminInfo/List"
            },
            {
                text: "新增管理员",
                href: "/AdminInfo/addAdminInfo"
            }
        ]
    }
];

module.exports = menuConfig;