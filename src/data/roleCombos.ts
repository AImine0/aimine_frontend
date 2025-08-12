// [직업별 상황별 추천 조합 데이터] 각 직업별로 상황, 문구, 추천 AI 리스트를 포함
// 직업별 상황별 추천 조합 데이터

export interface RoleCombo {
  situation: string;
  description: string;
  aiList: string[];
}

export const roleCombos: Record<string, RoleCombo[]> = {
  '교육/연구': [
    {
      situation: '논문 작성',
      description: 'Connected Papers로 관련 논문 맥락부터 쭉 훑고, SciSpace에서 핵심만 요약해요. 마지막은 Jenni AI로 초안까지 싹 정리하면 논문 작성도 한결 쉬워져요.',
      aiList: ['Connected Papers', 'SciSpace', 'Jenni AI']
    },
    {
      situation: '퀴즈 제작',
      description: 'Gamma로 발표 자료를 손쉽게 만들고, Zep Quiz에서 퀴즈도 자동 생성해보세요.',
      aiList: ['Gamma', 'Zep Quiz']
    },
    {
      situation: '교육 영상 콘텐츠 제작',
      description: 'ChatGPT로 영상 스크립트를 간편하게 작성하고, Animaker로 영상 제작, ElevenLabs로 음성 더빙까지 한 번에!',
      aiList: ['ChatGPT', 'Animaker', 'ElevenLabs']
    }
  ],
  'IT/기술': [
    {
      situation: '논문 작성',
      description: 'Connected Papers로 관련 논문 맥락부터 쭉 훑고, SciSpace에서 핵심만 요약해요. 마지막은 Jenni AI로 초안까지 싹 정리하면 논문 작성도 한결 쉬워져요.',
      aiList: ['Connected Papers', 'SciSpace', 'Jenni AI']
    },
    {
      situation: '퀴즈 제작',
      description: 'Gamma로 발표 자료를 손쉽게 만들고, Zep Quiz에서 퀴즈도 자동 생성해보세요.',
      aiList: ['Gamma', 'Zep Quiz']
    },
    {
      situation: '교육 영상 콘텐츠 제작',
      description: 'ChatGPT로 영상 스크립트를 간편하게 작성하고, Animaker로 영상 제작, ElevenLabs로 음성 더빙까지 한 번에!',
      aiList: ['ChatGPT', 'Animaker', 'ElevenLabs']
    }
  ],
  '아트/디자인': [
    {
      situation: 'UXUI 디자인',
      description: 'Relume AI로 웹 페이지의 구조를 빠르게 잡고, Galileo AI에서 시안을 만들고, Uizard로 프로토타입까지 완성!',
      aiList: ['Relume', 'Galileo AI', 'Uizard']
    },
    {
      situation: '컨셉 아트',
      description: 'ChatGPT에서 막연한 아이디어를 정교한 컨셉으로 다듬고, PromptoMANIA로 프롬프트를 만들고, Midjourney로 이미지를 생성해보세요.',
      aiList: ['ChatGPT', 'PromptoMANIA', 'Midjourney']
    },
    {
      situation: '3D 디자인',
      description: 'Kaedim에서 아이디어 스케치를 3D 모델로 빠르게 생성하고, Meshy로 텍스처를 입히고, Lumalabs AI로 렌더링까지!',
      aiList: ['Kaedim', 'Meshy', 'Lumalabs AI']
    }
  ],
  '미디어/음악': [
    {
      situation: '콘텐츠 제작',
      description: 'Copy.ai로 전하고 싶은 메시지와 스크립트를 정리하고, Pika로 영상화, Typecast로 음성까지!',
      aiList: ['Copy.ai', 'Pika', 'Typecast']
    },
    {
      situation: '음악 생성',
      description: 'AIVA로 감정선이 깊은 음악을 작곡하고, Soundful에서 트랙을 만들고, LALAL.AI로 보컬/악기 분리까지!',
      aiList: ['AIVA', 'Soundful', 'LALAL.AI']
    },
    {
      situation: '설명 영상 제작',
      description: 'Lumen5에 텍스트를 입력해 슬라이드 기반 영상을 구성하고, Pika로 애니메이션, Runway로 효과까지!',
      aiList: ['Lumen5', 'Pika', 'Runway']
    }
  ],
  '기획/마케팅': [
    {
      situation: '마케팅 전략 기획',
      description: 'Crayon으로 경쟁사 분석과 시장 흐름을 빠르게 파악하고, Miro AI로 전략 맵을 그리고, Tome으로 프레젠테이션까지!',
      aiList: ['Crayon', 'Miro AI', 'Tome']
    },
    {
      situation: '광고/소셜 콘텐츠 제작',
      description: 'Scalenut으로 콘텐츠 흐름과 핵심 메시지를 먼저 설계하고, Copy.ai로 카피라이팅, Magic Design으로 디자인까지!',
      aiList: ['Scalenut', 'Copy.ai', 'Magic Design']
    }
  ],
  '경영/운영': [
    {
      situation: '업무 프로세스 최적화',
      description: '반복되는 업무는 Make로 자동화하고, 일정 스케줄은 Shiftee로 관리, 보고서는 Tome으로 정리!',
      aiList: ['Make', 'Shiftee', 'Tome']
    },
    {
      situation: '사업 전략 기획',
      description: 'AlphaSense에서 시장 및 산업 트렌드를 확보하고, ChatGPT로 아이디어를 구체화, Tome으로 전략 발표 자료까지!',
      aiList: ['AlphaSense', 'ChatGPT', 'Tome']
    }
  ]
}; 