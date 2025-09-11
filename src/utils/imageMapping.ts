// AI 서비스별 이미지 매핑 유틸리티
// src/utils/imageMapping.ts

export interface ImageMapping {
  logo: string;
  serviceImage: string;
  priceImage: string;
  searchbarLogo: string;
}

// 카테고리별 이미지 경로 매핑
const CATEGORY_IMAGE_PATHS = {
  'chat': {
    basePath: '/images/Logo/Card/Chatbot',
    servicePath: '/images/DetailPage/ServiceImage/Chat',
    pricePath: '/images/DetailPage/PriceImage/Chat',
    searchbarPath: '/images/Logo/Searchbar/Chatbot'
  },
  'chatbot': { // alias for chatbot
    basePath: '/images/Logo/Card/Chatbot',
    servicePath: '/images/DetailPage/ServiceImage/Chat',
    pricePath: '/images/DetailPage/PriceImage/Chat',
    searchbarPath: '/images/Logo/Searchbar/Chatbot'
  },
  'image': {
    basePath: '/images/Logo/Card/Image',
    servicePath: '/images/DetailPage/ServiceImage/Image',
    pricePath: '/images/DetailPage/PriceImage/Image',
    searchbarPath: '/images/Logo/Searchbar/Image'
  },
  'video': {
    basePath: '/images/Logo/Card/Video',
    servicePath: '/images/DetailPage/ServiceImage/Video',
    pricePath: '/images/DetailPage/PriceImage/Video',
    searchbarPath: '/images/Logo/Searchbar/Video'
  },
  'audio': {
    basePath: '/images/Logo/Card/Audio',
    servicePath: '/images/DetailPage/ServiceImage/Audio',
    pricePath: '/images/DetailPage/PriceImage/Audio',
    searchbarPath: '/images/Logo/Searchbar/Audio'
  },
  '3d': {
    basePath: '/images/Logo/Card/3D',
    servicePath: '/images/DetailPage/ServiceImage/3D',
    pricePath: '/images/DetailPage/PriceImage/3D',
    searchbarPath: '/images/Logo/Searchbar/3D'
  },
  'text': {
    basePath: '/images/Logo/Card/Text',
    servicePath: '/images/DetailPage/ServiceImage/Text',
    pricePath: '/images/DetailPage/PriceImage/Text',
    searchbarPath: '/images/Logo/Searchbar/Text'
  },
  'product': {
    basePath: '/images/Logo/Card/Product',
    servicePath: '/images/DetailPage/ServiceImage/Product',
    pricePath: '/images/DetailPage/PriceImage/Product',
    searchbarPath: '/images/Logo/Searchbar/Product'
  },
  'productivity': { // alias for productivity
    basePath: '/images/Logo/Card/Product',
    servicePath: '/images/DetailPage/ServiceImage/Product',
    pricePath: '/images/DetailPage/PriceImage/Product',
    searchbarPath: '/images/Logo/Searchbar/Product'
  },
  'education': { // alias for education
    basePath: '/images/Logo/Card/Product',
    servicePath: '/images/DetailPage/ServiceImage/Product',
    pricePath: '/images/DetailPage/PriceImage/Product',
    searchbarPath: '/images/Logo/Searchbar/Product'
  },
  'business': { // alias for business
    basePath: '/images/Logo/Card/Product',
    servicePath: '/images/DetailPage/ServiceImage/Product',
    pricePath: '/images/DetailPage/PriceImage/Product',
    searchbarPath: '/images/Logo/Searchbar/Product'
  },
  'creativity': { // alias for creativity
    basePath: '/images/Logo/Card/Product',
    servicePath: '/images/DetailPage/ServiceImage/Product',
    pricePath: '/images/DetailPage/PriceImage/Product',
    searchbarPath: '/images/Logo/Searchbar/Product'
  },
  'code': {
    basePath: '/images/Logo/Card/Code',
    servicePath: '/images/DetailPage/ServiceImage/Code',
    pricePath: '/images/DetailPage/PriceImage/Code',
    searchbarPath: '/images/Logo/Searchbar/Code'
  }
} as const;

