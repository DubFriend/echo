#Echo

Echo is a dynamic templating and two-way data binding system.

[Demo][1]

##Echo Object

```javascript
var text = echo.new();
```

Bind to a user controlled input
```javascript
var text = echo.new({
    $control: $('#form input[type="text"]')
});
```

Bind data to view
```javascript
var text = echo.new({
    $view: $('#text-data-goes-here')
});
```

Customize rendering of data to the view
```javascript
var text = echo.new({
    render: function (data) {
        return data.length;
    }
});
```

**get**
```javascript
var data = text.get();
```

**set**
```javascript
text.set('new-data');
```

**render**
returns data passed through the render function
```javascript
var text = echo.new({
    render: function (data) {
        return data.length;
    }
});

text.set('foo');

text.get() === 'foo'

text.render() === 3
```
**clearControl**
clears input controller. (text-field, checkbox, etc.)

**clear**
clears data and input controller.


##Collection Object

Collection of echo objects and regular data.

```javascript
var collection = echo.collection({
    data: { title: 'Echo', item: echo.new() },
    template: '<h1>{{title}}</h1><p>{{item}}</p>',
    $view: $('#template-view')
});
```

Collection objects automatically rerender themselves whenever any of their data
has changed.

**set**
```javascript
//sets title and item from the previous example to 'foo' and 'bar'
collection.set('item', 'foo');
collection.set('title', 'bar');
```

**get**
```javascript
//gets all data (unwraps echo objects)
collection.get();
//gets item's data
collection.get('item');
```

**clearControl**
Clears controls on all the collection's echo objects.
```javascript
collection.clearControl();
```

**clear**
Clears all data.


[1]: http://www.briandetering.net/echo
