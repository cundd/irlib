irlib
=====

> A simple JavaScript library


Installation
------------

With `npm`

```bash
npm install irlib --save-dev
```

or `Composer`

```bash
composer require cundd/irlib
```

Service Locator
---------------

### Create the Service Locator

```javascript
var sl = new IrLib.ServiceLocator();
```

### Import a ES6 module and register it

```javascript
import App from './App.js';
sl.register('app', App);
```

### Register a factory method

```javascript
sl.register(
        'appView',
        function () {
        		return new Instance();
        }
)    
```

### Register a controller with dependencies (inline)

```javascript
sl.registerMultiple({
	appController: IrLib.Controller.extend({
		needs: ['appView'],
		events: {
			click: function (e) {
				if (e.target.id === 'save') {
					this.appView.assignVariable('saved', this.appView.variables.saved + 1);
					this.appView.reload();
				}
			}
		}
	})
});  
```

### Set the property name for the dependency

```javascript
sl.registerMultiple({
	appController: IrLib.Controller.extend({
		needs: ['appView:view'],
		events: {
			click: function (e) {
				if (e.target.id === 'save') {
					this.view.assignVariable('saved', this.view.variables.saved + 1);
					this.view.reload();
				}
			}
		}
	})
});  
```