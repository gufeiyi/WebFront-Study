// 这个模块主要获取的是品牌管理的数据

import request from '@/utils/request';

// 获取品牌列表接口
export const reqTradeMarkList = (page,limit)=>request({
    url:`/admin/product/baseTrademark/${page}/${limit}`,
    method:'get'
});

// 处理添加品牌
// 新增品牌 ：/admin/product/baseTrademark/save     post    携带两个参数：品牌名称，品牌Logo

// 处理修改品牌
// 修改品牌：/admin/product/baseTrademark/update      put     携带三个参数：id、品牌名称、品牌Logo

export const reqAddUpdateTradeMark = (trademark)=>{
    // 修改
    if(trademark.id){
        return request({
            url:'/admin/product/baseTrademark/update ',
            method:'put',
            data:trademark
        });
    }else{
        return request({
            // 新增品牌
            url:'/admin/product/baseTrademark/save',
            method:'post',
            data:trademark
        });
    }
};

// 删除品牌
// /admin/product/baseTrademark/remove/{id}     delete
export const reqDeleteTradeMark = (id)=>request({
    url:`/admin/product/baseTrademark/remove/${id}`,
    method:'delete'
});