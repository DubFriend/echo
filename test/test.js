(function () {
'use strict';
var $control, $view, echoObject;

var setup = function (fig) {
    $('#qunit-fixture').html(fig.html + '<div id="view"></div>');
    $control = $(fig.control);
    $view = $('#view');
    echoObject = echo.new({ $control: $control, $view: $view });
};

var testUpdatesOnManual = function () {
    echoObject.set('foo');
    deepEqual(echoObject.get(), 'foo', 'model is set');
    deepEqual($view.html(), 'foo', 'view is updated');
};

// -----------------------------------------------------------------------------

module('text input', {
    setup: function () {
        setup({
            html: '<input id="textbox" type="text">',
            control: '#textbox'
        });
    }
});

test('updates view on manual model set', testUpdatesOnManual);

test('clearControl', function () {
    $control.val('foo');
    echoObject.clearControl();
    deepEqual('', $control.val());
});

test('updates model and view on keyup', function () {
    $control.val('foo');
    $control.trigger($.Event('keyup'));
    deepEqual(echoObject.get(), 'foo', 'model is updated');
    deepEqual($view.html(), 'foo', 'view is updated');
});

// -----------------------------------------------------------------------------

module('textarea', {
    setup: function () {
        setup({
            html: '<textarea id="textarea"></textarea>',
            control: '#textarea'
        });
    }
});

test('updates view on manual model set', testUpdatesOnManual);

test('clearControl', function () {
    $control.val('foo');
    echoObject.clearControl();
    deepEqual('', $control.val());
});

test('updates model and view on keyup', function () {
    $control.val('foo');
    $control.trigger($.Event('keyup'));
    deepEqual(echoObject.get(), 'foo', 'model is updated');
    deepEqual($view.html(), 'foo', 'view is updated');
});

// -----------------------------------------------------------------------------

module('radio', {
    setup: function () {
        setup({
            html: '<input type="radio" name="sex" value="male">' +
                  '<input type="radio" name="sex" value="female">',
            control: 'input[name="sex"]'
        });
    }
});

test('updates view on manual model set', testUpdatesOnManual);

test('clearControl', function () {
    $('input[value="male"]').prop('checked', true);
    echoObject.clearControl();
    deepEqual(false, $('input[value="male"]').prop('checked'));
});

test('updates model and view on click', function () {
    $('input[value="male"]').prop('checked', true);
    $control.filter(':checked').trigger($.Event('change'));
    deepEqual(echoObject.get(), 'male', 'model is updated');
    deepEqual($view.html(), 'male', 'view is updated');
});

// -----------------------------------------------------------------------------

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

test('clearControl', function () {
    $('input[value="bike"]').prop('checked', true);
    echoObject.clearControl();
    deepEqual(false, $('input[value="bike"]').prop('checked'));
});

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

// -----------------------------------------------------------------------------

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

test('updates view on manual model set', testUpdatesOnManual);

test('clearControl', function () {
    $('option[value="orange"]').prop('selected', true);
    echoObject.clearControl();
    deepEqual($('option[value="orange"]').prop('selected'), false);
});

test('updates model and view on change', function () {
    $('option[value="orange"]').prop('selected', true).trigger($.Event('click'));
    deepEqual(echoObject.get(), 'orange', 'model is updated');
    deepEqual($view.html(), 'orange', 'view is updated');
});

// -----------------------------------------------------------------------------

module('settings, etc.', {
    setup: function () {
        $('#qunit-fixture').html(
            '<input id="textbox" type="text">' +
            '<div id="view"></div>'
        );
        $control = $('#textbox');
        $view = $('#view');
    }
});

test('onChange', function () {
    echoObject = echo.new();
    var data;
    echoObject.onChange(function (newData) {
        data = newData;
    });
    echoObject.set('foo');
    deepEqual('foo', data, 'onChange called');
});

test('custom render', function () {
    echoObject = echo.new({
        $control: $control, $view: $view,
        render: function (data) {
            return data.toUpperCase();
        }
    });
    echoObject.set("bar");
    deepEqual(echoObject.get(), "bar", "model set normally");
    deepEqual($view.html(), "BAR", "view set by custom render function");
});

test('no $control', function () {
    echoObject = echo.new({ $view: $view });
    testUpdatesOnManual();
});

test('no $view', function () {
    echoObject = echo.new({ $control: $control });
    $control.val('foo');
    $control.trigger($.Event('keyup'));
    deepEqual(echoObject.get(), 'foo', 'model is updated');
    deepEqual($view.html(), '', 'view is not updated');
});


}());


(function () {
'use strict';

var collection,
    $control,
    echoA,
    echoB,
    $echoBView,
    getViewData = function () {
        return {
            normal: $('#normal').html(),
            echoA: $('#echoA').html(),
            echoB: $('#echoB').html()
        };
    };

module('collection', {
    setup: function () {
        $('#qunit-fixture').html(
            '<input id="textbox" type="text">' +
            '<div id="view"></div>' +
            '<div id="echoB-view"></div>'
        );
        $control = $('#textbox');
        echoA = echo.new({ $control: $control });
        $echoBView = $('#echoB-view');
        echoB = echo.new({ $view: $echoBView });
        collection = echo.collection({
            data: {
                normal: 'normal-data',
                echoA: echoA,
                echoB: echoB
            },
            template: '<p id="normal">{{normal}}</p>' +
                      '<p id="echoA">{{echoA}}</p>' +
                      '<p id="echoB">{{echoB}}</p>',
            $view: $('#view')
        });
    }
});

test('renders on creation', function () {
    deepEqual(
        getViewData(),
        { normal: 'normal-data', echoA: '', echoB: '' },
        'renders preset data immediately'
    );
});

test('updates template on model modified', function () {
    echoA.set('foo');
    deepEqual(
        getViewData(),
        { normal: 'normal-data', echoA: 'foo', echoB: '' },
        'updates template'
    );
});

test('get no index', function () {
    deepEqual(
        collection.get(),
        { normal: 'normal-data', echoA: '', echoB: '' },
        'gets all data if not passed a key'
    );
});

test('get with index', function () {
    deepEqual(collection.get('normal'), 'normal-data', 'gets selected data');
});

test('set', function () {
    collection.set('echoA', 'foo');
    deepEqual(collection.get('echoA'), 'foo', 'collection is set');
    deepEqual(echoA.get(), 'foo', 'echo object is set');
});

test('set - non echo data', function () {
    collection.set('normal', 'foo');
    deepEqual(getViewData().normal, 'foo', 'view is updated');
});


}());
