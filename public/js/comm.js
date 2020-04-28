$(function(){
    // 全选按钮
    $("[data-toggle='ckAll']").click(function(){
        //先获取选择器
        var selector = $(this).attr("data-target");
        var flag = $(this).prop("checked");
        $(selector).prop("checked",flag);
    })
})