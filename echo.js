(function () {
'use strict';

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

//in order to distinguish echo objects from other objects.
var Echo = function () {};

//creates a new instance of a one-to-one data binding.
echo.new = function (fig) {
    fig = fig || {};
    var that = new Echo(),
        data,
        $control = fig.$control,
        $view = fig.$view,

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
                if(
                    $control.is('input[type="text"]') ||
                    $control.is('textarea')
                ) {
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
                else {
                    throw 'invalid control type';
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

    that.render = function () {
        return render(data);
    };

    that.get = function () {
        return data;
    };

    that.set = function (newData) {
        data = newData;
        updateView(that.get());
        publish(newData);
    };

    that.onChange = function (callback) {
        subscribers.push(callback);
    };

    that.clear = function () {
        that.set(null);
        that.clearControl();
    };

    that.clearControl = function () {
        if($control.is('input[type="text"]') || $control.is('textarea')) {
            $control.val('');
        }
        else if(
            $control.is('input[type="radio"]') ||
            $control.is('input[type="checkbox"]')
        ) {
            $control.prop('checked', false);
        }
        else if($control.is('select')) {
            $control.val([]);
        }
    };

    return that;
};


//creates instance of a collection of data-bindings
echo.collection = function (fig) {
    var that = {},
        $view = fig.$view,
        template = fig.template,
        items = fig.data,
        templator = fig.templator || Mustache,

        forEachEcho = function (data, callback) {
            if(data instanceof Echo) {
                callback(data);
            }
            else if(data instanceof Object) {
                forEach(data, function (val) {
                    forEachEcho(val, callback);
                });
            }
        },

        extractData = function (data) {
            var extracted;
            if(data instanceof Echo) {
                extracted = data.render();
            }
            else if(data instanceof Array) {
                extracted = [];
                forEach(data, function (val) {
                    var temp = extractData(val);
                    if(temp) {
                        extracted.push(temp);
                    }
                });
            }
            else if(data instanceof Object) {
                extracted = {};
                forEach(data, function (val, key) {
                    var tempData = extractData(val);
                    extracted[key] = extractData(val);
                });
            }
            else {
                extracted = data;
            }
            return extracted;
        },

        bind = function () {
            forEachEcho(items, function (echo) {
                echo.onChange(render);
            });
        },

        render = function () {
            if(template && $view) {
                $view.html(templator.render(template, extractData(items)));
            }
        };

    render();
    bind();

    that.get = function (key) {
        if(key) {
            return extractData(items[key]);
        }
        else {
            return extractData(items);
        }
    };

    that.set = function (key, val) {
        if(items[key] instanceof Echo) {
            items[key].set(val);
        }
        else {
            items[key] = val;
            render();
        }
    };

    that.clearControl = function () {
        forEachEcho(items, function (echo) {
            echo.clearControl();
        });
    };

    that.clear = function () {
        forEachEcho(items, function (echo) {
            echo.clear();
        });
    };

    return that;
};


}());
