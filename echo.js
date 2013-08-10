(function () {
"use strict";


//utility functions
var forEach = function (collection, callback) {
    var i;
    for(i in collection) {
        if(collection.hasOwnProperty(i)) {
            callback(collection[i], i, collection);
        }
    }
};


window.echo = {};

//In order to distinguish echo objects from regular objects.
var Echo = function () {};

//creates a new instance of a one-to-one data binding.
echo.new = function (fig) {
    fig = fig || {};
    var that = new Echo(),
        data,
        $control = fig.$control,
        $view = fig.$view,
        identity = function (a) { return a; },
        getter = fig.getter || identity,
        setter = fig.setter || identity,
        render = fig.render || function (data) {
            return (data || "").toString();
        },

        updateView = function (data) {
            if($view) {
                $view.html(render(data));
            }
        },

        bind = function () {
            if($control) {
                if($control.is('input[type="text"]') || $control.is('textarea')) {
                    $control.keyup(function() {
                        that.set($(this).val());
                    });
                    $control.keydown(function () {
                        that.set($(this).val());
                    });
                }
                else if($control.is('input[type="radio"]')) {
                    $control.change(function () {
                        that.set($(this).filter(":checked").val());
                    });
                }
                else if($control.is('input[type="checkbox"]')) {
                    $control.change(function () {
                        var $checked = $control.filter(":checked"),
                            value = [], i;

                        if($checked.length > 1) {
                            for(i = 0; i < $checked.length; i += 1) {
                                value.push($($checked.get(i)).val());
                            }
                        }
                        else {
                            value = $checked.val();
                        }
                        that.set(value);
                    });
                }
                else if($control.is('select')) {
                    $control.click(function () {
                        that.set($control.find('option:selected').val());
                    });
                }
            }
        },
        subscribers = [],
        publish = function (data) {
            forEach(subscribers, function (callback) {
                callback(data);
            });
        };

    bind();

    that.get = function () {
        return getter(data);
    };

    that.set = function (newData) {
        data = setter(newData);
        updateView(that.get());
        publish(newData);
    };

    that.onChange = function (callback) {
        subscribers.push(callback);
    };

    return that;
};



//creates instance of a collection of data-bindings
echo.collection = function (fig) {
    var that = {},
        $view = fig.$view,
        template = fig.template,
        data = fig.data,
        templator = fig.templator || Mustache,

        extractData = function (data) {
            var extracted;
            if(data instanceof Echo) {
                extracted = data.get();
            }
            else if(data instanceof Object) {
                extracted = data instanceof Array ? [] : {};
                forEach(data, function (val, key) {
                    extracted[key] = extractData(val);
                });
            }
            else {
                extracted = data;
            }
            return extracted;
        },

        bind = function (item) {
            if(item instanceof Echo) {
                item.onChange(function () {
                    render(data);
                });
            }
            else if(item instanceof Object) {
                forEach(item, function (val, key) {
                    bind(val);
                });
            }
        },

        render = function (data) {
            if(template && $view) {
                $view.html(templator.render(template, extractData(data)));
            }
        };

    render(data);
    bind(data);

    return that;
};



}());
