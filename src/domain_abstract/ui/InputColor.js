require('utils/ColorPicker');
const Input = require('./Input');
const $ = Backbone.$;

module.exports = Input.extend({

  template() {
    const ppfx = this.ppfx;
    return `
      <div class="${this.holderClass()}"></div>
      <div class="${ppfx}field-colorp">
        <div class="${ppfx}field-colorp-c" data-colorp-c>
          <div class="${ppfx}checker-bg"></div>
        </div>
      </div>
    `;
  },

  inputClass() {
    const ppfx = this.ppfx;
    return `${ppfx}field ${ppfx}field-color`;
  },

  holderClass() {
    return `${this.ppfx}input-holder`;
  },

  /**
   * Set value to the model
   * @param {string} val
   * @param {Object} opts
   */
  setValue(val, opts = {}) {
    const model = this.model;
    const value = val || model.get('defaults');
    const inputEl = this.getInputEl();
    const colorEl = this.getColorEl();
    const valueClr = value != 'none' ? value : '';
    inputEl.value = value;
    colorEl.get(0).style.backgroundColor = valueClr;

    // This prevents from adding multiple thumbs in spectrum
    if (opts.fromTarget) {
      colorEl.spectrum('set', valueClr);
      this.noneColor = value == 'none';
    }
  },

  /**
   * Get the color input element
   * @return {HTMLElement}
   */
  getColorEl() {
    if (!this.colorEl) {
      const self = this;
      var model = this.model;

      var colorEl = $(`<div class="${this.ppfx}field-color-picker"></div>`);
      var cpStyle = colorEl.get(0).style;
      var elToAppend = this.target && this.target.config ? this.target.config.el : '';
      const getColor = color => {
        let cl = color.getAlpha() == 1 ? color.toHexString() : color.toRgbString();
        return cl.replace(/ /g, '');
      }

      let changed = 0;
      let previousСolor;
      this.$el.find(`[data-colorp-c]`).append(colorEl);

      colorEl.spectrum({
        appendTo: elToAppend || 'body',
        maxSelectionSize: 8,
        showPalette: true,
        showAlpha:   true,
        chooseText: 'Ok',
        cancelText: '⨯',
        palette: [],
        move(color) {
          const cl = getColor(color);
          cpStyle.backgroundColor = cl;
          model.setValueFromInput(cl, 0);
        },
        change(color) {
          changed = 1;
          const cl = getColor(color);
          cpStyle.backgroundColor = cl;
          model.setValueFromInput(cl);
          self.noneColor = 0;
        },
        show(color) {
          changed = 0;
          previousСolor = getColor(color);
        },
        hide(color) {
           if (!changed && previousСolor) {
             if (self.noneColor) {
               previousСolor = '';
             }
             cpStyle.backgroundColor = previousСolor;
             colorEl.spectrum('set', previousСolor);
             model.setValueFromInput(previousСolor, 0);
           }
        }
      });

      this.colorEl = colorEl;
    }
    return this.colorEl;
  },

  render() {
    Input.prototype.render.call(this);
    // This will make the color input available on render
    this.getColorEl();
    return this;
  }

});