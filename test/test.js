var $control, $view, echoObject;

var setup = function (fig) {
    $('#qunit-fixture').html(fig.html + '<div id="view"></div>');
    $control = $(fig.control);
    $view = $('#view');
    echoObject = echo({ $control: $control, $view: $view });
};

var testUpdatesOnManual = function () {
    echoObject.set("foo");
    deepEqual(echoObject.get(), "foo", "model is set");
    deepEqual($view.html(), "foo", "view is updated");
};


module("text input", {
    setup: function () {
        setup({
            html: '<input id="textbox" type="text">',
            control: '#textbox'
        });
    }
});

test("updates view on manual model set", testUpdatesOnManual);

test("updates model and view on keyup", function () {
    $control.val("foo");
    $control.trigger($.Event("keyup"));
    deepEqual(echoObject.get(), "foo", "model is updated");
    deepEqual($view.html(), "foo", "view is updated");
});


module("textarea", {
    setup: function () {
        setup({
            html: '<textarea id="textarea"></textarea>',
            control: '#textarea'
        });
    }
});

test("updates view on manual model set", testUpdatesOnManual);

test("updates model and view on keyup", function () {
    $control.val("foo");
    $control.trigger($.Event("keyup"));
    deepEqual(echoObject.get(), 'foo', "model is updated");
    deepEqual($view.html(), 'foo', "view is updated");
});


module("radio", {
    setup: function () {
        setup({
            html: '<input type="radio" name="sex" value="male">' +
                  '<input type="radio" name="sex" value="female">',
            control: 'input[name="sex"]'
        });
    }
});

test("updates view on manual model set", testUpdatesOnManual);

test('updates model and view on click', function () {
    $('input[value="male"]').prop('checked', true);
    $control.filter(':checked').trigger($.Event('change'));
    deepEqual(echoObject.get(), 'male', 'model is updated');
    deepEqual($view.html(), 'male', 'view is updated');
});



module('checkbox', {
    setup: function () {
        setup({
            html: '<input type="checkbox" name="vehicle" value="bike">' +
                  '<input type="checkbox" name="vehicle" value="car">',
            control: 'input[name="vehicle"]'
        });
    }
});

test("updates view on manual model set", testUpdatesOnManual);

test('updates model and view on change', function () {
    $('input[value="bike"]').prop('checked', true);
    $control.filter(':checked').trigger($.Event('change'));
    deepEqual(echoObject.get(), 'bike', 'model is updated');
    deepEqual($view.html(), 'bike', 'view is updated');
});

test('multiple checked', function () {
    $('input[value="bike"]').prop('checked', true);
    $('input[value="car"]').prop('checked', true);
    $control.filter(':checked').trigger($.Event('change'));
    deepEqual(echoObject.get(), ['bike', 'car'], "model is updated");
    deepEqual($view.html(), ['bike', 'car'].toString(), "view is updated");
});


module('select', {
    setup: function () {
        setup({
            html: '<select name="fruit">' +
                      '<option value="orange">orange</option>' +
                      '<option value="apple">apple</option>' +
                  '</select>',
            control: 'select[name="fruit"]'
        });
    }
});

test("updates view on manual model set", testUpdatesOnManual);

test('updates model and view on change', function () {
    $('option[value="orange"]').prop('selected', true).trigger($.Event('click'));
    deepEqual(echoObject.get(), 'orange', 'model is updated');
    deepEqual($view.html(), 'orange', 'view is updated');
});
