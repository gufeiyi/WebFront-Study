import request from '@/utils/request';

// 获取SPU列表数据的接口
export const reqSpuList = (page,limit,category3Id)=>request({
    url:`/admin/product/${page}/${limit}`,
    method:'get',
    params:{
        category3Id
    }
});

// 获取SPU信息
export const reqSpu = (spuId)=>request({
    url:`/admin/product/getSpuById/${spuId}`,
    method:'get',
});

// 获取品牌的信息
export const reqTradeMarkList = ()=>request({
    url:`/admin/product/baseTrademark/getTrademarkList`,
    method:'get',
});

// 获取SPU图标的接口
export const reqSpuImageList = (spuId)=>request({
    url:`/admin/product/spuImageList/${spuId}`,
    method:'get',
});

// 获取平台全部销售属性
export const reqBaseSaleAttrList = ()=>request({
    url:`/admin/product/baseSaleAttrList`,
    method:'get',
});

// 修改SPU || 添加SPU：修改和添加spu，携带的参数大部分是一样的，唯一的区别是修改有id，添加没有id
export const reqAddOrUpdateSpu = (spuInfo)=>{
    // 修改SPU
    if(spuInfo.id){
        return request({
            url:'/admin/product/updateSpuInfo',
            method:'post',
            data:spuInfo,
        });
    }else{
        // 添加SPU
        return request({
            url:'/admin/product/saveSpuInfo',
            method:'post',
            data:spuInfo,
        });
    }
}

// 删除SPU
export const reqDeleteSpu = (spuId)=>request({
    url:`/admin/product/deleteSpu/${spuId}`,
    method:'delete',
});