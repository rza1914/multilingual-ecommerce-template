/**
 * RTL (Right-to-Left) Utilities
 * Provides utility functions for handling RTL layouts and translations
 */

// Check if a language is RTL
export const isRTLLanguage = (language: string): boolean => {
  const rtlLanguages = ['ar', 'fa', 'he', 'ur', 'ps', 'sd', 'ug', 'ku', 'dv', 'ha', 'yi', 'ku', 'arc', 'ckb'];
  return rtlLanguages.includes(language);
};

// Get direction based on language
export const getDirection = (language: string): 'ltr' | 'rtl' => {
  return isRTLLanguage(language) ? 'rtl' : 'ltr';
};

// Get appropriate CSS property based on direction
export const getCSSProperty = (_property: string, rtlValue: string, ltrValue: string, isRTL: boolean): string => {
  return isRTL ? rtlValue : ltrValue;
};

// Get appropriate float value based on direction
export const getFloatValue = (isRTL: boolean): 'left' | 'right' => {
  return isRTL ? 'right' : 'left';
};

// Get appropriate text alignment based on direction
export const getTextAlign = (isRTL: boolean): 'right' | 'left' | 'center' => {
  return isRTL ? 'right' : 'left';
};

// Get appropriate margin based on direction
export const getMargin = (side: 'left' | 'right', isRTL: boolean): string => {
  if (side === 'left') {
    return isRTL ? 'margin-right' : 'margin-left';
  } else {
    return isRTL ? 'margin-left' : 'margin-right';
  }
};

// Get appropriate padding based on direction
export const getPadding = (side: 'left' | 'right', isRTL: boolean): string => {
  if (side === 'left') {
    return isRTL ? 'padding-right' : 'padding-left';
  } else {
    return isRTL ? 'padding-left' : 'padding-right';
  }
};

// Get appropriate border based on direction
export const getBorder = (side: 'left' | 'right', isRTL: boolean): string => {
  if (side === 'left') {
    return isRTL ? 'border-right' : 'border-left';
  } else {
    return isRTL ? 'border-left' : 'border-right';
  }
};

// Get appropriate transform for horizontal flip
export const getTransform = (isRTL: boolean, originalTransform: string): string => {
  if (!isRTL) return originalTransform;
  
  // If it includes scaleX or scale(-1), we might want to flip it
  if (originalTransform.includes('scaleX(-1)')) {
    return originalTransform.replace('scaleX(-1)', 'scaleX(1)');
  } else if (originalTransform.includes('scaleX(1)')) {
    return originalTransform.replace('scaleX(1)', 'scaleX(-1)');
  } else {
    return `scaleX(-1) ${originalTransform}`;
  }
};

// Flip flex direction for RTL
export const getFlexDirection = (direction: 'row' | 'row-reverse' | 'column' | 'column-reverse', isRTL: boolean): string => {
  if (!isRTL) return direction;
  
  switch (direction) {
    case 'row':
      return 'row-reverse';
    case 'row-reverse':
      return 'row';
    default:
      return direction;
  }
};

// Get appropriate cursor based on direction
export const getCursor = (type: string, isRTL: boolean): string => {
  if (!isRTL) return type;

  switch (type) {
    case 'w-resize':
      return 'e-resize';
    case 'e-resize':
      return 'w-resize';
    case 'sw-resize':
      return 'se-resize';
    case 'se-resize':
      return 'sw-resize';
    default:
      return type; // Return as is for non-matching types
  }
};

// Get the appropriate icon for RTL/LTR
export const getRTLIcon = (icon: string, isRTL: boolean): string => {
  if (!isRTL) return icon;
  
  // In a real implementation, you might have different icons for RTL
  // For now, return the same icon
  return icon;
};