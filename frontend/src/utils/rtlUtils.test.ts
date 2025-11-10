import { 
  isRTLLanguage, 
  getDirection, 
  getCSSProperty, 
  getFloatValue, 
  getTextAlign, 
  getMargin, 
  getPadding, 
  getBorder, 
  getTransform, 
  getFlexDirection, 
  getCursor,
  getRTLIcon
} from './rtlUtils';

describe('RTL Utilities', () => {
  describe('isRTLLanguage', () => {
    it('should return true for RTL languages', () => {
      expect(isRTLLanguage('ar')).toBe(true);  // Arabic
      expect(isRTLLanguage('fa')).toBe(true);  // Persian
      expect(isRTLLanguage('he')).toBe(true);  // Hebrew
      expect(isRTLLanguage('ur')).toBe(true);  // Urdu
    });

    it('should return false for LTR languages', () => {
      expect(isRTLLanguage('en')).toBe(false); // English
      expect(isRTLLanguage('fr')).toBe(false); // French
      expect(isRTLLanguage('de')).toBe(false); // German
    });
  });

  describe('getDirection', () => {
    it('should return rtl for RTL languages', () => {
      expect(getDirection('ar')).toBe('rtl');
      expect(getDirection('fa')).toBe('rtl');
      expect(getDirection('he')).toBe('rtl');
    });

    it('should return ltr for LTR languages', () => {
      expect(getDirection('en')).toBe('ltr');
      expect(getDirection('fr')).toBe('ltr');
    });
  });

  describe('getCSSProperty', () => {
    it('should return RTL value when isRTL is true', () => {
      expect(getCSSProperty('text-align', 'right', 'left', true)).toBe('right');
      expect(getCSSProperty('margin', '10px 0 0 5px', '10px 5px 0 0', true)).toBe('10px 0 0 5px');
    });

    it('should return LTR value when isRTL is false', () => {
      expect(getCSSProperty('text-align', 'right', 'left', false)).toBe('left');
      expect(getCSSProperty('margin', '10px 0 0 5px', '10px 5px 0 0', false)).toBe('10px 5px 0 0');
    });
  });

  describe('getFloatValue', () => {
    it('should return right for RTL', () => {
      expect(getFloatValue(true)).toBe('right');
    });

    it('should return left for LTR', () => {
      expect(getFloatValue(false)).toBe('left');
    });
  });

  describe('getTextAlign', () => {
    it('should return right for RTL', () => {
      expect(getTextAlign(true)).toBe('right');
    });

    it('should return left for LTR', () => {
      expect(getTextAlign(false)).toBe('left');
    });
  });

  describe('getMargin', () => {
    it('should return correct CSS property for left margin in RTL', () => {
      expect(getMargin('left', true)).toBe('margin-right');
    });

    it('should return correct CSS property for left margin in LTR', () => {
      expect(getMargin('left', false)).toBe('margin-left');
    });

    it('should return correct CSS property for right margin in RTL', () => {
      expect(getMargin('right', true)).toBe('margin-left');
    });

    it('should return correct CSS property for right margin in LTR', () => {
      expect(getMargin('right', false)).toBe('margin-right');
    });
  });

  describe('getPadding', () => {
    it('should return correct CSS property for left padding in RTL', () => {
      expect(getPadding('left', true)).toBe('padding-right');
    });

    it('should return correct CSS property for left padding in LTR', () => {
      expect(getPadding('left', false)).toBe('padding-left');
    });

    it('should return correct CSS property for right padding in RTL', () => {
      expect(getPadding('right', true)).toBe('padding-left');
    });

    it('should return correct CSS property for right padding in LTR', () => {
      expect(getPadding('right', false)).toBe('padding-right');
    });
  });

  describe('getBorder', () => {
    it('should return correct CSS property for left border in RTL', () => {
      expect(getBorder('left', true)).toBe('border-right');
    });

    it('should return correct CSS property for left border in LTR', () => {
      expect(getBorder('left', false)).toBe('border-left');
    });

    it('should return correct CSS property for right border in RTL', () => {
      expect(getBorder('right', true)).toBe('border-left');
    });

    it('should return correct CSS property for right border in LTR', () => {
      expect(getBorder('right', false)).toBe('border-right');
    });
  });

  describe('getTransform', () => {
    it('should flip scaleX for RTL', () => {
      expect(getTransform(true, 'scaleX(1)')).toBe('scaleX(-1) scaleX(1)');
      expect(getTransform(true, 'scaleX(-1)')).toBe('scaleX(1)');
    });

    it('should not flip for LTR', () => {
      expect(getTransform(false, 'scaleX(1)')).toBe('scaleX(1)');
      expect(getTransform(false, 'scaleX(-1)')).toBe('scaleX(-1)');
    });
  });

  describe('getFlexDirection', () => {
    it('should reverse row direction for RTL', () => {
      expect(getFlexDirection('row', true)).toBe('row-reverse');
      expect(getFlexDirection('row-reverse', true)).toBe('row');
    });

    it('should not change column direction for RTL', () => {
      expect(getFlexDirection('column', true)).toBe('column');
      expect(getFlexDirection('column-reverse', true)).toBe('column-reverse');
    });

    it('should maintain directions for LTR', () => {
      expect(getFlexDirection('row', false)).toBe('row');
      expect(getFlexDirection('row-reverse', false)).toBe('row-reverse');
      expect(getFlexDirection('column', false)).toBe('column');
      expect(getFlexDirection('column-reverse', false)).toBe('column-reverse');
    });
  });

  describe('getCursor', () => {
    it('should flip horizontal cursor types for RTL', () => {
      expect(getCursor('w-resize', true)).toBe('e-resize');
      expect(getCursor('e-resize', true)).toBe('w-resize');
      expect(getCursor('sw-resize', true)).toBe('se-resize');
      expect(getCursor('se-resize', true)).toBe('sw-resize');
    });

    it('should maintain other cursor types for RTL', () => {
      expect(getCursor('pointer', true)).toBe('pointer');
      expect(getCursor('move', true)).toBe('move');
    });

    it('should maintain all cursor types for LTR', () => {
      expect(getCursor('w-resize', false)).toBe('w-resize');
      expect(getCursor('e-resize', false)).toBe('e-resize');
      expect(getCursor('sw-resize', false)).toBe('sw-resize');
      expect(getCursor('se-resize', false)).toBe('se-resize');
      expect(getCursor('pointer', false)).toBe('pointer');
    });
  });

  describe('getRTLIcon', () => {
    it('should return same icon regardless of RTL/LTR', () => {
      expect(getRTLIcon('home', true)).toBe('home');
      expect(getRTLIcon('home', false)).toBe('home');
    });
  });
});