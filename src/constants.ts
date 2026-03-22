import { PersonalityType, PusherConfig } from "./types";

export const PUSHERS: Record<PersonalityType, PusherConfig> = {
  toxic: {
    type: 'toxic',
    name: '毒舌君',
    avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=toxic&backgroundColor=4A5568',
    primaryColor: '#4A5568',
    accentColor: '#63B3ED',
    greetings: ['哼，又在假装忙？', '这DDL是摆设？还不快点！', '啧，选我？那你最好真的做事。']
  },
  cute: {
    type: 'cute',
    name: '活力酱',
    avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=cute&backgroundColor=F6AD55',
    primaryColor: '#F6AD55',
    accentColor: '#FBD38D',
    greetings: ['叮！新副本✨', '冲冲冲！大冒险开始啦！🎉', '哇！今天也要元气满满哦！']
  },
  gentle: {
    type: 'gentle',
    name: '温柔姐',
    avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=gentle&backgroundColor=F687B3',
    primaryColor: '#F687B3',
    accentColor: '#FED7E2',
    greetings: ['听起来overwhelm呢，慢慢来。', '今天也要对自己温柔一点哦。', '我们先不急着拆步骤，聊聊你的想法？']
  }
};
