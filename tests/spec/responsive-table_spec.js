import '../../consumables/js/polyfills/custom-event';
import '../../consumables/js/polyfills/object-assign';
import '../utils/es6-weak-map-global'; // For PhantomJS
import EventManager from '../utils/event-manager';
import ResponsiveTable from '../../consumables/js/es2015/responsive-table';
import HTML from '../../consumables/html/base-elements/tables/responsive-tables.html';

describe('Test responsive table', function () {
  describe('Constructor', function () {
    it(`Should throw if root element is not given`, function () {
      expect(() => {
        new ResponsiveTable();
      }).to.throw(Error);
    });

    it(`Should throw if root element is not a DOM element`, function () {
      expect(() => {
        new ResponsiveTable(document.createTextNode(''));
      }).to.throw(Error);
    });
  });

  describe('Initial Tasks', function () {
    let container;
    let element;
    let table;

    before(function () {
      container = document.createElement('div');
      container.innerHTML = HTML;
      document.body.appendChild(container);
      element = document.querySelector('[data-responsive-table]');
      table = new ResponsiveTable(element);
    });

    it(`Should add zebra stripe classes to table rows`, () => {
      const rows = [...element.querySelectorAll('tbody > tr')];
      const evenRows = rows.filter((row, index) => index % 2 === 0);
      const oddRows = rows.filter((row, index) => index % 2 !== 0);

      evenRows.forEach(row => {
        expect(row.classList.contains('bx--parent-row--even')).to.be.true;
      });

      oddRows.forEach(row => {
        expect(row.classList.contains('bx--parent-row--even')).to.be.false;
      });
    });

    it(`Should remove expandable rows from the DOM`, () => {
      const rows = [...element.querySelectorAll('tbody > tr')];

      rows.forEach(row => {
        expect(row.classList.contains('bx--expandable-row')).to.be.false;
      });
    });

    it(`Should move any overflow menus to the body`, () => {
      const rows = [...element.querySelectorAll('tbody > tr')];
      const bodyOptions = document.body.querySelector('.bx--overflow-menu__options');

      rows.forEach(row => {
        const overflowOptions = row.querySelector('.bx--overflow-menu__options');
        expect(overflowOptions).to.be.null;
      });

      expect(document.body.contains(bodyOptions)).to.be.true;
    });

    after(function () {
      document.body.removeChild(container);
      table.release();
    });
  });

  describe('Row Expansion', function () {
    const events = new EventManager();
    let element;
    let expanseTable;
    let container;

    before(function () {
      container = document.createElement('div');
      element;
      expanseTable;
      container.innerHTML = HTML;
      document.body.appendChild(container);
      element = document.querySelector('[data-responsive-table]');
      expanseTable = new ResponsiveTable(element);
    });

    it(`On first click, insert the saved row`, () => {
      const firstRowExpand = document.querySelector('.bx--table-expand');
      firstRowExpand.dispatchEvent(new CustomEvent('click', { bubbles: true }));

      expect(document.querySelector('.bx--expandable-row')).to.not.be.null;
    });

    it(`Remove element on second click`, () => {
      const firstRowExpand = document.querySelector('.bx--table-expand');
      firstRowExpand.dispatchEvent(new CustomEvent('click', { bubbles: true }));

      expect(document.querySelector('.bx--expandable-row')).to.be.null;
    });

    it(`Clicking a row expand table cell should trigger the event`, () => {
      const rowExpansion = document.querySelector('.bx--table-expand');
      const spyToggleRowExpandEvent = sinon.spy();
      events.on(element.ownerDocument.body, 'responsive-table-aftertoggleexpand', spyToggleRowExpandEvent);
      rowExpansion.dispatchEvent(new CustomEvent('click', { bubbles: true }));

      expect(spyToggleRowExpandEvent).to.have.been.called;
    });

    it(`The event should trigger the function`, () => {
      const rowExpansion = document.querySelector('.bx--table-expand');

      const spyToggleRowExpand = sinon.spy(expanseTable, 'toggleRowExpand');
      rowExpansion.dispatchEvent(new CustomEvent('click', { bubbles: true }));

      expect(spyToggleRowExpand).to.have.been.called;
    });

    afterEach(function () {
      events.reset();
    });

    after(function () {
      document.body.removeChild(container);
      expanseTable.release();
    });
  });
});