// AI 서비스명과 이미지 파일명 매핑 (실제 파일 구조에 맞게 수정)
const SERVICE_IMAGE_MAPPING: Record<string, string> = {
  // Chat/Chatbot 서비스들
  'ChatGPT': 'ChatGPT.png',
  'Claude': 'Claude.png',
  'Gemini': 'Gemini.png',
  'Character.AI': 'CharacterAi.png',
  'ChatSUTRA': 'ChatSutra.png',
  'Clova X': 'ClovaX.png',
  'DeepSeek': 'DeepSeek.png',
  'Felo AI': 'Felo.png',
  'Genspark': 'Genspark.png',
  'Grok': 'Grok.png',
  'Le Chat': 'LeChat.png',
  'Microsoft Copilot': 'MicrosoftCopilot.png',
  'Monica': 'Monica.png',
  'Perplexity': 'Perplexity.png',
  'Pi': 'Pi.png',
  'Replika': 'Replika.png',
  'Simsimi': 'Simsimi.png',
  'Zeta': 'Zeta.png',
  '뤼튼': 'Wrtn.png',
  'Wrtn.ai': 'Wrtn.png',

  // Image 서비스들
  'Adobe Firefly': 'AdobeFirefly.png',
  'Bing Image Creator': 'BingImageCreator.png',
  'DALL·E': 'Dalle.png',
  'Deep Dream Generator': 'DeepDreamGenerator.png',
  'Designs.ai': 'DesignsAi.png',
  'Dreamina': 'Dreamina.png',
  'Evoto': 'Evoto.png',
  'Flux AI': 'FluxAi.png',
  'Flux.1': 'FluxAi.png',
  'Fotor': 'Fotor.png',
  'FREEPICK': 'Freepik.png',
  'Ideogram': 'Ideogram.png',
  'Imagen': 'Imagen.png',
  'KREA': 'Krea.png',
  'Leonardo.ai': 'Leonardo ai.png',
  'Let\'s Enhance': 'LetsEnhance.png',
  'Magnific': 'Magnific.png',
  'Midjourney': 'Midjourney.png',
  'Photoroom': 'Photoroom.png',
  'Pixelcut': 'Pixelcut.png',
  'PIXLR': 'Pixlr.png',
  'Remini': 'Remini.png',
  'remove bg': 'RemoveBg.png',
  'Scenario': 'Scenario.png',
  'Stable Diffusion': 'StableDiffusion.png',
  'Topaz Photo AI': 'TopazPhotoAi.png',
  'Upscayl': 'Upscayl.png',
  '따능 AI': 'WarmTalentAi.png',

  // Video 서비스들
  'AI Hug': 'AiHug.png',
  'Animaker': 'Animaker.png',
  'AnimateAI': 'AnimateAi.png',
  'BigVu': 'Bigvu.png',
  'ClipZap AI': 'ClipZapAi.png',
  'Colossyan': 'Colossyan.png',
  'DeepBrain AI': 'DeepBrainAi.png',
  'Filmora': 'Filmora.png',
  'Genmo': 'Genmo.png',
  'Gling': 'Gling.png',
  'Hailuo': 'Hailuo.png',
  'HitPaw VikPea': 'HitPawVikPea.png',
  'Kaiber': 'Kaiber.png',
  'Kling': 'Kling.png',
  'LipDub AI': 'LipDubAi.png',
  'Lumalabs AI': 'Luma.png',
  'Lumen5': 'Lumen5.png',
  'Melies': 'Melies.png',
  'Opus clip': 'OpusClip.png',
  'Pictory': 'Pictory.png',
  'Pika': 'Pika.png',
  'Pika Labs': 'Pika.png',
  'Pollo AI': 'PolloAi.png',
  'Runway': 'Runway.png',
  'Shortmake AI': 'ShortmakeAi.png',
  'Sora': 'Sora.png',
  'Synthesia': 'Synthesia.png',
  'TalkingPets.ai': 'TalkingPetsAi.png',
  'TopView.ai': 'Topview.png',
  'Topaz Labs': 'TopazVideoAi.png',
  'UGC Ads AI': 'UgcAdsAi.png',
  'VEED.IO': 'Veed.png',
  'Vidu': 'Vidu.png',
  'Vizard.ai': 'VizardAi.png',
  'WUI.AI': 'WuiAi.png',

  // Audio 서비스들
  'Adobe Podcast': 'AdobePodcast.png',
  'AIVA': 'AIVA.png',
  'audioread': 'AudioRead.png',
  'Beatoven AI': 'BeatovenAi.png',
  'Boomy': 'Boomy.png',
  'CleanVoice': 'CleanVoice.png',
  'Cockatoo': 'Cockatoo.png',
  'Daglo': 'Daglo.png',
  'Deepdub': 'Deepdub.png',
  'DIKTATORIAL': 'Diktatorial.png',
  'ElevenLabs': 'Elevenlabs.png',
  'FineVoice': 'FineVoice.png',
  'Kits AI': 'KitsAi.png',
  'LALAL.AI': 'LalalAi.png',
  'Loudly': 'Loudly.png',
  'Moises': 'Moises.png',
  'Mubert': 'Mubert.png',
  'Murf.AI': 'MurfAi.png',
  'Play AI': 'PlayAi.png',
  'Replica Studios': 'ReplicaStudios.png',
  'Riffusion': 'Riffusion.png',
  'Soundful': 'Soundful.png',
  'SOUNDRAW': 'Soundraw.png',
  'Speechify': 'Speechify.png',
  'SpeechPulse': 'SpeechPulse.png',
  'Suno AI': 'SunoAi.png',
  'Superwhisper': 'SuperWhisper.png',
  'TurboScribe': 'TurboScribe.png',
  'Typecast': 'Typecast.png',
  'Udio': 'Udio.png',
  'Voli.ai': 'VoliAi.png',
  'VOMO': 'Vomo.png',
  'Zeemo ai': 'ZeemoAi.png',

  // 3D 서비스들
  '3D AI Studio': '3dAiStudio.png',
  'Alpha3D': 'Alpha3d.png',
  'Cascadeur': 'Cascadeur.png',
  'Customuse': 'Customuse.png',
  'Deep Motion': 'DeepMotion.png',
  'Genie': 'Genie.png',
  'Immersity AI': 'ImmersityAi.png',
  'Kaedim': 'Kaedim.png',
  'Kinetix': 'Kinetix.png',
  'Live 3D': 'Live3d.png',
  'MASTERPIECE X': 'MasterpieceX.png',
  'Meshcapade': 'Meshcapade.png',
  'Meshed': 'Meshed.png',
  'Meshy': 'MeshyAi.png',
  'Meshy AI': 'MeshyAi.png',
  'Move AI': 'MoveAi.png',
  'OvenAI': 'OvenAi.png',
  'Pixcap': 'Pixcap.png',
  'Plask': 'Plask.png',
  'Polycam': 'Polycam.png',
  'Quick Magic': 'QuickMagic.png',
  'RADiCAL Motion': 'RadicalMotion.png',
  'Rodin': 'Rodin.png',
  'Sloyd': 'Sloyd.png',
  'Spline': 'Spline.png',
  'Stable Fast 3D': 'StableFast3d.png',
  'Toggle3D.ai': 'Toggle3dAi.png',
  'Tripo': 'Tripo.png',
  'Viggle': 'Viggle.png',
  'Vizcom': 'Vizcom.png',

  // Text 서비스들
  'Anyword': 'Anyword.png',
  'Connected Papers': 'ConnectedPapers.png',
  'Consensus': 'Consensus.png',
  'Copy.ai': 'CopyAi.png',
  'Copykle': 'Copykle.png',
  'Dear AI': 'DearAi.png',
  'DeepL': 'DeepL.png',
  'GetGenie': 'GetGenie.png',
  'Glasp': 'Glasp.png',
  'Grammarly': 'Grammarly.png',
  'HandtextAI': 'HandtextAi.png',
  'Jasper': 'Jasper.png',
  'Jenni AI': 'JenniAi.png',
  'JotBot': 'JotBot.png',
  'Lilys.ai': 'LilysAi.png',
  'Magic Write': 'MagicWrite.png',
  'Magic Design': 'MagicWrite.png',
  'Manga Translator': 'MangaTranslator.png',
  'Nebo': 'Nebo.png',
  'Novelist AI': 'NovelistAi.png',
  'OpenL': 'OpenL.png',
  'Orwell': 'Orwell.png',
  'Paper Digest': 'PaperDigest.png',
  'Rytr': 'Rytr.png',
  'Scholarcy': 'Scholarcy.png',
  'SciSpace': 'SciSpace.png',
  'TLDRthis': 'Tldrthis.png',
  'Transmonkey': 'Transmonkey.png',
  'Typeit': 'Typeit.png',
  'Wordtune': 'Wordtune.png',
  'Wordvice AI': 'Wordvice.png',
  'Write sonic': 'Writesonic.png',
  'Writesonic': 'Writesonic.png',
  'WriteMail.ai': 'WriteMailAi.png',
  '가제트 AI': 'GadgetAi.png',

  // Product 서비스들
  'AlphaSense': 'AlphaSence.png',
  'Brandwatch': 'Brandwatch.png',
  'Callabo': 'Callabo.png',
  'CK PASS': 'CkPass.png',
  'CLAP': 'Clap.png',
  'Click up': 'ClickUp.png',
  'Clockwise': 'Clockwise.png',
  'Colormagic': 'Colormagic.png',
  'Coolors AI': 'CoolorsAi.png',
  'Course Hero': 'CourseHero.png',
  'Crayon': 'Crayon.png',
  'Curipod': 'Curipod.png',
  'Domo': 'Domo.png',
  'Feedly': 'Feedly.png',
  'Fellow': 'Fellow.png',
  'Fitbots': 'Fitbots.png',
  'Flex': 'Flex.png',
  'Flow': 'Flow.png',
  'Fluently AI': 'FluentlyAi.png',
  'fontjoy': 'Fontjoy.png',
  'Galileo AI': 'GalileoAi.png',
  'Gamma': 'Gamma.png',
  'Gauthmath': 'Gauthmath.png',
  'Graphy': 'Graphy.png',
  'Jira': 'Jira.png',
  'Khroma': 'Khroma.png',
  'Kompyte': 'Kompyte.png',
  'Lemonbase': 'Lemonbase.png',
  'Make': 'Make.png',
  'MarketMuse': 'MarketMuse.png',
  'Miro AI': 'MiroAi.png',
  'Motion': 'Motion.png',
  'My Speaking Score': 'MySpeakingScore.png',
  'Napkin AI': 'NapkinAi.png',
  'NaverWorks AI': 'NaverWorksAi.png',
  'OctoparseAI': 'OctoparseAi.png',
  'OpenSurvey': 'OpenSurvey.png',
  'Perdoo': 'Perdoo.png',
  'PromptoMANIA': 'PromptoMania.png',
  'Qlik': 'Qlik.png',
  'Quantive': 'Quantive.png',
  'Quizgecko': 'Quizgecko.png',
  'Reclaim.ai': 'ReclaimAi.png',
  'Relume': 'RelumeAi.png',
  'Relume AI': 'RelumeAi.png',
  'SAS Viya': 'SasViya.png',
  'Scalenut': 'Scalenut.png',
  'Shiftee': 'Shiftee.png',
  'Shopl..': 'Shopl.png',
  'SlidesAI': 'SlidesAi.png',
  'Sourcetable': 'Sourcetable.png',
  'Tability': 'Tability.png',
  'Tableau': 'Tableau.png',
  'Thinknum': 'Thinknum.png',
  'Timblo': 'Timblo.png',
  'Tome': 'Tome.png',
  'Tonic': 'Tonic.png',
  'Turbolearn': 'Turbolearn.png',
  'UPDF': 'Updf.png',
  'UX Pilot': 'UxPilot.png',
  'Uipath': 'Uipath.png',
  'Uizard': 'Uizard.png',
  'Verve AI': 'VerveAi.png',
  'Visily': 'Visily.png',
  'Visme': 'Visme.png',
  'Workup': 'Workup.png',
  'Zep Quiz': 'ZepQuiz.png',

  // Code 서비스들
  'Amazon Q Developer': 'Amazon Q Developer.png',
  'Bugdar': 'Bugdar.png',
  'Claude Code': 'Claude Code.png',
  'Cursor': 'Cursor.png',
  'DeepSeek Coder': 'DeepSeek Coder.png',
  'GitHub Copilot': 'GitHub Copilot.png',
  'Google Gemini Code Assist': 'Google Gemini Code Assist.png',
  'JetBrains AI': 'JetBrains AI.png',
  'Jules': 'Jules.png',
  'Qodo': 'Qodo.png',
  'Replit Ghostwriter': 'Replit Ghostwriter.png',
  'SonarQube': 'SonarQube.png',
  'Sourcegraph Cody': 'Sourcegraph Cody.png',
  'Tabnine': 'Tabnine.png',
  'Windsurf': 'Windsurf.png'
};

