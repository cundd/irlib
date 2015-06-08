/**
 * Created by COD on 08.06.15.
 */
/* global createDomFixture */
var bootstrapDocument = function () {
    document.getElementById('mocha-fixtures').appendChild(createDomFixture());
};
TestRunner.name = 'mocha-browser';
