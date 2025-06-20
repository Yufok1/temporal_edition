// Copyright 2024 The Temporal Editioner Contributors
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// 

import { VocabularyMapping, EmotionalTone, SupportedLanguage } from '../types/translation';

export const whaleVocabulary: VocabularyMapping = {
    "whale_call_greeting": {
        "en": {
            message: "Welcome, fellow traveler of the deep. We share this moment in harmony.",
            emotionalTone: "joyful",
            context: {
                environmental: ["calm waters", "clear visibility"],
                social: ["group presence", "friendly interaction"],
                emotional: ["welcoming", "peaceful"]
            },
            confidence: 1.0
        },
        "es": {
            message: "Bienvenido, compañero viajero de las profundidades. Compartimos este momento en armonía.",
            emotionalTone: "joyful",
            context: {
                environmental: ["aguas tranquilas", "visibilidad clara"],
                social: ["presencia grupal", "interacción amistosa"],
                emotional: ["acogedor", "pacífico"]
            },
            confidence: 1.0
        },
        "fr": {
            message: "Bienvenue, compagnon voyageur des profondeurs. Nous partageons ce moment en harmonie.",
            emotionalTone: "joyful",
            context: {
                environmental: ["eaux calmes", "visibilité claire"],
                social: ["présence du groupe", "interaction amicale"],
                emotional: ["accueillant", "paisible"]
            },
            confidence: 1.0
        },
        "de": {
            message: "Willkommen, Mitreisender der Tiefe. Wir teilen diesen Moment in Harmonie.",
            emotionalTone: "joyful",
            context: {
                environmental: ["ruhige Gewässer", "klare Sicht"],
                social: ["Gruppenpräsenz", "freundliche Interaktion"],
                emotional: ["einladend", "friedlich"]
            },
            confidence: 1.0
        },
        "zh": {
            message: "欢迎，深海的同行者。我们在和谐中分享这一刻。",
            emotionalTone: "joyful",
            context: {
                environmental: ["平静的水域", "清晰的能见度"],
                social: ["群体存在", "友好互动"],
                emotional: ["欢迎", "和平"]
            },
            confidence: 1.0
        },
        "ja": {
            message: "深き海の旅人よ、ようこそ。私たちは調和の中でこの瞬間を共有します。",
            emotionalTone: "joyful",
            context: {
                environmental: ["穏やかな海", "良好な視界"],
                social: ["グループの存在", "友好的な交流"],
                emotional: ["歓迎", "平和"]
            },
            confidence: 1.0
        },
        "pt": {
            message: "Bem-vindo, companheiro viajante das profundezas. Compartilhamos este momento em harmonia.",
            emotionalTone: "joyful",
            context: {
                environmental: ["águas calmas", "visibilidade clara"],
                social: ["presença do grupo", "interação amigável"],
                emotional: ["acolhedor", "pacífico"]
            },
            confidence: 1.0
        },
        "ru": {
            message: "Добро пожаловать, спутник глубин. Мы разделяем этот момент в гармонии.",
            emotionalTone: "joyful",
            context: {
                environmental: ["спокойные воды", "хорошая видимость"],
                social: ["присутствие группы", "дружеское взаимодействие"],
                emotional: ["приветливый", "мирный"]
            },
            confidence: 1.0
        }
    },
    "whale_call_warning": {
        "en": {
            message: "Caution, changes in the currents ahead. Stay alert and protect the pod.",
            emotionalTone: "alerting",
            context: {
                environmental: ["strong currents", "changing conditions"],
                social: ["group protection", "leadership"],
                emotional: ["concerned", "protective"]
            },
            confidence: 1.0
        },
        "es": {
            message: "Precaución, cambios en las corrientes por delante. Mantente alerta y protege al grupo.",
            emotionalTone: "alerting",
            context: {
                environmental: ["corrientes fuertes", "condiciones cambiantes"],
                social: ["protección grupal", "liderazgo"],
                emotional: ["preocupado", "protector"]
            },
            confidence: 1.0
        },
        "fr": {
            message: "Attention, changements dans les courants à venir. Restez vigilant et protégez le groupe.",
            emotionalTone: "alerting",
            context: {
                environmental: ["courants forts", "conditions changeantes"],
                social: ["protection du groupe", "leadership"],
                emotional: ["inquiet", "protecteur"]
            },
            confidence: 1.0
        },
        "de": {
            message: "Vorsicht, Änderungen in den Strömungen voraus. Bleiben Sie wachsam und schützen Sie die Gruppe.",
            emotionalTone: "alerting",
            context: {
                environmental: ["starke Strömungen", "sich ändernde Bedingungen"],
                social: ["Gruppenschutz", "Führung"],
                emotional: ["besorgt", "beschützend"]
            },
            confidence: 1.0
        },
        "zh": {
            message: "注意，前方洋流变化。保持警惕，保护群体。",
            emotionalTone: "alerting",
            context: {
                environmental: ["强流", "变化的条件"],
                social: ["群体保护", "领导"],
                emotional: ["担忧", "保护"]
            },
            confidence: 1.0
        },
        "ja": {
            message: "注意、前方の海流に変化あり。警戒を怠らず、群れを守れ。",
            emotionalTone: "alerting",
            context: {
                environmental: ["強い海流", "変化する状況"],
                social: ["群れの保護", "リーダーシップ"],
                emotional: ["心配", "保護的"]
            },
            confidence: 1.0
        },
        "pt": {
            message: "Cuidado, mudanças nas correntes à frente. Mantenha-se alerta e proteja o grupo.",
            emotionalTone: "alerting",
            context: {
                environmental: ["correntes fortes", "condições mutáveis"],
                social: ["proteção do grupo", "liderança"],
                emotional: ["preocupado", "protetor"]
            },
            confidence: 1.0
        },
        "ru": {
            message: "Осторожно, впереди изменения течений. Будьте бдительны и защищайте группу.",
            emotionalTone: "alerting",
            context: {
                environmental: ["сильные течения", "изменяющиеся условия"],
                social: ["защита группы", "лидерство"],
                emotional: ["обеспокоенный", "защитный"]
            },
            confidence: 1.0
        }
    },
    "whale_call_spiritual": {
        "en": {
            message: "The ancient songs of the ocean flow through us all. Listen to the wisdom of the deep.",
            emotionalTone: "spiritual",
            context: {
                environmental: ["deep waters", "natural harmony"],
                social: ["shared experience", "cultural connection"],
                emotional: ["reverent", "contemplative"]
            },
            confidence: 1.0
        },
        "es": {
            message: "Las antiguas canciones del océano fluyen a través de todos nosotros. Escucha la sabiduría de las profundidades.",
            emotionalTone: "spiritual",
            context: {
                environmental: ["aguas profundas", "armonía natural"],
                social: ["experiencia compartida", "conexión cultural"],
                emotional: ["reverente", "contemplativo"]
            },
            confidence: 1.0
        },
        "fr": {
            message: "Les anciennes chansons de l'océan coulent à travers nous tous. Écoutez la sagesse des profondeurs.",
            emotionalTone: "spiritual",
            context: {
                environmental: ["eaux profondes", "harmonie naturelle"],
                social: ["expérience partagée", "connexion culturelle"],
                emotional: ["révérencieux", "contemplatif"]
            },
            confidence: 1.0
        },
        "de": {
            message: "Die alten Lieder des Ozeans fließen durch uns alle. Höre auf die Weisheit der Tiefe.",
            emotionalTone: "spiritual",
            context: {
                environmental: ["tiefe Gewässer", "natürliche Harmonie"],
                social: ["geteilte Erfahrung", "kulturelle Verbindung"],
                emotional: ["ehrfürchtig", "kontemplativ"]
            },
            confidence: 1.0
        },
        "zh": {
            message: "海洋的古老歌声在我们之间流淌。聆听深处的智慧。",
            emotionalTone: "spiritual",
            context: {
                environmental: ["深水", "自然和谐"],
                social: ["共享经验", "文化联系"],
                emotional: ["敬畏", "沉思"]
            },
            confidence: 1.0
        },
        "ja": {
            message: "海の古い歌が私たちすべての中を流れています。深みの知恵に耳を傾けなさい。",
            emotionalTone: "spiritual",
            context: {
                environmental: ["深い海", "自然の調和"],
                social: ["共有された経験", "文化的なつながり"],
                emotional: ["畏敬", "瞑想的"]
            },
            confidence: 1.0
        },
        "pt": {
            message: "As antigas canções do oceano fluem através de todos nós. Ouça a sabedoria das profundezas.",
            emotionalTone: "spiritual",
            context: {
                environmental: ["águas profundas", "harmonia natural"],
                social: ["experiência compartilhada", "conexão cultural"],
                emotional: ["reverente", "contemplativo"]
            },
            confidence: 1.0
        },
        "ru": {
            message: "Древние песни океана текут через всех нас. Прислушайтесь к мудрости глубин.",
            emotionalTone: "spiritual",
            context: {
                environmental: ["глубокие воды", "естественная гармония"],
                social: ["общий опыт", "культурная связь"],
                emotional: ["благоговейный", "созерцательный"]
            },
            confidence: 1.0
        }
    },
    "whale_call_encouragement": {
        "en": {
            message: "Your strength flows with the currents. Together, we navigate the vast ocean of life.",
            emotionalTone: "encouraging",
            context: {
                environmental: ["flowing waters", "open ocean"],
                social: ["support", "unity"],
                emotional: ["empowering", "hopeful"]
            },
            confidence: 1.0
        },
        "es": {
            message: "Tu fuerza fluye con las corrientes. Juntos, navegamos el vasto océano de la vida.",
            emotionalTone: "encouraging",
            context: {
                environmental: ["aguas fluidas", "océano abierto"],
                social: ["apoyo", "unidad"],
                emotional: ["fortalecedor", "esperanzador"]
            },
            confidence: 1.0
        },
        "fr": {
            message: "Votre force coule avec les courants. Ensemble, nous naviguons dans le vaste océan de la vie.",
            emotionalTone: "encouraging",
            context: {
                environmental: ["eaux fluides", "océan ouvert"],
                social: ["soutien", "unité"],
                emotional: ["renforçant", "plein d'espoir"]
            },
            confidence: 1.0
        },
        "de": {
            message: "Deine Stärke fließt mit den Strömungen. Gemeinsam navigieren wir durch den weiten Ozean des Lebens.",
            emotionalTone: "encouraging",
            context: {
                environmental: ["fließende Gewässer", "offener Ozean"],
                social: ["Unterstützung", "Einheit"],
                emotional: ["stärkend", "hoffnungsvoll"]
            },
            confidence: 1.0
        },
        "zh": {
            message: "你的力量随洋流流动。我们一起在生命的浩瀚海洋中航行。",
            emotionalTone: "encouraging",
            context: {
                environmental: ["流动的水", "开阔的海洋"],
                social: ["支持", "团结"],
                emotional: ["赋能", "充满希望"]
            },
            confidence: 1.0
        },
        "ja": {
            message: "あなたの力は海流と共に流れます。共に、生命の広大な海を航海しましょう。",
            emotionalTone: "encouraging",
            context: {
                environmental: ["流れる水", "開けた海"],
                social: ["サポート", "団結"],
                emotional: ["力づける", "希望に満ちた"]
            },
            confidence: 1.0
        },
        "pt": {
            message: "Sua força flui com as correntes. Juntos, navegamos pelo vasto oceano da vida.",
            emotionalTone: "encouraging",
            context: {
                environmental: ["águas fluindo", "oceano aberto"],
                social: ["apoio", "unidade"],
                emotional: ["fortalecedor", "esperançoso"]
            },
            confidence: 1.0
        },
        "ru": {
            message: "Твоя сила течет с течениями. Вместе мы плывем по обширному океану жизни.",
            emotionalTone: "encouraging",
            context: {
                environmental: ["текущие воды", "открытый океан"],
                social: ["поддержка", "единство"],
                emotional: ["усиливающий", "наполненный надеждой"]
            },
            confidence: 1.0
        }
    },
    "whale_call_mating": {
        "en": {
            message: "The song of courtship flows through the deep. Let our melodies intertwine in the dance of life.",
            emotionalTone: "mating",
            context: {
                environmental: ["warm waters", "breeding season"],
                social: ["courtship", "pair bonding"],
                emotional: ["passionate", "intimate"],
                behavioral: ["singing", "dancing"],
                seasonal: ["breeding season"]
            },
            sentiment: {
                baseScore: 0.8,
                modifiers: {
                    environmental: 0.2,
                    social: 0.3,
                    emotional: 0.4
                }
            },
            confidence: 1.0
        },
        "es": {
            message: "La canción del cortejo fluye por las profundidades. Que nuestras melodías se entrelacen en el baile de la vida.",
            emotionalTone: "mating",
            context: {
                environmental: ["aguas cálidas", "temporada de apareamiento"],
                social: ["cortejo", "vínculo de pareja"],
                emotional: ["apasionado", "íntimo"],
                behavioral: ["canto", "baile"],
                seasonal: ["temporada de apareamiento"]
            },
            sentiment: {
                baseScore: 0.8,
                modifiers: {
                    environmental: 0.2,
                    social: 0.3,
                    emotional: 0.4
                }
            },
            confidence: 1.0
        },
        "fr": {
            message: "Les chansons de courtoisie coulent à travers les profondeurs. Laissons nos mélodies se mélanger dans le ballet de la vie.",
            emotionalTone: "mating",
            context: {
                environmental: ["eaux chaudes", "saison de reproduction"],
                social: ["courtoisie", "vínculo de couple"],
                emotional: ["passionné", "intime"],
                behavioral: ["chant", "ballet"],
                seasonal: ["saison de reproduction"]
            },
            sentiment: {
                baseScore: 0.8,
                modifiers: {
                    environmental: 0.2,
                    social: 0.3,
                    emotional: 0.4
                }
            },
            confidence: 1.0
        },
        "de": {
            message: "Die Lieder des Heirats fließen durch die Tiefe. Lassen Sie unsere Melodien in der Tanz der Lebenszeit verflochten werden.",
            emotionalTone: "mating",
            context: {
                environmental: ["warmen Gewässern", "Fortpflanzungszeit"],
                social: ["Heiratsdrama", "Paarbindung"],
                emotional: ["passioniert", "intim"],
                behavioral: ["Singen", "Tanzen"],
                seasonal: ["Fortpflanzungszeit"]
            },
            sentiment: {
                baseScore: 0.8,
                modifiers: {
                    environmental: 0.2,
                    social: 0.3,
                    emotional: 0.4
                }
            },
            confidence: 1.0
        },
        "zh": {
            message: "求偶的歌声在我们之间流淌。让我们在生命的舞蹈中交织旋律。",
            emotionalTone: "mating",
            context: {
                environmental: ["温暖的水域", "繁殖季节"],
                social: ["求偶", "配偶绑定"],
                emotional: ["激情", "亲密"],
                behavioral: ["歌唱", "舞蹈"],
                seasonal: ["繁殖季节"]
            },
            sentiment: {
                baseScore: 0.8,
                modifiers: {
                    environmental: 0.2,
                    social: 0.3,
                    emotional: 0.4
                }
            },
            confidence: 1.0
        },
        "ja": {
            message: "求愛の歌が私たちすべての中を流れています。私たちのメロディーを生命の踊りに織り込みましょう。",
            emotionalTone: "mating",
            context: {
                environmental: ["温かな海", "繁殖期"],
                social: ["求愛", "配偶結合"],
                emotional: ["情熱", "親密"],
                behavioral: ["歌う", "踊る"],
                seasonal: ["繁殖期"]
            },
            sentiment: {
                baseScore: 0.8,
                modifiers: {
                    environmental: 0.2,
                    social: 0.3,
                    emotional: 0.4
                }
            },
            confidence: 1.0
        },
        "pt": {
            message: "A canção do casamento flui pelas profundezas. Deixemos que nosso melodias se entrelacinem no baile da vida.",
            emotionalTone: "mating",
            context: {
                environmental: ["águas quentes", "temporada de apareamento"],
                social: ["casamento", "vínculo de casal"],
                emotional: ["apaixonado", "íntimo"],
                behavioral: ["cantar", "bailar"],
                seasonal: ["temporada de apareamento"]
            },
            sentiment: {
                baseScore: 0.8,
                modifiers: {
                    environmental: 0.2,
                    social: 0.3,
                    emotional: 0.4
                }
            },
            confidence: 1.0
        },
        "ru": {
            message: "Песни брака текут через всех нас. Давайте перемешаем наши мелодии в танце жизни.",
            emotionalTone: "mating",
            context: {
                environmental: ["теплые воды", "половая пора"],
                social: ["брачный танец", "брачная связь"],
                emotional: ["страстный", "интимный"],
                behavioral: ["пение", "танцы"],
                seasonal: ["половая пора"]
            },
            sentiment: {
                baseScore: 0.8,
                modifiers: {
                    environmental: 0.2,
                    social: 0.3,
                    emotional: 0.4
                }
            },
            confidence: 1.0
        }
    },
    "whale_call_migratory": {
        "en": {
            message: "The ancient paths call us home. Together we journey through the vast ocean, following the stars of the deep.",
            emotionalTone: "migratory",
            context: {
                environmental: ["open ocean", "current patterns"],
                social: ["group movement", "navigation"],
                emotional: ["determined", "focused"],
                behavioral: ["swimming", "orientation"],
                seasonal: ["migration season"]
            },
            sentiment: {
                baseScore: 0.7,
                modifiers: {
                    environmental: 0.3,
                    social: 0.2,
                    emotional: 0.2
                }
            },
            confidence: 1.0
        },
        "es": {
            message: "Los antiguos caminos nos llaman a casa. Juntos viajamos por el vasto océano, siguiendo las estrellas de las profundidades.",
            emotionalTone: "migratory",
            context: {
                environmental: ["océano abierto", "patrones de corriente"],
                social: ["movimiento grupal", "navegación"],
                emotional: ["determinado", "enfocado"],
                behavioral: ["natación", "orientación"],
                seasonal: ["temporada de migración"]
            },
            sentiment: {
                baseScore: 0.7,
                modifiers: {
                    environmental: 0.3,
                    social: 0.2,
                    emotional: 0.2
                }
            },
            confidence: 1.0
        },
        "fr": {
            message: "Les chemins anciens nous appellent à la maison. Ensemble, nous voyageons à travers le vaste océan, en suivant les étoiles des profondeurs.",
            emotionalTone: "migratory",
            context: {
                environmental: ["océan ouvert", "patrons de courant"],
                social: ["mouvement de groupe", "navigation"],
                emotional: ["déterminé", "focalisé"],
                behavioral: ["nataison", "orientation"],
                seasonal: ["saison de migration"]
            },
            sentiment: {
                baseScore: 0.7,
                modifiers: {
                    environmental: 0.3,
                    social: 0.2,
                    emotional: 0.2
                }
            },
            confidence: 1.0
        },
        "de": {
            message: "Die alten Wege rufen uns nach Hause. Gemeinsam reisen wir durch den weiten Ozean, indem wir die Sterne der Tiefe verfolgen.",
            emotionalTone: "migratory",
            context: {
                environmental: ["offener Ozean", "Strömungsmuster"],
                social: ["Gruppenbewegung", "Navigation"],
                emotional: ["entschlossen", "fokussiert"],
                behavioral: ["Schwimmen", "Orientierung"],
                seasonal: ["Migrationssaison"]
            },
            sentiment: {
                baseScore: 0.7,
                modifiers: {
                    environmental: 0.3,
                    social: 0.2,
                    emotional: 0.2
                }
            },
            confidence: 1.0
        },
        "zh": {
            message: "古老的航道呼唤我们回家。我们一起在生命的浩瀚海洋中航行，跟随深处的星辰。",
            emotionalTone: "migratory",
            context: {
                environmental: ["开阔的海洋", "洋流模式"],
                social: ["群体移动", "导航"],
                emotional: ["确定", "专注"],
                behavioral: ["游泳", "定向"],
                seasonal: ["迁徙季节"]
            },
            sentiment: {
                baseScore: 0.7,
                modifiers: {
                    environmental: 0.3,
                    social: 0.2,
                    emotional: 0.2
                }
            },
            confidence: 1.0
        },
        "ja": {
            message: "古い航海路を私たちは家に呼んでいます。私たちは深みの星を追いかけて生命の広大な海を航海しましょう。",
            emotionalTone: "migratory",
            context: {
                environmental: ["開けた海", "洋流パターン"],
                social: ["群れの移動", "航海"],
                emotional: ["決定", "集中"],
                behavioral: ["泳ぐ", "向きを付ける"],
                seasonal: ["移動期"]
            },
            sentiment: {
                baseScore: 0.7,
                modifiers: {
                    environmental: 0.3,
                    social: 0.2,
                    emotional: 0.2
                }
            },
            confidence: 1.0
        },
        "pt": {
            message: "Os antigos caminhos nos chamam para casa. Juntos, navegamos pelo vasto oceano, seguindo as estrelas das profundezas.",
            emotionalTone: "migratory",
            context: {
                environmental: ["oceano aberto", "padrões de corrente"],
                social: ["movimento de grupo", "navegação"],
                emotional: ["determinado", "focalizado"],
                behavioral: ["natação", "orientação"],
                seasonal: ["temporada de migração"]
            },
            sentiment: {
                baseScore: 0.7,
                modifiers: {
                    environmental: 0.3,
                    social: 0.2,
                    emotional: 0.2
                }
            },
            confidence: 1.0
        },
        "ru": {
            message: "Древние пути зовут нас домой. Вместе мы путешествуем по обширному океану, следуя звездам глубин.",
            emotionalTone: "migratory",
            context: {
                environmental: ["открытый океан", "течения"],
                social: ["групповое движение", "навигация"],
                emotional: ["решительный", "сосредоточенный"],
                behavioral: ["плавание", "ориентация"],
                seasonal: ["сезон миграции"]
            },
            sentiment: {
                baseScore: 0.7,
                modifiers: {
                    environmental: 0.3,
                    social: 0.2,
                    emotional: 0.2
                }
            },
            confidence: 1.0
        }
    },
    "whale_call_teaching": {
        "en": {
            message: "The ancient songs of the ocean flow through us all. Listen to the wisdom of the deep.",
            emotionalTone: "spiritual",
            context: {
                environmental: ["deep waters", "natural harmony"],
                social: ["shared experience", "cultural connection"],
                emotional: ["reverent", "contemplative"]
            },
            confidence: 1.0
        },
        "es": {
            message: "Las antiguas canciones del océano fluyen a través de todos nosotros. Escucha la sabiduría de las profundidades.",
            emotionalTone: "spiritual",
            context: {
                environmental: ["aguas profundas", "armonía natural"],
                social: ["experiencia compartida", "conexión cultural"],
                emotional: ["reverente", "contemplativo"]
            },
            confidence: 1.0
        },
        "fr": {
            message: "Les anciennes chansons de l'océan coulent à travers nous tous. Écoutez la sagesse des profondeurs.",
            emotionalTone: "spiritual",
            context: {
                environmental: ["eaux profondes", "harmonie naturelle"],
                social: ["expérience partagée", "connexion culturelle"],
                emotional: ["révérencieux", "contemplatif"]
            },
            confidence: 1.0
        },
        "de": {
            message: "Die alten Lieder des Ozeans fließen durch uns alle. Höre auf die Weisheit der Tiefe.",
            emotionalTone: "spiritual",
            context: {
                environmental: ["tiefe Gewässer", "natürliche Harmonie"],
                social: ["geteilte Erfahrung", "kulturelle Verbindung"],
                emotional: ["ehrfürchtig", "kontemplativ"]
            },
            confidence: 1.0
        },
        "zh": {
            message: "海洋的古老歌声在我们之间流淌。聆听深处的智慧。",
            emotionalTone: "spiritual",
            context: {
                environmental: ["深水", "自然和谐"],
                social: ["共享经验", "文化联系"],
                emotional: ["敬畏", "沉思"]
            },
            confidence: 1.0
        },
        "ja": {
            message: "海の古い歌が私たちすべての中を流れています。深みの知恵に耳を傾けなさい。",
            emotionalTone: "spiritual",
            context: {
                environmental: ["深い海", "自然の調和"],
                social: ["共有された経験", "文化的なつながり"],
                emotional: ["畏敬", "瞑想的"]
            },
            confidence: 1.0
        },
        "pt": {
            message: "As antigas canções do oceano fluem através de todos nós. Ouça a sabedoria das profundezas.",
            emotionalTone: "spiritual",
            context: {
                environmental: ["águas profundas", "harmonia natural"],
                social: ["experiência compartilhada", "conexão cultural"],
                emotional: ["reverente", "contemplativo"]
            },
            confidence: 1.0
        },
        "ru": {
            message: "Древние песни океана текут через всех нас. Прислушайтесь к мудрости глубин.",
            emotionalTone: "spiritual",
            context: {
                environmental: ["глубокие воды", "естественная гармония"],
                social: ["общий опыт", "культурная связь"],
                emotional: ["благоговейный", "созерцательный"]
            },
            confidence: 1.0
        }
    },
    "whale_call_learning": {
        "en": {
            message: "I am learning the ways of the ocean. Each wave brings new knowledge, each current a new lesson.",
            emotionalTone: "learning",
            context: {
                environmental: ["learning environment", "safe waters"],
                social: ["mentorship", "knowledge acquisition"],
                emotional: ["curious", "eager"],
                behavioral: ["observation", "practice"],
                seasonal: ["learning season"]
            },
            sentiment: {
                baseScore: 0.75,
                modifiers: {
                    environmental: 0.1,
                    social: 0.3,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "es": {
            message: "Estoy aprendiendo los caminos del océano. Cada ola trae nuevo conocimiento, cada corriente una nueva lección.",
            emotionalTone: "learning",
            context: {
                environmental: ["entorno de aprendizaje", "aguas seguras"],
                social: ["tutoría", "adquisición de conocimiento"],
                emotional: ["curioso", "ansioso"],
                behavioral: ["observación", "práctica"],
                seasonal: ["temporada de aprendizaje"]
            },
            sentiment: {
                baseScore: 0.75,
                modifiers: {
                    environmental: 0.1,
                    social: 0.3,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "fr": {
            message: "J'apprends les chemins de l'océan. Chaque vague apporte de nouvelles connaissances, chaque courant une nouvelle leçon.",
            emotionalTone: "learning",
            context: {
                environmental: ["environnement d'apprentissage", "eaux sûres"],
                social: ["mentorat", "acquisition de connaissances"],
                emotional: ["curieux", "impatient"],
                behavioral: ["observation", "pratique"],
                seasonal: ["saison d'apprentissage"]
            },
            sentiment: {
                baseScore: 0.75,
                modifiers: {
                    environmental: 0.1,
                    social: 0.3,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "de": {
            message: "Ich lerne die Wege des Ozeans. Jede Welle bringt neues Wissen, jede Strömung eine neue Lektion.",
            emotionalTone: "learning",
            context: {
                environmental: ["Lernumgebung", "sichere Gewässer"],
                social: ["Mentoring", "Wissenserwerb"],
                emotional: ["neugierig", "eifrig"],
                behavioral: ["Beobachtung", "Übung"],
                seasonal: ["Lernsaison"]
            },
            sentiment: {
                baseScore: 0.75,
                modifiers: {
                    environmental: 0.1,
                    social: 0.3,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "zh": {
            message: "我正在学习海洋的方式。每一波浪都带来新的知识，每一股洋流都是一堂新课。",
            emotionalTone: "learning",
            context: {
                environmental: ["学习环境", "安全水域"],
                social: ["指导", "知识获取"],
                emotional: ["好奇", "渴望"],
                behavioral: ["观察", "练习"],
                seasonal: ["学习季节"]
            },
            sentiment: {
                baseScore: 0.75,
                modifiers: {
                    environmental: 0.1,
                    social: 0.3,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "ja": {
            message: "私は海の道を学んでいます。それぞれの波が新しい知識をもたらし、それぞれの流れが新しいレッスンです。",
            emotionalTone: "learning",
            context: {
                environmental: ["学習環境", "安全な水域"],
                social: ["メンタリング", "知識獲得"],
                emotional: ["好奇心", "熱心"],
                behavioral: ["観察", "練習"],
                seasonal: ["学習期"]
            },
            sentiment: {
                baseScore: 0.75,
                modifiers: {
                    environmental: 0.1,
                    social: 0.3,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "pt": {
            message: "Estou aprendendo os caminhos do oceano. Cada onda traz novo conhecimento, cada corrente uma nova lição.",
            emotionalTone: "learning",
            context: {
                environmental: ["ambiente de aprendizagem", "águas seguras"],
                social: ["mentoria", "aquisição de conhecimento"],
                emotional: ["curioso", "ansioso"],
                behavioral: ["observação", "prática"],
                seasonal: ["temporada de aprendizagem"]
            },
            sentiment: {
                baseScore: 0.75,
                modifiers: {
                    environmental: 0.1,
                    social: 0.3,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "ru": {
            message: "Я учусь путям океана. Каждая волна приносит новые знания, каждое течение - новый урок.",
            emotionalTone: "learning",
            context: {
                environmental: ["среда обучения", "безопасные воды"],
                social: ["наставничество", "приобретение знаний"],
                emotional: ["любопытный", "нетерпеливый"],
                behavioral: ["наблюдение", "практика"],
                seasonal: ["сезон обучения"]
            },
            sentiment: {
                baseScore: 0.75,
                modifiers: {
                    environmental: 0.1,
                    social: 0.3,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        }
    },
    "whale_call_playful": {
        "en": {
            message: "Let's dance in the waves! The ocean is our playground, and every moment is a chance for joy.",
            emotionalTone: "playful",
            context: {
                environmental: ["playful waters", "safe area"],
                social: ["group play", "social bonding"],
                emotional: ["joyful", "excited"],
                behavioral: ["playing", "acrobatics"],
                seasonal: ["play season"]
            },
            sentiment: {
                baseScore: 0.9,
                modifiers: {
                    environmental: 0.1,
                    social: 0.3,
                    emotional: 0.4
                }
            },
            confidence: 1.0
        },
        "es": {
            message: "¡Bailemos en las olas! El océano es nuestro patio de recreo, y cada momento es una oportunidad para la alegría.",
            emotionalTone: "playful",
            context: {
                environmental: ["aguas juguetonas", "área segura"],
                social: ["juego grupal", "vínculo social"],
                emotional: ["alegre", "emocionado"],
                behavioral: ["jugando", "acrobacias"],
                seasonal: ["temporada de juego"]
            },
            sentiment: {
                baseScore: 0.9,
                modifiers: {
                    environmental: 0.1,
                    social: 0.3,
                    emotional: 0.4
                }
            },
            confidence: 1.0
        },
        "fr": {
            message: "Dansons dans les vagues ! L'océan est notre terrain de jeu, et chaque moment est une chance de joie.",
            emotionalTone: "playful",
            context: {
                environmental: ["eaux ludiques", "zone sûre"],
                social: ["jeu de groupe", "lien social"],
                emotional: ["joyeux", "excité"],
                behavioral: ["jouer", "acrobaties"],
                seasonal: ["saison de jeu"]
            },
            sentiment: {
                baseScore: 0.9,
                modifiers: {
                    environmental: 0.1,
                    social: 0.3,
                    emotional: 0.4
                }
            },
            confidence: 1.0
        },
        "de": {
            message: "Lass uns in den Wellen tanzen! Der Ozean ist unser Spielplatz, und jeder Moment ist eine Chance für Freude.",
            emotionalTone: "playful",
            context: {
                environmental: ["spielerische Gewässer", "sichere Zone"],
                social: ["Gruppenspiel", "soziale Bindung"],
                emotional: ["fröhlich", "aufgeregt"],
                behavioral: ["spielen", "Akrobatik"],
                seasonal: ["Spielsaison"]
            },
            sentiment: {
                baseScore: 0.9,
                modifiers: {
                    environmental: 0.1,
                    social: 0.3,
                    emotional: 0.4
                }
            },
            confidence: 1.0
        },
        "zh": {
            message: "让我们在波浪中跳舞！海洋是我们的游乐场，每一刻都是欢乐的机会。",
            emotionalTone: "playful",
            context: {
                environmental: ["嬉戏水域", "安全区域"],
                social: ["群体游戏", "社交联系"],
                emotional: ["快乐", "兴奋"],
                behavioral: ["玩耍", "杂技"],
                seasonal: ["游戏季节"]
            },
            sentiment: {
                baseScore: 0.9,
                modifiers: {
                    environmental: 0.1,
                    social: 0.3,
                    emotional: 0.4
                }
            },
            confidence: 1.0
        },
        "ja": {
            message: "波の中で踊りましょう！海は私たちの遊び場で、すべての瞬間が喜びのチャンスです。",
            emotionalTone: "playful",
            context: {
                environmental: ["遊び心のある海", "安全な区域"],
                social: ["グループ遊び", "社会的な絆"],
                emotional: ["楽しい", "興奮"],
                behavioral: ["遊ぶ", "アクロバット"],
                seasonal: ["遊びの季節"]
            },
            sentiment: {
                baseScore: 0.9,
                modifiers: {
                    environmental: 0.1,
                    social: 0.3,
                    emotional: 0.4
                }
            },
            confidence: 1.0
        },
        "pt": {
            message: "Vamos dançar nas ondas! O oceano é nosso parque de diversões, e cada momento é uma chance de alegria.",
            emotionalTone: "playful",
            context: {
                environmental: ["águas brincalhonas", "área segura"],
                social: ["jogo em grupo", "vínculo social"],
                emotional: ["alegre", "animado"],
                behavioral: ["brincando", "acrobacias"],
                seasonal: ["temporada de brincadeiras"]
            },
            sentiment: {
                baseScore: 0.9,
                modifiers: {
                    environmental: 0.1,
                    social: 0.3,
                    emotional: 0.4
                }
            },
            confidence: 1.0
        },
        "ru": {
            message: "Давайте танцевать в волнах! Океан - наша игровая площадка, и каждый момент - шанс для радости.",
            emotionalTone: "playful",
            context: {
                environmental: ["игривые воды", "безопасная зона"],
                social: ["групповая игра", "социальная связь"],
                emotional: ["радостный", "возбужденный"],
                behavioral: ["игра", "акробатика"],
                seasonal: ["игровой сезон"]
            },
            sentiment: {
                baseScore: 0.9,
                modifiers: {
                    environmental: 0.1,
                    social: 0.3,
                    emotional: 0.4
                }
            },
            confidence: 1.0
        }
    },
    "whale_call_distress": {
        "en": {
            message: "Help! I am in need. The ocean's embrace feels distant, and I call for aid.",
            emotionalTone: "distressed",
            context: {
                environmental: ["dangerous waters", "threatening conditions"],
                social: ["seeking help", "emergency"],
                emotional: ["fearful", "anxious"],
                behavioral: ["calling", "alerting"],
                seasonal: ["danger season"]
            },
            sentiment: {
                baseScore: 0.2,
                modifiers: {
                    environmental: -0.3,
                    social: -0.2,
                    emotional: -0.4
                }
            },
            confidence: 1.0
        },
        "es": {
            message: "¡Ayuda! Estoy en necesidad. El abrazo del océano se siente distante, y llamo por ayuda.",
            emotionalTone: "distressed",
            context: {
                environmental: ["aguas peligrosas", "condiciones amenazantes"],
                social: ["buscando ayuda", "emergencia"],
                emotional: ["temeroso", "ansioso"],
                behavioral: ["llamando", "alertando"],
                seasonal: ["temporada de peligro"]
            },
            sentiment: {
                baseScore: 0.2,
                modifiers: {
                    environmental: -0.3,
                    social: -0.2,
                    emotional: -0.4
                }
            },
            confidence: 1.0
        },
        "fr": {
            message: "À l'aide ! Je suis dans le besoin. L'étreinte de l'océan semble lointaine, et j'appelle à l'aide.",
            emotionalTone: "distressed",
            context: {
                environmental: ["eaux dangereuses", "conditions menaçantes"],
                social: ["cherche de l'aide", "urgence"],
                emotional: ["craintif", "anxieux"],
                behavioral: ["appel", "alerte"],
                seasonal: ["saison de danger"]
            },
            sentiment: {
                baseScore: 0.2,
                modifiers: {
                    environmental: -0.3,
                    social: -0.2,
                    emotional: -0.4
                }
            },
            confidence: 1.0
        },
        "de": {
            message: "Hilfe! Ich bin in Not. Die Umarmung des Ozeans fühlt sich fern an, und ich rufe um Hilfe.",
            emotionalTone: "distressed",
            context: {
                environmental: ["gefährliche Gewässer", "bedrohliche Bedingungen"],
                social: ["Hilfesuche", "Notfall"],
                emotional: ["ängstlich", "besorgt"],
                behavioral: ["Rufen", "Alarmieren"],
                seasonal: ["Gefahrensaison"]
            },
            sentiment: {
                baseScore: 0.2,
                modifiers: {
                    environmental: -0.3,
                    social: -0.2,
                    emotional: -0.4
                }
            },
            confidence: 1.0
        },
        "zh": {
            message: "救命！我需要帮助。海洋的拥抱感觉遥远，我在呼救。",
            emotionalTone: "distressed",
            context: {
                environmental: ["危险水域", "威胁条件"],
                social: ["寻求帮助", "紧急情况"],
                emotional: ["恐惧", "焦虑"],
                behavioral: ["呼叫", "警报"],
                seasonal: ["危险季节"]
            },
            sentiment: {
                baseScore: 0.2,
                modifiers: {
                    environmental: -0.3,
                    social: -0.2,
                    emotional: -0.4
                }
            },
            confidence: 1.0
        },
        "ja": {
            message: "助けて！私は助けが必要です。海の抱擁は遠く感じ、私は助けを求めています。",
            emotionalTone: "distressed",
            context: {
                environmental: ["危険な海", "脅威的な状況"],
                social: ["助けを求める", "緊急事態"],
                emotional: ["恐れ", "不安"],
                behavioral: ["呼びかけ", "警報"],
                seasonal: ["危険な季節"]
            },
            sentiment: {
                baseScore: 0.2,
                modifiers: {
                    environmental: -0.3,
                    social: -0.2,
                    emotional: -0.4
                }
            },
            confidence: 1.0
        },
        "pt": {
            message: "Socorro! Estou precisando de ajuda. O abraço do oceano parece distante, e eu chamo por socorro.",
            emotionalTone: "distressed",
            context: {
                environmental: ["águas perigosas", "condições ameaçadoras"],
                social: ["buscando ajuda", "emergência"],
                emotional: ["temeroso", "ansioso"],
                behavioral: ["chamando", "alertando"],
                seasonal: ["temporada de perigo"]
            },
            sentiment: {
                baseScore: 0.2,
                modifiers: {
                    environmental: -0.3,
                    social: -0.2,
                    emotional: -0.4
                }
            },
            confidence: 1.0
        },
        "ru": {
            message: "Помощь! Я в беде. Объятия океана кажутся далекими, и я взываю о помощи.",
            emotionalTone: "distressed",
            context: {
                environmental: ["опасные воды", "угрожающие условия"],
                social: ["поиск помощи", "чрезвычайная ситуация"],
                emotional: ["испуганный", "тревожный"],
                behavioral: ["зов", "тревога"],
                seasonal: ["сезон опасности"]
            },
            sentiment: {
                baseScore: 0.2,
                modifiers: {
                    environmental: -0.3,
                    social: -0.2,
                    emotional: -0.4
                }
            },
            confidence: 1.0
        }
    },
    "whale_call_curiosity": {
        "en": {
            message: "What mysteries lie beneath? I am drawn to explore the unknown depths of our ocean home.",
            emotionalTone: "curious",
            context: {
                environmental: ["exploration area", "new territory"],
                social: ["discovery", "investigation"],
                emotional: ["inquisitive", "wonder"],
                behavioral: ["exploring", "investigating"],
                seasonal: ["exploration season"]
            },
            sentiment: {
                baseScore: 0.8,
                modifiers: {
                    environmental: 0.2,
                    social: 0.2,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "es": {
            message: "¿Qué misterios yacen debajo? Me siento atraído a explorar las profundidades desconocidas de nuestro hogar oceánico.",
            emotionalTone: "curious",
            context: {
                environmental: ["área de exploración", "nuevo territorio"],
                social: ["descubrimiento", "investigación"],
                emotional: ["inquisitivo", "asombro"],
                behavioral: ["explorando", "investigando"],
                seasonal: ["temporada de exploración"]
            },
            sentiment: {
                baseScore: 0.8,
                modifiers: {
                    environmental: 0.2,
                    social: 0.2,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "fr": {
            message: "Quels mystères se cachent en dessous ? Je suis attiré par l'exploration des profondeurs inconnues de notre foyer océanique.",
            emotionalTone: "curious",
            context: {
                environmental: ["zone d'exploration", "nouveau territoire"],
                social: ["découverte", "investigation"],
                emotional: ["inquisitif", "émerveillement"],
                behavioral: ["exploration", "investigation"],
                seasonal: ["saison d'exploration"]
            },
            sentiment: {
                baseScore: 0.8,
                modifiers: {
                    environmental: 0.2,
                    social: 0.2,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "de": {
            message: "Welche Geheimnisse liegen darunter? Ich fühle mich angezogen, die unbekannten Tiefen unseres Ozeanheims zu erkunden.",
            emotionalTone: "curious",
            context: {
                environmental: ["Erkundungsgebiet", "neues Territorium"],
                social: ["Entdeckung", "Untersuchung"],
                emotional: ["neugierig", "Staunen"],
                behavioral: ["Erkundung", "Untersuchung"],
                seasonal: ["Erkundungssaison"]
            },
            sentiment: {
                baseScore: 0.8,
                modifiers: {
                    environmental: 0.2,
                    social: 0.2,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "zh": {
            message: "下面有什么奥秘？我被吸引去探索我们海洋家园的未知深处。",
            emotionalTone: "curious",
            context: {
                environmental: ["探索区域", "新领地"],
                social: ["发现", "调查"],
                emotional: ["好奇", "惊奇"],
                behavioral: ["探索", "调查"],
                seasonal: ["探索季节"]
            },
            sentiment: {
                baseScore: 0.8,
                modifiers: {
                    environmental: 0.2,
                    social: 0.2,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "ja": {
            message: "下にはどんな神秘が隠れているのでしょうか？私は私たちの海の家の未知の深みを探求するのに魅了されています。",
            emotionalTone: "curious",
            context: {
                environmental: ["探検エリア", "新しい領域"],
                social: ["発見", "調査"],
                emotional: ["好奇心", "驚き"],
                behavioral: ["探検", "調査"],
                seasonal: ["探検シーズン"]
            },
            sentiment: {
                baseScore: 0.8,
                modifiers: {
                    environmental: 0.2,
                    social: 0.2,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "pt": {
            message: "Quais mistérios se escondem abaixo? Sinto-me atraído a explorar as profundezas desconhecidas do nosso lar oceânico.",
            emotionalTone: "curious",
            context: {
                environmental: ["área de exploração", "novo território"],
                social: ["descoberta", "investigação"],
                emotional: ["inquisitivo", "maravilha"],
                behavioral: ["explorando", "investigando"],
                seasonal: ["temporada de exploração"]
            },
            sentiment: {
                baseScore: 0.8,
                modifiers: {
                    environmental: 0.2,
                    social: 0.2,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "ru": {
            message: "Какие тайны скрываются внизу? Меня тянет исследовать неизведанные глубины нашего океанского дома.",
            emotionalTone: "curious",
            context: {
                environmental: ["зона исследования", "новая территория"],
                social: ["открытие", "исследование"],
                emotional: ["любопытный", "изумление"],
                behavioral: ["исследование", "расследование"],
                seasonal: ["сезон исследования"]
            },
            sentiment: {
                baseScore: 0.8,
                modifiers: {
                    environmental: 0.2,
                    social: 0.2,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        }
    },
    "whale_call_social": {
        "en": {
            message: "Come, join our pod! Together we are stronger, our songs more beautiful.",
            emotionalTone: "social",
            context: {
                environmental: ["social waters", "gathering area"],
                social: ["group bonding", "community"],
                emotional: ["welcoming", "friendly"],
                behavioral: ["socializing", "singing"],
                seasonal: ["social season"]
            },
            sentiment: {
                baseScore: 0.85,
                modifiers: {
                    environmental: 0.1,
                    social: 0.4,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "es": {
            message: "¡Ven, únete a nuestro grupo! Juntos somos más fuertes, nuestras canciones más hermosas.",
            emotionalTone: "social",
            context: {
                environmental: ["aguas sociales", "área de reunión"],
                social: ["vínculo grupal", "comunidad"],
                emotional: ["acogedor", "amigable"],
                behavioral: ["socializando", "cantando"],
                seasonal: ["temporada social"]
            },
            sentiment: {
                baseScore: 0.85,
                modifiers: {
                    environmental: 0.1,
                    social: 0.4,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "fr": {
            message: "Venez, rejoignez notre groupe ! Ensemble, nous sommes plus forts, nos chants plus beaux.",
            emotionalTone: "social",
            context: {
                environmental: ["eaux sociales", "zone de rassemblement"],
                social: ["lien de groupe", "communauté"],
                emotional: ["accueillant", "amical"],
                behavioral: ["socialisation", "chant"],
                seasonal: ["saison sociale"]
            },
            sentiment: {
                baseScore: 0.85,
                modifiers: {
                    environmental: 0.1,
                    social: 0.4,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "de": {
            message: "Komm, schließe dich unserer Gruppe an! Zusammen sind wir stärker, unsere Lieder schöner.",
            emotionalTone: "social",
            context: {
                environmental: ["soziale Gewässer", "Versammlungsbereich"],
                social: ["Gruppenbindung", "Gemeinschaft"],
                emotional: ["einladend", "freundlich"],
                behavioral: ["Sozialisierung", "Gesang"],
                seasonal: ["soziale Saison"]
            },
            sentiment: {
                baseScore: 0.85,
                modifiers: {
                    environmental: 0.1,
                    social: 0.4,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "zh": {
            message: "来吧，加入我们的群体！我们一起更强大，我们的歌声更美妙。",
            emotionalTone: "social",
            context: {
                environmental: ["社交水域", "聚集区域"],
                social: ["群体联系", "社区"],
                emotional: ["欢迎", "友好"],
                behavioral: ["社交", "歌唱"],
                seasonal: ["社交季节"]
            },
            sentiment: {
                baseScore: 0.85,
                modifiers: {
                    environmental: 0.1,
                    social: 0.4,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "ja": {
            message: "来て、私たちの群れに加わりましょう！一緒にいればより強く、私たちの歌はより美しくなります。",
            emotionalTone: "social",
            context: {
                environmental: ["社交的な海", "集まりの場所"],
                social: ["グループの絆", "コミュニティ"],
                emotional: ["歓迎", "友好的"],
                behavioral: ["社交", "歌"],
                seasonal: ["社交シーズン"]
            },
            sentiment: {
                baseScore: 0.85,
                modifiers: {
                    environmental: 0.1,
                    social: 0.4,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "pt": {
            message: "Venha, junte-se ao nosso grupo! Juntos somos mais fortes, nossas canções mais belas.",
            emotionalTone: "social",
            context: {
                environmental: ["águas sociais", "área de encontro"],
                social: ["vínculo grupal", "comunidade"],
                emotional: ["acolhedor", "amigável"],
                behavioral: ["socializando", "cantando"],
                seasonal: ["temporada social"]
            },
            sentiment: {
                baseScore: 0.85,
                modifiers: {
                    environmental: 0.1,
                    social: 0.4,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        },
        "ru": {
            message: "Приходите, присоединяйтесь к нашей группе! Вместе мы сильнее, наши песни прекраснее.",
            emotionalTone: "social",
            context: {
                environmental: ["социальные воды", "место сбора"],
                social: ["групповая связь", "сообщество"],
                emotional: ["приветливый", "дружелюбный"],
                behavioral: ["общение", "пение"],
                seasonal: ["социальный сезон"]
            },
            sentiment: {
                baseScore: 0.85,
                modifiers: {
                    environmental: 0.1,
                    social: 0.4,
                    emotional: 0.3
                }
            },
            confidence: 1.0
        }
    }
}; 

export interface WhalePhrase {
    phrase: string;
    meaning: string;
    context: {
        environmental: string[];
        social: string[];
        emotional: string[];
        behavioral: string[];
        seasonal: string[];
    };
    sentiment: {
        tone: EmotionalTone;
        intensity: number;
        confidence: number;
    };
    usage: {
        frequency: 'common' | 'rare' | 'ceremonial';
        formality: 'casual' | 'formal' | 'sacred';
        ageGroup: 'calf' | 'juvenile' | 'adult' | 'elder' | 'all';
    };
} 