/**
 * 기본 이미지 경로
 */
const DEFAULT_IMAGES = {
  logo: '/images/Logo/Logo_FINAL.svg',
  serviceImage: '/images/GlassMorphism/Detailpage/Detailpage_Happy.png',
  priceImage: '/images/GlassMorphism/Detailpage/Detailpage_Happy.png',
  searchbarLogo: '/images/Logo/Logo_FINAL.svg'
};

/**
 * AI 서비스명과 카테고리를 기반으로 이미지 경로를 반환합니다.
 * @param serviceName - AI 서비스명 (예: 'ChatGPT', 'Midjourney')
 * @param categorySlug - 카테고리 슬러그 (예: 'chat', 'image')
 * @returns ImageMapping 객체
 */
export function getImageMapping(serviceName: string, categorySlug: string): ImageMapping {
  const normalizedCategory = categorySlug.toLowerCase() as keyof typeof CATEGORY_IMAGE_PATHS;
  const categoryPaths = CATEGORY_IMAGE_PATHS[normalizedCategory];
  
  // 카테고리가 없으면 기본 이미지 반환
  if (!categoryPaths) {
    console.warn(`카테고리 '${categorySlug}'를 찾을 수 없습니다. 기본 이미지를 사용합니다.`);
    return DEFAULT_IMAGES;
  }

  // 서비스명으로 파일명 찾기
  let imageFileName = SERVICE_IMAGE_MAPPING[serviceName];
  
  // 매핑에 없으면 서비스명으로 파일명 생성 (공백과 특수문자를 언더스코어로 변경)
  if (!imageFileName) {
    console.warn(`서비스 '${serviceName}'의 이미지 매핑을 찾을 수 없습니다. 서비스명을 파일명으로 사용합니다.`);
    imageFileName = `${serviceName.replace(/[\/\\:*?"<>|\s\.]/g, '_')}.png`;
  }
  
  return {
    logo: `${categoryPaths.basePath}/${imageFileName}`,
    serviceImage: `${categoryPaths.servicePath}/${imageFileName}`,
    priceImage: `${categoryPaths.pricePath}/${imageFileName}`,
    searchbarLogo: `${categoryPaths.searchbarPath}/${imageFileName}`
  };
}

