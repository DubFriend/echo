var $view = $('#view'),
    text = echo.new({ $control: $('input[type="text"]'), $view: $('#text-view') }),
    textarea = echo.new({
        $control: $('textarea'),
        $view: $('#textarea-view'),
        render: function (data) {
            return data ? data.length : "";
        }
    }),
    radio = echo.new({ $control: $('input[type="radio"]'), $view: $('#radio-view') }),
    check = echo.new({ $control: $('input[type="checkbox"]'), $view : $('#checkbox-view') }),
    select = echo.new({ $control: $('select[name="fruit"]'), $view: $('#select-view') }),

    collection = echo.collection({
        data: {
            title: 'Values',
            items: [ text, textarea, radio, check, select ]
        },
        template: '' +
        '<h3>{{title}}</h3>' +
        '<ol>' +
            '{{#items}}<li>{{.}}</li>{{/items}}' +
        '</ol>',
        $view: $('#template-view')
    });
