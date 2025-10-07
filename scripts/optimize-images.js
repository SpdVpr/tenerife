const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Konfigurace
const INPUT_DIR = path.join(__dirname, '../../zadani/fotky');
const OUTPUT_DIR = path.join(__dirname, '../public/images/optimized');
const LOGO_PATH = path.join(__dirname, '../../zadani/fotky/image24697.jpeg');

// Kategorie fotek (budeme je kategorizovat manuálně)
const categories = {
  'living-room': [],
  'bedroom': [],
  'kitchen': [],
  'terrace': [],
  'pool': [],
  'view': [],
  'bathroom': [],
  'exterior': []
};

// Velikosti obrázků
const sizes = {
  hero: { width: 1920, quality: 90 },
  medium: { width: 1200, quality: 85 },
  thumbnail: { width: 400, quality: 80 }
};

// Vytvoření výstupních složek
function createDirectories() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  Object.keys(categories).forEach(category => {
    const categoryDir = path.join(OUTPUT_DIR, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
  });

  // Složka pro logo
  const logoDir = path.join(__dirname, '../public/images/logo');
  if (!fs.existsSync(logoDir)) {
    fs.mkdirSync(logoDir, { recursive: true });
  }
}

// Optimalizace jednoho obrázku
async function optimizeImage(inputPath, outputPath, size) {
  try {
    await sharp(inputPath)
      .resize(size.width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: size.quality })
      .toFile(outputPath);
    
    const stats = fs.statSync(outputPath);
    return stats.size;
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
    return 0;
  }
}

// Optimalizace loga
async function optimizeLogo() {
  console.log('\n🎨 Optimalizace loga...');
  
  const logoOutputDir = path.join(__dirname, '../public/images/logo');
  
  try {
    // Originální velikost
    await sharp(LOGO_PATH)
      .resize(500, 500, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 95 })
      .toFile(path.join(logoOutputDir, 'logo.webp'));
    
    // Malá verze pro header
    await sharp(LOGO_PATH)
      .resize(150, 150, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 90 })
      .toFile(path.join(logoOutputDir, 'logo-small.webp'));
    
    // Favicon
    await sharp(LOGO_PATH)
      .resize(32, 32, { fit: 'cover' })
      .png()
      .toFile(path.join(__dirname, '../public/favicon.ico'));
    
    console.log('✅ Logo optimalizováno');
  } catch (error) {
    console.error('❌ Chyba při optimalizaci loga:', error.message);
  }
}

// Hlavní funkce
async function main() {
  console.log('🚀 Začínám optimalizaci fotografií...\n');
  
  createDirectories();
  
  // Optimalizace loga
  await optimizeLogo();
  
  // Získání všech JPEG souborů
  const files = fs.readdirSync(INPUT_DIR)
    .filter(file => file.match(/\.(jpg|jpeg)$/i) && file !== 'image24697.jpeg');
  
  console.log(`\n📸 Nalezeno ${files.length} fotografií k optimalizaci\n`);
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  
  // Pro tuto fázi dáme všechny fotky do kategorie "view" - později je přesuneme
  const defaultCategory = 'view';
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(INPUT_DIR, file);
    const fileName = path.parse(file).name;
    
    console.log(`[${i + 1}/${files.length}] Zpracovávám ${file}...`);
    
    // Získání původní velikosti
    const originalStats = fs.statSync(inputPath);
    totalOriginalSize += originalStats.size;
    
    // Optimalizace ve třech velikostech
    for (const [sizeName, sizeConfig] of Object.entries(sizes)) {
      const outputPath = path.join(
        OUTPUT_DIR,
        defaultCategory,
        `${fileName}-${sizeName}.webp`
      );
      
      const optimizedSize = await optimizeImage(inputPath, outputPath, sizeConfig);
      totalOptimizedSize += optimizedSize;
    }
  }
  
  // Statistiky
  const savedSize = totalOriginalSize - totalOptimizedSize;
  const savedPercent = ((savedSize / totalOriginalSize) * 100).toFixed(1);
  
  console.log('\n✅ Optimalizace dokončena!\n');
  console.log('📊 Statistiky:');
  console.log(`   Původní velikost: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Optimalizovaná velikost: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Ušetřeno: ${(savedSize / 1024 / 1024).toFixed(2)} MB (${savedPercent}%)`);
  console.log(`\n📁 Fotky uloženy v: ${OUTPUT_DIR}`);
  console.log('\n💡 TIP: Později můžete přesunout fotky do správných kategorií (living-room, bedroom, atd.)');
}

// Spuštění
main().catch(console.error);

