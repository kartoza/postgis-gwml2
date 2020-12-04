
/** This check validation for ground surface and top of borehole
 */
$.validator.addMethod(
    "groundSurfaceValidation",
    function (value, element) {
        const wellElevation = getTopGroundSurfaceWell('m')
        const top_borehole = wellElevation['top_borehole'];
        const ground_surface = wellElevation['ground_surface'];
        if (top_borehole !== null && ground_surface !== null) {
            return ground_surface <= top_borehole
        }
        return true;
    },
    "Ground surface elevation is more than Top borehole elevation"
);
/** This check validation for top and bottom depth
 */
$.validator.addMethod(
    "bottomDepthValidation",
    function (value, element) {
        const $row = $(element).closest('tr');
        if ($row.length === 0) {
            return true
        }
        const $topDepth = $row.find('#id_top_depth_id');
        const $bottomDepth = $row.find('#id_bottom_depth_id');
        const topDepth = getQuantityInputValue($topDepth.closest('.quantity-input'), 'm');
        const bottomDepth = getQuantityInputValue($bottomDepth.closest('.quantity-input'), 'm');
        if (topDepth !== null && bottomDepth !== null) {
            return bottomDepth >= topDepth
        }
        return true;
    },
    "Top depth is more than bottom depth"
);


$('#form').validate({
    errorElement: 'div',
    /** Handle event when there is invalid event
     */
    rules: {
        ground_surface_elevation_value: {
            groundSurfaceValidation: true
        },
        top_depth_value: {
            bottomDepthValidation: true
        }
    },
    invalidHandler: function (event, validator) {
        $('.navigation a').removeClass('error')
        if (validator.invalid) {
            setTimeout(function () {
                $('div.error:visible').each(function () {
                    $("a[href$='#" + $(this).closest('.page-section').attr('id') + "']").addClass('error')
                })
            }, 100);
        }
    },
    /** Submit form
     */
    submitHandler: function (form, event) {
        $('.navigation a').removeClass('error')
        event.preventDefault();
        $('#form-submit').attr("disabled", true);
        let data = {}
        $.each(submitFunctions, function (form, value) {
            data[form] = value();
        });
        var formData = new FormData();
        $('input[type="file"]').each(function () {
            let file = $(this).get(0).files[0];
            if (file) {
                formData.append(file.name, file);
            }
        });
        formData.append('data', JSON.stringify(data));
        $.ajax({
            url: window.location,
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr, settings) {
                if (!/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", $(this).find('*[name=csrfmiddlewaretoken]').val());
                }
            },
            success: function (data) {
                window.location.href = data;
            },
            error: function (error) {
                $('#form-submit').attr("disabled", false);
                alert(error['responseText'])
            },
            data: formData
        });
    }
});