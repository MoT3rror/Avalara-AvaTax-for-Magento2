define(
    [
        'jquery',
        'Magento_Checkout/js/model/quote',
        'Magento_Checkout/js/model/resource-url-manager',
        'mage/storage',
        'Magento_Checkout/js/model/payment-service',
        'Magento_Checkout/js/model/payment/method-converter',
        'Magento_Checkout/js/model/error-processor',
        'Magento_Checkout/js/model/full-screen-loader',
        'Magento_Checkout/js/action/select-billing-address',
        'ClassyLlama_AvaTax/js/view/checkout-validation-handler',
        'Magento_Ui/js/modal/alert'
    ],
    function (
        $,
        quote,
        resourceUrlManager,
        storage,
        paymentService,
        methodConverter,
        errorProcessor,
        fullScreenLoader,
        selectBillingAddressAction,
        checkoutValidationHandler,
        alert
    ) {
        'use strict';

        return {
            saveShippingInformation: function () {
                var payload;

                if (!quote.billingAddress()) {
                    selectBillingAddressAction(quote.shippingAddress());
                }

                payload = {
                    addressInformation: {
                        shipping_address: quote.shippingAddress(),
                        billing_address: quote.billingAddress(),
                        shipping_method_code: quote.shippingMethod().method_code,
                        shipping_carrier_code: quote.shippingMethod().carrier_code
                    }
                };

                fullScreenLoader.startLoader();

                return storage.post(
                    resourceUrlManager.getUrlForSetShippingInformation(quote),
                    JSON.stringify(payload)
                ).done(
                    function (response) {
                        quote.setTotals(response.totals);
                        paymentService.setPaymentMethods(methodConverter(response.payment_methods));
                        // Begin Edit
                        checkoutValidationHandler.validationResponseHandler(response);
                        // End Edit
                        fullScreenLoader.stopLoader();
                    }
                ).fail(
                    function (response) {
                        // Begin Edit - Native error message display is not obvious enough, so add to an alert box
                        var messageObject = JSON.parse(response.responseText);
                        alert({
                            title: $.mage.__('Error'),
                            content: messageObject.message
                        });
                        //errorProcessor.process(response);
                        // End Edit
                        fullScreenLoader.stopLoader();
                    }
                );
            }
        };
    }
);