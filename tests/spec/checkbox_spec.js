import '../utils/es6-weak-map-global'; // For PhantomJS
import '../../consumables/js/polyfills/custom-event';
import initCheckbox from '../../consumables/js/es2015/checkbox';

describe('Test checkbox', function () {
  let element;
  let handle;

  before(function () {
    handle = initCheckbox();
    element = document.createElement('input');
    element.type = 'checkbox';
    document.body.appendChild(element);
  });

  beforeEach(function () {
    element.removeAttribute('checked');
  });

  it(`Should add checked attribute when it's checked`, function () {
    element.checked = true;
    element.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    expect(element.hasAttribute('checked')).to.be.true;
  });

  it(`Should remove checked attribute when it's unchecked`, function () {
    element.setAttribute('checked', '');
    element.checked = false;
    element.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    expect(element.hasAttribute('checked')).to.be.false;
  });

  it(`Should provide a way to remove event listener`, function () {
    handle = handle.release();
    element.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    expect(element.hasAttribute('checked')).to.be.false;
  });

  after(function () {
    if (handle) {
      handle = handle.release();
    }
    document.body.removeChild(element);
  });
});
