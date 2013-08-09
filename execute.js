var $view = $('#view'),
    text = echo({ $control: $('input[type="text"]'), $view: $('#text-view') }),
    textarea = echo({
        $control: $('textarea'),
        $view: $('#textarea-view'),
        getter: function (data) {
            return data.length;
        }
    }),
    radio = echo({ $control: $('input[type="radio"]'), $view: $('#radio-view') }),
    check = echo({ $control: $('input[type="checkbox"]'), $view : $('#checkbox-view') }),
    select = echo({ $control: $('select[name="fruit"]'), $view: $('#select-view') });
