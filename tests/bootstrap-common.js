/**
 * Created by COD on 08.06.15.
 */
(function (root) {
    root.createDomFixture = function () {
        var outer, emptyChild, linkChild, link;

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
        outer.appendChild(emptyChild).appendChild(linkChild);
        return outer;
    };
})(this);