/**
 * 이미지 로드 실패 시 기본 이미지를 반환합니다.
 * @param categorySlug - 카테고리 슬러그
 * @returns 기본 이미지 매핑
 */
export function getFallbackImage(categorySlug: string): ImageMapping {
  const normalizedCategory = categorySlug.toLowerCase() as keyof typeof CATEGORY_IMAGE_PATHS;
  const categoryPaths = CATEGORY_IMAGE_PATHS[normalizedCategory];
  
  if (!categoryPaths) {
    return DEFAULT_IMAGES;
  }

  return {
    logo: `${categoryPaths.basePath}/default.png`,
    serviceImage: `${categoryPaths.servicePath}/default.png`,
    priceImage: `${categoryPaths.pricePath}/default.png`,
    searchbarLogo: `${categoryPaths.searchbarPath}/default.png`
  };
}

/**
 * 이미지 로드 에러 핸들러
 * @param event - 이미지 로드 에러 이벤트
 * @param fallbackSrc - 대체 이미지 경로
 */
export function handleImageError(
  event: Event | React.SyntheticEvent<HTMLImageElement, Event>, 
  fallbackSrc: string
) {
  const img = event.target as HTMLImageElement;
  if (img.src !== fallbackSrc) { // 무한 루프 방지
    img.src = fallbackSrc;
  }
}

