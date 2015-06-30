/**
 * Created by COD on 08.06.15.
 */
(function (root) {
    root.createDomFixture = function () {
        var outer, emptyChild, linkChild, childWithIrLibTarget, link;

        outer = document.createElement('div');
        outer.className = 'outer';

        emptyChild = document.createElement('div');
        emptyChild.className = "my-class";
        emptyChild.id = "my-id";

        linkChild = document.createElement('div');
        linkChild.id = "my-id-inner";

        link = document.createElement('a');
        link.href = '#';
        link.textContent = 'A link';

        linkChild.appendChild(link);

        childWithIrLibTarget = document.createElement('div');
        childWithIrLibTarget.id = "my-id-with-irlib-target";
        childWithIrLibTarget.setAttribute('data-irlib-target', 'my-target');


        outer.appendChild(emptyChild).appendChild(linkChild).appendChild(childWithIrLibTarget);
        return outer;
    };

    root.TestRunner = {
        name: ''
    };
})(typeof global !== 'undefined' ? global : window);


if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP    = function() {},
            fBound  = function() {
                return fToBind.apply(this instanceof fNOP
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}
