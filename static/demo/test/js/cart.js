define(function(require, exports, module){
    'use strict';
    var $shoppingCartCheck = $('.shoppingCart-check'),
        totalPrice = 0,
        $checkouBtn = $('.shoppC-checkou-btn'),
        $totalBtn = $('.top-titleNav-checkBox'),
        $shoppCheckoutText = $('.shoppC-checkout-text');

    $shoppingCartCheck.Bind('click',function (){
        var $this = $(this),
            $parent = $this.closest('.buyPay-bill-main'),
            $icon = $this.find('.shoppingCart-check-icon'),
            price = $parent.find('.buy-billMs-price').eq(0).find('span').text().split('.')[0]*1;
        if ($icon.data('checked')){
            $icon.hide();
            $icon.data('checked',false);
            totalPrice -= price;
        }else{
            $icon.show();
            $icon.data('checked',true);
            totalPrice += price;
        }
        checkOutUpdata();
    })

    $totalBtn.Bind('click',function (){
        var $this = $(this),
            price,
            $parents,
            $icon = $shoppingCartCheck.find('.shoppingCart-check-icon');
        if ($this.data('checked')){
            $this.removeClass('check-box-active');
            $icon.hide();
            $icon.data('checked',false);
            $this.data('checked',false);
            totalPrice = 0;
        }else{
            totalPrice = 0;
            $this.addClass('check-box-active');
            $icon.show();
            $icon.data('checked',true);
            $this.data('checked',true);
            for (var i = 0, len = $('.buyPay-bill-main').size(); i < len; i++){
                $parents = $icon.eq(0).closest('.buyPay-bill-main');
                price = $parents.find('.buy-billMs-price').eq(0).find('span').text().split('.')[0]*1;
                totalPrice += price;
            }
        }
        checkOutUpdata();
    })
    
    
    function checkOutUpdata(){
        $shoppCheckoutText.find('span').text(totalPrice);
        $checkouBtn.val('结算('+totalPrice+')元')
    }


})