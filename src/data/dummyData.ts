// src/data/dummyData.ts
// API 명세서에 맞는 통합된 더미 데이터

import type { 
  AIToolListItem, 
  AIToolDetail, 
  Category, 
  JobSituation,
  AITool 
} from '../types';
import { getImageMapping } from '../utils/imageMapping';

// AI 툴 목록 더미 데이터 (API 명세서: ToolListResponse)
export const dummyAIToolListItems: AIToolListItem[] = [
  {
    id: 1,
    serviceName: 'ChatGPT',
    description: 'OpenAI가 만든 가장 유명한 AI 챗봇',
    websiteUrl: 'https://chat.openai.com',
    logoUrl: getImageMapping('ChatGPT', 'chat').logo,
    launchDate: '2022-11-30',
    category: {
      id: 1,
      name: '챗봇',
      slug: 'chat'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 버전 + 유료 구독',
    overallRating: 4.8,
    viewCount: 15420,
    bookmarkCount: 892,
    keywords: ['텍스트 생성', '질문 답변', '코드 생성', '번역']
  },
  {
    id: 2,
    serviceName: 'Claude',
    description: 'Anthropic이 만든 똑똑하고 안전한 AI 챗봇',
    websiteUrl: 'https://claude.ai',
    logoUrl: getImageMapping('Claude', 'chat').logo,
    launchDate: '2024-06-21',
    category: {
      id: 1,
      name: '챗봇',
      slug: 'chat'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 버전 + 유료 구독',
    overallRating: 4.7,
    viewCount: 8920,
    bookmarkCount: 456,
    keywords: ['긴 문서 분석', '코드 생성', '창작 도우미', '안전한 대화']
  },
  {
    id: 3,
    serviceName: 'Gemini',
    description: '구글이 만든 멀티모달 AI 챗봇',
    websiteUrl: 'https://gemini.google.com',
    logoUrl: getImageMapping('Gemini', 'chat').logo,
    launchDate: '2023-03-21',
    category: {
      id: 1,
      name: '챗봇',
      slug: 'chat'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 버전 + 유료 구독',
    overallRating: 4.4,
    viewCount: 12340,
    bookmarkCount: 678,
    keywords: ['텍스트 생성', '이미지 인식', '코드 생성', '검색 연동']
  },
  {
    id: 4,
    serviceName: 'DALL·E',
    description: 'OpenAI가 만든 AI 이미지 생성 도구',
    websiteUrl: 'https://openai.com/dall-e-2',
    logoUrl: getImageMapping('DALL·E', 'image').logo,
    launchDate: '2022-04-06',
    category: {
      id: 2,
      name: '이미지 생성',
      slug: 'image'
    },
    pricingType: 'PAID',
    pricingInfo: '크레딧 기반 유료 서비스',
    overallRating: 4.6,
    viewCount: 9870,
    bookmarkCount: 543,
    keywords: ['이미지 생성', 'AI 아트', '창작 도구', '프롬프트 기반']
  },
  {
    id: 5,
    serviceName: 'Midjourney',
    description: '고품질 AI 아트 생성 도구',
    websiteUrl: 'https://midjourney.com',
    logoUrl: getImageMapping('Midjourney', 'image').logo,
    launchDate: '2022-07-12',
    category: {
      id: 2,
      name: '이미지 생성',
      slug: 'image'
    },
    pricingType: 'PAID',
    pricingInfo: '구독 기반 유료 서비스',
    overallRating: 4.9,
    viewCount: 11230,
    bookmarkCount: 789,
    keywords: ['AI 아트', '고품질 이미지', '창작 도구', '디자인']
  },
  {
    id: 6,
    serviceName: 'Stable Diffusion',
    description: '오픈소스 AI 이미지 생성 모델',
    websiteUrl: 'https://stability.ai',
    logoUrl: getImageMapping('Stable Diffusion', 'image').logo,
    launchDate: '2022-08-22',
    category: {
      id: 2,
      name: '이미지 생성',
      slug: 'image'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 버전 + 유료 API',
    overallRating: 4.5,
    viewCount: 8760,
    bookmarkCount: 432,
    keywords: ['이미지 생성', '오픈소스', '로컬 실행', '커스터마이징']
  },
  {
    id: 7,
    serviceName: 'Runway',
    description: 'AI 기반 비디오 편집 및 생성 플랫폼',
    websiteUrl: 'https://runway.ml',
    logoUrl: getImageMapping('Runway', 'video').logo,
    launchDate: '2021-03-15',
    category: {
      id: 3,
      name: '비디오 생성',
      slug: 'video'
    },
    pricingType: 'PAID',
    pricingInfo: '크레딧 기반 유료 서비스',
    overallRating: 4.7,
    viewCount: 6540,
    bookmarkCount: 321,
    keywords: ['비디오 편집', 'AI 생성', '모션 그래픽', '특수 효과']
  },
  {
    id: 8,
    serviceName: 'Pika Labs',
    description: 'AI 기반 비디오 생성 도구',
    websiteUrl: 'https://pika.art',
    logoUrl: getImageMapping('Pika Labs', 'video').logo,
    launchDate: '2023-04-10',
    category: {
      id: 3,
      name: '비디오 생성',
      slug: 'video'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 버전 + 유료 구독',
    overallRating: 4.6,
    viewCount: 5430,
    bookmarkCount: 298,
    keywords: ['비디오 생성', 'AI 아트', '애니메이션', '텍스트 투 비디오']
  },
  {
    id: 9,
    serviceName: 'ElevenLabs',
    description: 'AI 음성 생성 및 복제 플랫폼',
    websiteUrl: 'https://elevenlabs.io',
    logoUrl: getImageMapping('ElevenLabs', 'audio').logo,
    launchDate: '2022-06-01',
    category: {
      id: 4,
      name: '오디오 생성',
      slug: 'audio'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 크레딧 + 유료 구독',
    overallRating: 4.8,
    viewCount: 7890,
    bookmarkCount: 456,
    keywords: ['음성 생성', '음성 복제', 'TTS', 'AI 음성']
  },
  {
    id: 10,
    serviceName: 'Suno AI',
    description: 'AI 음악 생성 플랫폼',
    websiteUrl: 'https://suno.ai',
    logoUrl: getImageMapping('Suno AI', 'audio').logo,
    launchDate: '2023-12-01',
    category: {
      id: 4,
      name: '오디오 생성',
      slug: 'audio'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 버전 + 유료 구독',
    overallRating: 4.7,
    viewCount: 4320,
    bookmarkCount: 234,
    keywords: ['음악 생성', 'AI 작곡', '멜로디', '리듬']
  },
  {
    id: 11,
    serviceName: 'GitHub Copilot',
    description: 'AI 기반 코드 자동 완성 도구',
    websiteUrl: 'https://github.com/features/copilot',
    logoUrl: getImageMapping('GitHub Copilot', 'code').logo,
    launchDate: '2021-10-27',
    category: {
      id: 5,
      name: '코드 생성',
      slug: 'code'
    },
    pricingType: 'PAID',
    pricingInfo: '월 구독료',
    overallRating: 4.6,
    viewCount: 12340,
    bookmarkCount: 678,
    keywords: ['코드 자동 완성', 'AI 프로그래밍', '개발자 도구', 'IDE 통합']
  },
  {
    id: 12,
    serviceName: 'Cursor',
    description: 'AI 기반 코드 에디터',
    websiteUrl: 'https://cursor.sh',
    logoUrl: getImageMapping('Cursor', 'code').logo,
    launchDate: '2023-03-15',
    category: {
      id: 5,
      name: '코드 생성',
      slug: 'code'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 버전 + 유료 구독',
    overallRating: 4.5,
    viewCount: 8760,
    bookmarkCount: 432,
    keywords: ['코드 에디터', 'AI 프로그래밍', '자동 완성', '디버깅']
  },
  {
    id: 13,
    serviceName: 'Jasper',
    description: 'AI 기반 콘텐츠 생성 플랫폼',
    websiteUrl: 'https://jasper.ai',
    logoUrl: getImageMapping('Jasper', 'text').logo,
    launchDate: '2021-02-01',
    category: {
      id: 6,
      name: '텍스트 생성',
      slug: 'text'
    },
    pricingType: 'PAID',
    pricingInfo: '월 구독료',
    overallRating: 4.4,
    viewCount: 9870,
    bookmarkCount: 543,
    keywords: ['콘텐츠 생성', '마케팅', '블로그', '소셜 미디어']
  },
  {
    id: 14,
    serviceName: 'Grammarly',
    description: 'AI 기반 문법 검사 및 글쓰기 도우미',
    websiteUrl: 'https://grammarly.com',
    logoUrl: getImageMapping('Grammarly', 'text').logo,
    launchDate: '2009-07-01',
    category: {
      id: 6,
      name: '텍스트 생성',
      slug: 'text'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 버전 + 유료 구독',
    overallRating: 4.3,
    viewCount: 15420,
    bookmarkCount: 892,
    keywords: ['문법 검사', '맞춤법', '글쓰기', '영어 학습']
  },
  {
    id: 15,
    serviceName: 'Gamma',
    description: 'AI 기반 프레젠테이션 생성 플랫폼',
    websiteUrl: 'https://gamma.app',
    logoUrl: getImageMapping('Gamma', 'product').logo,
    launchDate: '2022-08-01',
    category: {
      id: 7,
      name: '생산성',
      slug: 'product'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 버전 + 유료 구독',
    overallRating: 4.6,
    viewCount: 6540,
    bookmarkCount: 321,
    keywords: ['프레젠테이션', '슬라이드', 'AI 생성', '비즈니스']
  },

];

// AI 툴 상세 더미 데이터 (API 명세서: ToolDetailResponse)
export const dummyAIToolDetails: Record<string, AIToolDetail> = {
  '1': {
    id: 1,
    serviceName: 'ChatGPT',
    description: 'OpenAI가 만든 가장 유명한 AI 챗봇',
    websiteUrl: 'https://chat.openai.com',
    logoUrl: getImageMapping('ChatGPT', 'chat').logo,
    launchDate: '2022-11-30',
    category: {
      id: 1,
      name: '챗봇',
      slug: 'chat'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 버전 + 유료 구독',
    pricingLink: 'https://openai.com/pricing',
    overallRating: 4.7,
    viewCount: 15420,
    bookmarkCount: 892,
    keywords: [
      {
        id: 1,
        keyword: '텍스트 생성',
        type: 'FEATURE'
      },
      {
        id: 2,
        keyword: '질문 답변',
        type: 'FEATURE'
      },
      {
        id: 3,
        keyword: '코드 생성',
        type: 'FEATURE'
      }
    ],
    videos: [
      {
        id: 1,
        title: 'ChatGPT 사용법 가이드',
        videoUrl: 'https://www.youtube.com/watch?v=o5MutYFWsM8',
        thumbnailUrl: 'https://img.youtube.com/vi/o5MutYFWsM8/maxresdefault.jpg',
        duration: 600,
        viewCount: 1250
      },
      {
        id: 2,
        title: 'ChatGPT 초보자 완벽 가이드',
        videoUrl: 'https://www.youtube.com/watch?v=JTxsNm9IdYU',
        thumbnailUrl: 'https://img.youtube.com/vi/JTxsNm9IdYU/maxresdefault.jpg',
        duration: 720,
        viewCount: 890
      }
    ],
    reviews: [
      {
        id: 1,
        user: {
          nickname: '사용자1'
        },
        rating: 5.0,
        content: '정말 유용한 AI 도구입니다!',
        createdAt: '2025-01-10T15:30:00Z'
      },
      {
        id: 2,
        user: {
          nickname: '개발자김'
        },
        rating: 4.5,
        content: '코드 생성 기능이 특히 좋습니다.',
        createdAt: '2025-01-09T10:15:00Z'
      }
    ]
  },
  '2': {
    id: 2,
    serviceName: 'Claude',
    description: 'Anthropic이 만든 똑똑하고 안전한 AI 챗봇',
    websiteUrl: 'https://claude.ai',
    logoUrl: getImageMapping('Claude', 'chat').logo,
    launchDate: '2024-06-21',
    category: {
      id: 1,
      name: '챗봇',
      slug: 'chat'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 버전 + 유료 구독',
    pricingLink: 'https://claude.ai/pricing',
    overallRating: 4.7,
    viewCount: 8920,
    bookmarkCount: 456,
    keywords: [
      {
        id: 4,
        keyword: '긴 문서 분석',
        type: 'FEATURE'
      },
      {
        id: 5,
        keyword: '코드 생성',
        type: 'FEATURE'
      }
    ],
    videos: [
      {
        id: 2,
        title: 'Claude로 문서 분석하기',
        videoUrl: 'https://www.youtube.com/watch?v=8Hnl0mXzRbI',
        thumbnailUrl: 'https://img.youtube.com/vi/8Hnl0mXzRbI/maxresdefault.jpg',
        duration: 480,
        viewCount: 890
      },
      {
        id: 3,
        title: 'Claude AI 완벽 사용법',
        videoUrl: 'https://www.youtube.com/watch?v=8Hnl0mXzRbI',
        thumbnailUrl: 'https://img.youtube.com/vi/8Hnl0mXzRbI/maxresdefault.jpg',
        duration: 540,
        viewCount: 650
      }
    ],
    reviews: [
      {
        id: 3,
        user: {
          nickname: '연구원박'
        },
        rating: 4.8,
        content: '긴 논문 분석에 최고입니다!',
        createdAt: '2025-01-08T14:20:00Z'
      }
    ]
  },
  '3': {
    id: 3,
    serviceName: 'Gemini',
    description: '구글이 만든 멀티모달 AI 챗봇',
    websiteUrl: 'https://gemini.google.com',
    logoUrl: getImageMapping('Gemini', 'chat').logo,
    launchDate: '2023-03-21',
    category: {
      id: 1,
      name: '챗봇',
      slug: 'chat'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 버전 + 유료 구독',
    pricingLink: 'https://gemini.google.com/pricing',
    overallRating: 4.4,
    viewCount: 12340,
    bookmarkCount: 678,
    keywords: [
      {
        id: 6,
        keyword: '텍스트 생성',
        type: 'FEATURE'
      },
      {
        id: 7,
        keyword: '이미지 인식',
        type: 'FEATURE'
      }
    ],
    videos: [
      {
        id: 3,
        title: 'Gemini 멀티모달 기능 소개',
        videoUrl: 'https://youtube.com/watch?v=...',
        thumbnailUrl: 'https://thumbnail-url.com',
        duration: 720,
        viewCount: 1560
      }
    ],
    reviews: [
      {
        id: 4,
        user: {
          nickname: '디자이너이'
        },
        rating: 4.3,
        content: '이미지 인식 기능이 유용합니다.',
        createdAt: '2025-01-07T16:45:00Z'
      }
    ]
  },
  '4': {
    id: 4,
    serviceName: 'DALL·E',
    description: 'OpenAI가 만든 AI 이미지 생성 도구',
    websiteUrl: 'https://openai.com/dall-e-2',
    logoUrl: getImageMapping('DALL·E', 'image').logo,
    launchDate: '2022-04-06',
    category: {
      id: 2,
      name: '이미지 생성',
      slug: 'image'
    },
    pricingType: 'PAID',
    pricingInfo: '크레딧 기반 유료 서비스',
    pricingLink: 'https://openai.com/pricing',
    overallRating: 4.6,
    viewCount: 9870,
    bookmarkCount: 543,
    keywords: [
      {
        id: 8,
        keyword: '이미지 생성',
        type: 'FEATURE'
      },
      {
        id: 9,
        keyword: 'AI 아트',
        type: 'FEATURE'
      }
    ],
    videos: [
      {
        id: 4,
        title: 'DALL-E 2로 이미지 생성하기',
        videoUrl: 'https://youtube.com/watch?v=...',
        thumbnailUrl: 'https://thumbnail-url.com',
        duration: 540,
        viewCount: 2340
      }
    ],
    reviews: [
      {
        id: 5,
        user: {
          nickname: '아티스트최'
        },
        rating: 4.7,
        content: '창의적인 이미지 생성에 최고입니다!',
        createdAt: '2025-01-06T11:30:00Z'
      }
    ]
  },
  '5': {
    id: 5,
    serviceName: 'Midjourney',
    description: '고품질 AI 아트 생성 도구',
    websiteUrl: 'https://midjourney.com',
    logoUrl: getImageMapping('Midjourney', 'image').logo,
    launchDate: '2022-07-12',
    category: {
      id: 2,
      name: '이미지 생성',
      slug: 'image'
    },
    pricingType: 'PAID',
    pricingInfo: '구독 기반 유료 서비스',
    pricingLink: 'https://midjourney.com/pricing',
    overallRating: 4.9,
    viewCount: 11230,
    bookmarkCount: 789,
    keywords: [
      {
        id: 10,
        keyword: 'AI 아트',
        type: 'FEATURE'
      },
      {
        id: 11,
        keyword: '고품질 이미지',
        type: 'FEATURE'
      }
    ],
    videos: [
      {
        id: 5,
        title: 'Midjourney 마스터하기',
        videoUrl: 'https://youtube.com/watch?v=...',
        thumbnailUrl: 'https://thumbnail-url.com',
        duration: 900,
        viewCount: 3450
      }
    ],
    reviews: [
      {
        id: 6,
        user: {
          nickname: '크리에이터김'
        },
        rating: 4.9,
        content: '정말 아름다운 이미지를 생성합니다!',
        createdAt: '2025-01-05T09:15:00Z'
      }
    ]
  },
  '6': {
    id: 6,
    serviceName: 'Stable Diffusion',
    description: '오픈소스 AI 이미지 생성 모델',
    websiteUrl: 'https://stability.ai',
    logoUrl: getImageMapping('Stable Diffusion', 'image').logo,
    launchDate: '2022-08-22',
    category: {
      id: 2,
      name: '이미지 생성',
      slug: 'image'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 버전 + 유료 API',
    pricingLink: 'https://stability.ai/pricing',
    overallRating: 4.5,
    viewCount: 8760,
    bookmarkCount: 432,
    keywords: [
      {
        id: 12,
        keyword: '오픈소스',
        type: 'FEATURE'
      },
      {
        id: 13,
        keyword: '로컬 실행',
        type: 'FEATURE'
      }
    ],
    videos: [
      {
        id: 6,
        title: 'Stable Diffusion 설치 및 사용법',
        videoUrl: 'https://youtube.com/watch?v=...',
        thumbnailUrl: 'https://thumbnail-url.com',
        duration: 1200,
        viewCount: 1890
      }
    ],
    reviews: [
      {
        id: 7,
        user: {
          nickname: '개발자박'
        },
        rating: 4.4,
        content: '오픈소스라서 커스터마이징이 자유롭습니다.',
        createdAt: '2025-01-04T14:20:00Z'
      }
    ]
  },
  '7': {
    id: 7,
    serviceName: 'Runway',
    description: 'AI 기반 비디오 편집 및 생성 플랫폼',
    websiteUrl: 'https://runway.ml',
    logoUrl: getImageMapping('Runway', 'video').logo,
    launchDate: '2021-03-15',
    category: {
      id: 3,
      name: '비디오 생성',
      slug: 'video'
    },
    pricingType: 'PAID',
    pricingInfo: '크레딧 기반 유료 서비스',
    pricingLink: 'https://runway.ml/pricing',
    overallRating: 4.7,
    viewCount: 6540,
    bookmarkCount: 321,
    keywords: [
      {
        id: 14,
        keyword: '비디오 편집',
        type: 'FEATURE'
      },
      {
        id: 15,
        keyword: 'AI 생성',
        type: 'FEATURE'
      }
    ],
    videos: [
      {
        id: 7,
        title: 'Runway로 AI 비디오 만들기',
        videoUrl: 'https://youtube.com/watch?v=...',
        thumbnailUrl: 'https://thumbnail-url.com',
        duration: 780,
        viewCount: 2670
      }
    ],
    reviews: [
      {
        id: 8,
        user: {
          nickname: '영상제작자이'
        },
        rating: 4.6,
        content: '비디오 편집이 정말 편리합니다!',
        createdAt: '2025-01-03T16:30:00Z'
      }
    ]
  },
  '8': {
    id: 8,
    serviceName: 'Pika Labs',
    description: 'AI 기반 비디오 생성 도구',
    websiteUrl: 'https://pika.art',
    logoUrl: getImageMapping('Pika Labs', 'video').logo,
    launchDate: '2023-04-10',
    category: {
      id: 3,
      name: '비디오 생성',
      slug: 'video'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 버전 + 유료 구독',
    pricingLink: 'https://pika.art/pricing',
    overallRating: 4.6,
    viewCount: 5430,
    bookmarkCount: 298,
    keywords: [
      {
        id: 16,
        keyword: '비디오 생성',
        type: 'FEATURE'
      },
      {
        id: 17,
        keyword: '애니메이션',
        type: 'FEATURE'
      }
    ],
    videos: [
      {
        id: 8,
        title: 'Pika Labs로 애니메이션 만들기',
        videoUrl: 'https://youtube.com/watch?v=...',
        thumbnailUrl: 'https://thumbnail-url.com',
        duration: 600,
        viewCount: 1890
      }
    ],
    reviews: [
      {
        id: 9,
        user: {
          nickname: '애니메이터최'
        },
        rating: 4.5,
        content: '애니메이션 생성이 놀랍습니다!',
        createdAt: '2025-01-02T10:45:00Z'
      }
    ]
  },
  '9': {
    id: 9,
    serviceName: 'ElevenLabs',
    description: 'AI 음성 생성 및 복제 플랫폼',
    websiteUrl: 'https://elevenlabs.io',
    logoUrl: getImageMapping('ElevenLabs', 'audio').logo,
    launchDate: '2022-06-01',
    category: {
      id: 4,
      name: '오디오 생성',
      slug: 'audio'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 크레딧 + 유료 구독',
    pricingLink: 'https://elevenlabs.io/pricing',
    overallRating: 4.8,
    viewCount: 7890,
    bookmarkCount: 456,
    keywords: [
      {
        id: 18,
        keyword: '음성 생성',
        type: 'FEATURE'
      },
      {
        id: 19,
        keyword: '음성 복제',
        type: 'FEATURE'
      }
    ],
    videos: [
      {
        id: 9,
        title: 'ElevenLabs로 AI 음성 만들기',
        videoUrl: 'https://youtube.com/watch?v=...',
        thumbnailUrl: 'https://thumbnail-url.com',
        duration: 660,
        viewCount: 3120
      }
    ],
    reviews: [
      {
        id: 10,
        user: {
          nickname: '성우김'
        },
        rating: 4.9,
        content: '음성 품질이 정말 자연스럽습니다!',
        createdAt: '2025-01-01T13:20:00Z'
      }
    ]
  },
  '10': {
    id: 10,
    serviceName: 'Suno AI',
    description: 'AI 음악 생성 플랫폼',
    websiteUrl: 'https://suno.ai',
    logoUrl: getImageMapping('Suno AI', 'audio').logo,
    launchDate: '2023-12-01',
    category: {
      id: 4,
      name: '오디오 생성',
      slug: 'audio'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 버전 + 유료 구독',
    pricingLink: 'https://suno.ai/pricing',
    overallRating: 4.7,
    viewCount: 4320,
    bookmarkCount: 234,
    keywords: [
      {
        id: 20,
        keyword: '음악 생성',
        type: 'FEATURE'
      },
      {
        id: 21,
        keyword: 'AI 작곡',
        type: 'FEATURE'
      }
    ],
    videos: [
      {
        id: 10,
        title: 'Suno AI로 음악 작곡하기',
        videoUrl: 'https://youtube.com/watch?v=...',
        thumbnailUrl: 'https://thumbnail-url.com',
        duration: 720,
        viewCount: 1890
      }
    ],
    reviews: [
      {
        id: 11,
        user: {
          nickname: '작곡가박'
        },
        rating: 4.6,
        content: '멜로디 생성이 창의적입니다!',
        createdAt: '2024-12-31T15:10:00Z'
      }
    ]
  },
  '11': {
    id: 11,
    serviceName: 'GitHub Copilot',
    description: 'AI 기반 코드 자동 완성 도구',
    websiteUrl: 'https://github.com/features/copilot',
    logoUrl: getImageMapping('GitHub Copilot', 'code').logo,
    launchDate: '2021-10-27',
    category: {
      id: 5,
      name: '코드 생성',
      slug: 'code'
    },
    pricingType: 'PAID',
    pricingInfo: '월 구독료',
    pricingLink: 'https://github.com/features/copilot',
    overallRating: 4.6,
    viewCount: 12340,
    bookmarkCount: 678,
    keywords: [
      {
        id: 22,
        keyword: '코드 자동 완성',
        type: 'FEATURE'
      },
      {
        id: 23,
        keyword: 'AI 프로그래밍',
        type: 'FEATURE'
      }
    ],
    videos: [
      {
        id: 11,
        title: 'GitHub Copilot 사용법',
        videoUrl: 'https://youtube.com/watch?v=...',
        thumbnailUrl: 'https://thumbnail-url.com',
        duration: 900,
        viewCount: 4560
      }
    ],
    reviews: [
      {
        id: 12,
        user: {
          nickname: '개발자최'
        },
        rating: 4.7,
        content: '코딩 생산성이 크게 향상됩니다!',
        createdAt: '2024-12-30T11:30:00Z'
      }
    ]
  },
  '12': {
    id: 12,
    serviceName: 'Cursor',
    description: 'AI 기반 코드 에디터',
    websiteUrl: 'https://cursor.sh',
    logoUrl: getImageMapping('Cursor', 'code').logo,
    launchDate: '2023-03-15',
    category: {
      id: 5,
      name: '코드 생성',
      slug: 'code'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 버전 + 유료 구독',
    pricingLink: 'https://cursor.sh/pricing',
    overallRating: 4.5,
    viewCount: 8760,
    bookmarkCount: 432,
    keywords: [
      {
        id: 24,
        keyword: '코드 에디터',
        type: 'FEATURE'
      },
      {
        id: 25,
        keyword: '자동 완성',
        type: 'FEATURE'
      }
    ],
    videos: [
      {
        id: 12,
        title: 'Cursor 에디터 소개',
        videoUrl: 'https://youtube.com/watch?v=...',
        thumbnailUrl: 'https://thumbnail-url.com',
        duration: 600,
        viewCount: 2340
      }
    ],
    reviews: [
      {
        id: 13,
        user: {
          nickname: '프로그래머이'
        },
        rating: 4.4,
        content: 'AI 기능이 통합된 에디터가 편리합니다.',
        createdAt: '2024-12-29T14:15:00Z'
      }
    ]
  },
  '13': {
    id: 13,
    serviceName: 'Jasper',
    description: 'AI 기반 콘텐츠 생성 플랫폼',
    websiteUrl: 'https://jasper.ai',
    logoUrl: getImageMapping('Jasper', 'text').logo,
    launchDate: '2021-02-01',
    category: {
      id: 6,
      name: '텍스트 생성',
      slug: 'text'
    },
    pricingType: 'PAID',
    pricingInfo: '월 구독료',
    pricingLink: 'https://jasper.ai/pricing',
    overallRating: 4.4,
    viewCount: 9870,
    bookmarkCount: 543,
    keywords: [
      {
        id: 26,
        keyword: '콘텐츠 생성',
        type: 'FEATURE'
      },
      {
        id: 27,
        keyword: '마케팅',
        type: 'FEATURE'
      }
    ],
    videos: [
      {
        id: 13,
        title: 'Jasper로 마케팅 콘텐츠 만들기',
        videoUrl: 'https://youtube.com/watch?v=...',
        thumbnailUrl: 'https://thumbnail-url.com',
        duration: 780,
        viewCount: 1890
      }
    ],
    reviews: [
      {
        id: 14,
        user: {
          nickname: '마케터김'
        },
        rating: 4.3,
        content: '마케팅 콘텐츠 작성에 유용합니다.',
        createdAt: '2024-12-28T09:45:00Z'
      }
    ]
  },
  '14': {
    id: 14,
    serviceName: 'Grammarly',
    description: 'AI 기반 문법 검사 및 글쓰기 도우미',
    websiteUrl: 'https://grammarly.com',
    logoUrl: getImageMapping('Grammarly', 'text').logo,
    launchDate: '2009-07-01',
    category: {
      id: 6,
      name: '텍스트 생성',
      slug: 'text'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 버전 + 유료 구독',
    pricingLink: 'https://grammarly.com/premium',
    overallRating: 4.3,
    viewCount: 15420,
    bookmarkCount: 892,
    keywords: [
      {
        id: 28,
        keyword: '문법 검사',
        type: 'FEATURE'
      },
      {
        id: 29,
        keyword: '맞춤법',
        type: 'FEATURE'
      }
    ],
    videos: [
      {
        id: 14,
        title: 'Grammarly 사용법 가이드',
        videoUrl: 'https://youtube.com/watch?v=...',
        thumbnailUrl: 'https://thumbnail-url.com',
        duration: 540,
        viewCount: 3450
      }
    ],
    reviews: [
      {
        id: 15,
        user: {
          nickname: '작가박'
        },
        rating: 4.2,
        content: '문법 검사가 정확합니다.',
        createdAt: '2024-12-27T16:20:00Z'
      }
    ]
  },
  '15': {
    id: 15,
    serviceName: 'Gamma',
    description: 'AI 기반 프레젠테이션 생성 플랫폼',
    websiteUrl: 'https://gamma.app',
    logoUrl: getImageMapping('Gamma', 'product').logo,
    launchDate: '2022-08-01',
    category: {
      id: 7,
      name: '생산성',
      slug: 'product'
    },
    pricingType: 'FREEMIUM',
    pricingInfo: '무료 버전 + 유료 구독',
    pricingLink: 'https://gamma.app/pricing',
    overallRating: 4.6,
    viewCount: 6540,
    bookmarkCount: 321,
    keywords: [
      {
        id: 30,
        keyword: '프레젠테이션',
        type: 'FEATURE'
      },
      {
        id: 31,
        keyword: '슬라이드',
        type: 'FEATURE'
      }
    ],
    videos: [
      {
        id: 15,
        title: 'Gamma로 프레젠테이션 만들기',
        videoUrl: 'https://youtube.com/watch?v=...',
        thumbnailUrl: 'https://thumbnail-url.com',
        duration: 660,
        viewCount: 2340
      }
    ],
    reviews: [
      {
        id: 16,
        user: {
          nickname: '강사이'
        },
        rating: 4.5,
        content: '프레젠테이션 제작이 빠르고 편리합니다!',
        createdAt: '2024-12-26T12:30:00Z'
      }
    ]
  },

};

// 카테고리 목록 더미 데이터 (API 명세서: CategoryListResponse)
export const dummyCategories: Category[] = [
  {
    id: 1,
    name: '챗봇',
    slug: 'chatbot',
    description: 'AI 챗봇 서비스들',
    icon: 'chat-icon.svg',
    parentId: null,
    toolCount: 25,
    children: [
      {
        id: 2,
        name: '대화형 AI',
        slug: 'conversational-ai',
        description: '자연스러운 대화가 가능한 AI',
        icon: 'conversation-icon.svg',
        parentId: 1,
        toolCount: 15
      }
    ]
  },
  {
    id: 3,
    name: '이미지 생성',
    slug: 'image-generation',
    description: 'AI 이미지 생성 서비스들',
    icon: 'image-icon.svg',
    parentId: null,
    toolCount: 18
  },
  {
    id: 4,
    name: '비디오 생성',
    slug: 'video-generation',
    description: 'AI 비디오 생성 서비스들',
    icon: 'video-icon.svg',
    parentId: null,
    toolCount: 12
  },
  {
    id: 5,
    name: '코드 생성',
    slug: 'code-generation',
    description: 'AI 코드 생성 서비스들',
    icon: 'code-icon.svg',
    parentId: null,
    toolCount: 8
  },
  {
    id: 6,
    name: '텍스트 생성',
    slug: 'text-generation',
    description: 'AI 텍스트 생성 서비스들',
    icon: 'text-icon.svg',
    parentId: null,
    toolCount: 20
  }
];

// 직업/상황별 추천 더미 데이터 (API 명세서: JobSituationListResponse)
export const dummyJobSituations: JobSituation[] = [
  {
    id: 1,
    category: '교육/연구',
    title: '강의 자료 제작할 때',
    description: '빠르고 매끄러운 발표 자료 제작에 특화된 AI로 강의의 퀄리티를 높여보세요.',
    sortOrder: 1,
    recommendations: [
      {
        tool: {
          id: 15,
          serviceName: 'Gamma',
          logoUrl: getImageMapping('Gamma', 'product').logo,
          category: {
            name: '프레젠테이션'
          }
        },
        recommendationText: 'PPT 제작, 슬라이드 제작',
        sortOrder: 1
      },
      {
        tool: {
          id: 15,
          serviceName: 'Gamma',
          logoUrl: getImageMapping('Gamma', 'product').logo,
          category: {
            name: '프레젠테이션'
          }
        },
        recommendationText: '세일즈·비즈니스용 프레젠테이션',
        sortOrder: 2
      },
      {
        tool: {
          id: 15,
          serviceName: 'Gamma',
          logoUrl: getImageMapping('Gamma', 'product').logo,
          category: {
            name: '프레젠테이션'
          }
        },
        recommendationText: 'AI 기반 프레젠테이션 생성',
        sortOrder: 3
      }
    ]
  },
  {
    id: 2,
    category: '교육/연구',
    title: '논문 작성하거나 자료 정리할 때',
    description: '자료 탐색, 핵심 요약부터 관련 논문 연결까지, 복잡한 리서치는 AI에게 맡겨보세요.',
    sortOrder: 2,
    recommendations: [
      {
        tool: {
          id: 13,
          serviceName: 'Jasper',
          logoUrl: getImageMapping('Jasper', 'text').logo,
          category: {
            name: 'AI 글쓰기 도우미'
          }
        },
        recommendationText: '논문·에세이 등 장문의 글쓰기',
        sortOrder: 1
      },
      {
        tool: {
          id: 14,
          serviceName: 'Grammarly',
          logoUrl: getImageMapping('Grammarly', 'text').logo,
          category: {
            name: '논문 검색 AI'
          }
        },
        recommendationText: '비슷한 논문들을 찾아 관계를 시각화',
        sortOrder: 2
      }
    ]
  },
  {
    id: 3,
    category: 'IT/기술',
    title: '코드 개발할 때',
    description: '개발자가 코드를 작성하고 디버깅할 때 유용한 AI 도구들',
    sortOrder: 1,
    recommendations: [
      {
        tool: {
          id: 1,
          serviceName: 'ChatGPT',
          logoUrl: getImageMapping('ChatGPT', 'chat').logo,
          category: {
            name: '챗봇'
          }
        },
        recommendationText: '코드 생성, 디버깅 도움',
        sortOrder: 1
      },
      {
        tool: {
          id: 11,
          serviceName: 'GitHub Copilot',
          logoUrl: getImageMapping('GitHub Copilot', 'code').logo,
          category: {
            name: '코드 생성 AI'
          }
        },
        recommendationText: '실시간 코드 제안',
        sortOrder: 2
      }
    ]
  },
  {
    id: 4,
    category: '아트/디자인',
    title: 'UXUI 디자인할 때',
    description: '디자이너가 웹/앱 디자인을 할 때 유용한 AI 도구들',
    sortOrder: 1,
    recommendations: [
      {
        tool: {
          id: 15,
          serviceName: 'Gamma',
          logoUrl: getImageMapping('Gamma', 'product').logo,
          category: {
            name: '디자인 AI'
          }
        },
        recommendationText: 'UI/UX 디자인 자동 생성',
        sortOrder: 1
      },
      {
        tool: {
          id: 5,
          serviceName: 'Midjourney',
          logoUrl: getImageMapping('Midjourney', 'image').logo,
          category: {
            name: '프로토타이핑'
          }
        },
        recommendationText: '프로토타입 제작',
        sortOrder: 2
      }
    ]
  },
  {
    id: 5,
    category: '미디어/음악',
    title: '영상 콘텐츠 제작할 때',
    description: '미디어 제작자가 영상 콘텐츠를 만들 때 유용한 AI 도구들',
    sortOrder: 1,
    recommendations: [
      {
        tool: {
          id: 8,
          serviceName: 'Pika Labs',
          logoUrl: getImageMapping('Pika Labs', 'video').logo,
          category: {
            name: '영상 생성 AI'
          }
        },
        recommendationText: 'AI 영상 생성',
        sortOrder: 1
      },
      {
        tool: {
          id: 7,
          serviceName: 'Runway',
          logoUrl: getImageMapping('Runway', 'video').logo,
          category: {
            name: '영상 편집 AI'
          }
        },
        recommendationText: 'AI 영상 편집',
        sortOrder: 2
      }
    ]
  },
  {
    id: 6,
    category: '기획/마케팅',
    title: '마케팅 전략 기획할 때',
    description: '마케터가 전략을 수립할 때 유용한 AI 도구들',
    sortOrder: 1,
    recommendations: [
      {
        tool: {
          id: 4,
          serviceName: 'DALL·E',
          logoUrl: getImageMapping('DALL·E', 'image').logo,
          category: {
            name: '시장 분석'
          }
        },
        recommendationText: '경쟁사 분석과 시장 흐름 파악',
        sortOrder: 1
      },
      {
        tool: {
          id: 3,
          serviceName: 'Gemini',
          logoUrl: getImageMapping('Gemini', 'chat').logo,
          category: {
            name: '협업 도구'
          }
        },
        recommendationText: '전략 맵 그리기',
        sortOrder: 2
      }
    ]
  },
  {
    id: 7,
    category: '경영/운영',
    title: '업무 프로세스 최적화할 때',
    description: '경영자가 업무 효율을 높일 때 유용한 AI 도구들',
    sortOrder: 1,
    recommendations: [
      {
        tool: {
          id: 2,
          serviceName: 'Claude',
          logoUrl: getImageMapping('Claude', 'chat').logo,
          category: {
            name: '자동화'
          }
        },
        recommendationText: '반복되는 업무 자동화',
        sortOrder: 1
      },
      {
        tool: {
          id: 15,
          serviceName: 'Gamma',
          logoUrl: getImageMapping('Gamma', 'product').logo,
          category: {
            name: '프레젠테이션'
          }
        },
        recommendationText: '보고서 정리',
        sortOrder: 2
      }
    ]
  }
];

// 기존 프론트엔드 호환성을 위한 변환 함수들
export const transformToAITool = (apiTool: AIToolListItem): AITool => {
  // 이미지 매핑 적용
  const imageMapping = getImageMapping(apiTool.serviceName, apiTool.category.slug);
  
  return {
    id: apiTool.id.toString(),
    name: apiTool.serviceName,
    category: apiTool.category.slug,
    description: apiTool.description,
    features: apiTool.keywords,
    rating: apiTool.overallRating,
    tags: apiTool.keywords,
    url: apiTool.websiteUrl,
    releaseDate: apiTool.launchDate,
    company: 'Unknown',
    pricing: apiTool.pricingType.toLowerCase() as 'free' | 'paid' | 'freemium',
    featured: false,
    categoryLabel: apiTool.category.name,
    roles: [],
    userCount: apiTool.viewCount,
    aiRating: apiTool.overallRating,
    // 이미지 매핑 필드들 추가
    logoUrl: imageMapping.logo,
    serviceImageUrl: imageMapping.serviceImage,
    priceImageUrl: imageMapping.priceImage,
    searchbarLogoUrl: imageMapping.searchbarLogo
  };
};

// 키워드 태그 목록
export const keywordTags: string[] = [
  '전체', '이미지 생성', '비디오 생성', '코드 생성', '콘텐츠 생성', '아이디어 제공',
  '글쓰기 보조', '요약', '번역', '심리 상담', 'AI 캐릭터 채팅', '논문', '교육', '개발자 특화'
];

// API 응답 구조로 변환
export const createApiResponse = <T>(data: T) => ({
  success: true,
  data,
  message: 'Success'
}); 