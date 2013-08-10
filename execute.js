var $view = $('#view'),
    text = echo.new({ $control: $('input[type="text"]'), $view: $('#text-view') }),
    textarea = echo.new({
        $control: $('textarea'),
        $view: $('#textarea-view'),
        render: function (data) {
            return data.length || "";
        }
    }),
    radio = echo.new({ $control: $('input[type="radio"]'), $view: $('#radio-view') }),
    check = echo.new({ $control: $('input[type="checkbox"]'), $view : $('#checkbox-view') }),
    select = echo.new({ $control: $('select[name="fruit"]'), $view: $('#select-view') }),

    collection = echo.collection({
        data: {
            title: 'Echo : auto-dynamic templating.',
            text: text
        },
        template: '<h2>{{title}}</h2><h3>{{text}}</h3>',
        $view: $('#template-view')
    });
