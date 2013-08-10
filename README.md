# Echo
Echo is a dynamic templating and two-way data binding system.

```javascript
var text = echo.new({
    $control: $('#textbox'),
    $view: $('#text-view')
});
```
Any changes to text's model will automatically update the view.  Any user inputs
into the html textbox will update the model and view.
