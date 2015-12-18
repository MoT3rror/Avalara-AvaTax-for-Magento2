define(
    [
        'jquery',
        'Magento_Checkout/js/model/step-navigator',
        'ClassyLlama_AvaTax/js/action/set-shipping-address',
        'ClassyLlama_AvaTax/js/view/updateAddress',
        'ClassyLlama_AvaTax/js/model/addressModel',
        'ClassyLlama_AvaTax/js/view/validationForm'
    ],
    function (
        $,
        stepNavigator,
        setShippingAddress,
        updateAddress,
        addressModel,
        validationForm
    ) {
        'use strict';

        return {
            options: {
                validateAddressContainerSelector: '#validate_address'
            },

            validationResponseHandler: function (response) {
                if (typeof response.extension_attributes !== 'undefined') {
                    $(this.options.validateAddressContainerSelector + ' *').fadeIn();
                    this.toggleAddressToUse();
                    updateAddress(response.extension_attributes.valid_address);
                    addressModel.originalAddress(response.extension_attributes.original_address);
                    addressModel.validAddress(response.extension_attributes.valid_address);
                    if (typeof response.extension_attributes.error_message !== 'undefined') {
                        addressModel.error(response.extension_attributes.error_message)
                    }
                    validationForm.fillValidateForm();
                    $(this.options.validateAddressContainerSelector + ' .instructions a').on('click', function () {
                        stepNavigator.navigateTo('shipping', 'shipping');
                    });
                } else {
                    $(this.options.validateAddressContainerSelector + ' *').hide();
                }
            },


            toggleAddressToUse: function () {
                $('input[name=addressToUse]:radio').on('change', function() {
                    var validSelected = $('#validAddress:checked').length ? true : false;
                    setShippingAddress(validSelected);
                });
            }
        };
    }
);
