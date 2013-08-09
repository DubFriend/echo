var echo = function (fig) {
    var that = {},
        data,
        $control = fig.$control,
        $view = fig.$view,
        identity = function (a) { return a; },
        getter = fig.getter || identity,
        setter = fig.setter || identity,
        updateView = function (newData) {
            $view.html((newData || "").toString());
        },
        bind = function () {
            if($control.is('input[type="text"]') || $control.is('textarea')) {
                $control.keyup(function() {
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
                    that.set($control.find("option:selected").val());
                });
            }
        };

    bind();

    that.get = function () {
        return getter(data);
    };

    that.set = function (newData) {
        data = setter(newData);
        updateView(that.get());
    };

    return that;
};