/**
 * 이미지가 존재하는지 확인하는 함수
 * @param imagePath - 확인할 이미지 경로
 * @returns Promise<boolean>
 */
export function checkImageExists(imagePath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imagePath;
  });
}

/**
 * 사용 가능한 모든 카테고리 목록을 반환합니다.
 */
export function getAvailableCategories(): string[] {
  return Object.keys(CATEGORY_IMAGE_PATHS);
}

/**
 * 특정 카테고리의 모든 서비스 목록을 반환합니다.
 * @param categorySlug - 카테고리 슬러그
 */
export function getServicesInCategory(categorySlug: string): string[] {
  // 실제로는 데이터베이스나 다른 소스에서 가져와야 하지만,
  // 여기서는 매핑에서 해당 카테고리의 서비스들을 추정해서 반환
  const categoryMappings = {
    'chat': ['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'Microsoft Copilot'],
    'image': ['Midjourney', 'DALL·E', 'Stable Diffusion', 'Leonardo.ai'],
    'video': ['Runway', 'Pika', 'Lumalabs AI', 'Synthesia'],
    'audio': ['ElevenLabs', 'Suno AI', 'AIVA', 'Mubert'],
    'code': ['GitHub Copilot', 'Cursor', 'Claude Code', 'Tabnine'],
    'text': ['Jasper', 'Grammarly', 'Copy.ai', 'Wordtune', 'Magic Design'],
    'product': ['Gamma', 'Tome', 'Galileo AI', 'Miro AI', 'PromptoMANIA', 'Scalenut'],
    '3d': ['Meshy AI', 'Kaedim', 'Tripo', 'Rodin']
  };
  
  return categoryMappings[categorySlug as keyof typeof categoryMappings] || [];
}

/**
 * 개발용: 모든 이미지 매핑을 검증하는 함수
 */
export async function validateAllImageMappings(): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {};
  
  for (const [serviceName] of Object.entries(SERVICE_IMAGE_MAPPING)) {
    // 각 카테고리에 대해 이미지 존재 여부 확인
    const categories = getAvailableCategories();
    let found = false;
    
    for (const category of categories) {
      const mapping = getImageMapping(serviceName, category);
      const exists = await checkImageExists(mapping.logo);
      if (exists) {
        found = true;
        break;
      }
    }
    
    results[serviceName] = found;
  }
  
  return results;
}

/**
 * 개발용: 매핑되지 않은 서비스명 찾기
 */
export function findUnmappedServices(serviceNames: string[]): string[] {
  return serviceNames.filter(name => !SERVICE_IMAGE_MAPPING[name]);
}

/**
 * 개발용: 카테고리별 매핑된 서비스 수 확인
 */
export function getCategoryServiceCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  
  Object.keys(CATEGORY_IMAGE_PATHS).forEach(category => {
    counts[category] = getServicesInCategory(category).length;
  });
  
  return counts;
}