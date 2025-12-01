/**
 * Utility script to update translation files with missing keys
 * This script adds the necessary translation keys to prevent "Missing translation key" errors
 */

import fs from 'fs';
import path from 'path';

interface TranslationSection {
  [key: string]: any;
}

// Define the new translation sections to add
const newTranslationSections: TranslationSection = {
  "search": {
    "clearButton": "Clear search",
    "closeSearch": "Close Search",
    "error_message": "Sorry, an error occurred during search processing. Please try again.",
    "generalCategory": "General",
    "hint": "Hint",
    "loading": "Search",
    "new_description": "This new version includes all smart search features",
    "new_title": "New Smart Search",
    "noResults": "No results found",
    "no_results": "No products found",
    "placeholder": "Smart Product Search... (e.g. 'Samsung phone under 20 million')",
    "popularProducts": "Popular Products",
    "recentSearches": "Recent Searches",
    "searchPlaceholder": "Search products...",
    "searchResults": "{{count}} result found",
    "submit": "Search",
    "suggestion1": "Samsung phone under 20 million",
    "suggestion2": "Gaming laptop up to 40 million",
    "suggestion3": "High quality wireless headphones",
    "suggestion4": "Apple watch at a good price",
    "suggestion5": "Tablet for work and entertainment",
    "tryDifferentKeywords": "Try different keywords"
  },
  "shipping": {
    "free": "FREE shipping",
    "progressText": "{{progress}}% towards free shipping",
    "qualified": "You got FREE shipping!"
  },
  "theme": {
    "switchToDark": "Switch to dark mode",
    "switchToLight": "Switch to light mode"
  },
  "products": {
    "new_arrivals_title": "New Arrivals",
    "new_arrivals_subtitle": "Recently added items",
    "bestsellers_title": "Bestsellers",
    "bestsellers_subtitle": "Our most popular items",
    "featured_title": "Featured Products",
    "featured_subtitle": "Curated selection of our best products"
  }
};

function updateTranslationFile(filePath: string, newSections: TranslationSection) {
  try {
    // Read the current file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse JSON
    const translations = JSON.parse(fileContent);
    
    // Add new sections
    for (const [sectionName, sectionContent] of Object.entries(newSections)) {
      if (!translations[sectionName]) {
        translations[sectionName] = sectionContent;
        console.log(`✓ Added '${sectionName}' section to ${filePath}`);
      } else {
        // Merge new keys into existing section, avoiding overwrites
        for (const [key, value] of Object.entries(sectionContent)) {
          if (translations[sectionName][key] === undefined) {
            translations[sectionName][key] = value;
            console.log(`✓ Added '${sectionName}.${key}' to ${filePath}`);
          }
        }
      }
    }
    
    // Write updated file
    fs.writeFileSync(
      filePath, 
      JSON.stringify(translations, null, 2),
      'utf8'
    );
    
    console.log(`✓ Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

function main() {
  console.log('Updating translation files with missing keys...');

  // Define the translation files to update
  const translationFiles = [
    path.join(__dirname, '..', 'data', 'en.json'),
    path.join(__dirname, '..', 'data', 'fa.json'),
  ];

  // Update each file
  translationFiles.forEach(file => {
    if (fs.existsSync(file)) {
      updateTranslationFile(file, newTranslationSections);
    } else {
      console.warn(`Translation file does not exist: ${file}`);
    }
  });

  console.log('Translation update completed!');
}

// Run the script
if (require.main === module) {
  main();
}

export { updateTranslationFile, newTranslationSections };