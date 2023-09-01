import {
  defineConfig,
  presetIcons,
  presetUno,
  presetAttributify,
  transformerDirectives,
} from 'unocss';
import { compareColors, stringToColor } from '@iconify/utils/lib/colors';
import type { IconifyJSON } from '@iconify/types';
import {
  SVG,
  cleanupSVG,
  parseColors,
  isEmptyColor,
  importDirectory,
  runSVGO,
  deOptimisePaths,
} from '@iconify/tools';

export default defineConfig({
  presets: [
    presetIcons({
      autoInstall: false,
      collections: {
        'custom-svg': () => loadCustomIconSet(),
      },
    }),
    presetUno(),
    presetAttributify(),
  ],
  theme: {
    colors: {
      background_1: '#F1F2FD',
      background_2: '#F7F8FE',
      primary_2: '#70708C',
      primary_1: '#FF8F6B',
    },
  },
  //TransformerDirectives auto opened?
  transformers: [transformerDirectives()],
});

async function loadCustomIconSet(): Promise<IconifyJSON> {
  const iconSet = await importDirectory('assets/icons', {
    prefix: 'svg',
  });
  // console.log(iconSet.list().length);
  await iconSet.forEach(async (name) => {
    const svg = iconSet.toSVG(name)!;
    // console.log('Source svg:', svg.toString());
    cleanupSVG(svg);
    const blackColor = stringToColor('black')!;
    await parseColors(svg, {
      defaultColor: 'currentColor',
      callback: (attr, colorStr, color) => {
        if (color && compareColors(color, blackColor)) {
          return 'currentColor';
        }
        switch (color?.type) {
          case 'none':
          case 'current':
            return color;
        }
        //     throw new Error(`Unexpected color "${colorStr}" in attribute ${attr}`);
        return 'currentColor';
      },
    });
    // console.log('After Cleanup and Before Optimise:', svg.toString());
    // Optimise
    runSVGO(svg);
    // console.log('After Optimise and Before Update paths:', svg.toString());
    // Update paths for compatibility with old software
    await deOptimisePaths(svg);
    // console.log('After Update paths:', svg.toString());
    iconSet.fromSVG(name, svg);
    // console.log(iconSet);
  });
  // console.log(iconSet.);
  // Export as IconifyJSON
  return iconSet.export();
}
