export type TeamMember = {
  name: string;
  position: string;
  photo?: string;
  linkedin?: string;
};

export type DepartmentGroup = {
  name: string;
  leads: TeamMember[];
  executives: TeamMember[];
};

export type ExecutiveCommitteeByYear = {
  excoNumber: string;
  leadership: TeamMember[];
  departments: DepartmentGroup[];
};

const exco2627Root = "/team/exco/26-27";
const exco2627Version = "20260702";
const exco2627Photo = (file: string) => `${exco2627Root}/${file}?v=${exco2627Version}`;
const exco2627Placeholder = exco2627Photo("placeholder_profile_refresh.webp");
const exco2223Root = "/team/exco/22-23";
const exco2021Root = "/team/exco/20-21";
const exco1920Root = "/team/exco/19-20";

export const executiveCommitteeByYear: Record<string, ExecutiveCommitteeByYear> = {
  "26/27": {
    excoNumber: "8th ExCo",
    leadership: [
      {
        name: "Eric Law",
        position: "President",
        photo: exco2627Photo("eric-temp.jpg"),
        linkedin: "https://www.linkedin.com/in/law-eric/",
      },
      {
        name: "Win Lei Thawdar",
        position: "Vice President",
        photo: exco2627Photo("winlei-temp.jpg"),
        linkedin: "https://www.linkedin.com/in/winleithawdar",
      },
      {
        name: "Jasmine Cheong",
        position: "Honorary General Secretary",
        photo: exco2627Photo("jasmine temp.jpg"),
        linkedin: "https://www.linkedin.com/in/jasmine-ch",
      },
      {
        name: "Su Myat Myat Htay (Sera)",
        position: "Honorary Finance Secretary",
        photo: exco2627Photo("sera-temp.jpg"),
        linkedin: "https://www.linkedin.com/in/su-myat-myat-htay-7342a3271/",
      },
    ],
    departments: [
      {
        name: "Partnerships",
        leads: [
          {
            name: "Isaac Pua",
            position: "Partnerships Lead",
            photo: exco2627Photo("isaac-temp.jpg"),
            linkedin: "https://www.linkedin.com/in/isaacpua/",
          },
        ],
        executives: [
          {
            name: "Tan Ai Qi",
            position: "Partnerships Executive",
            photo: exco2627Photo("aiqi-temp.jpg"),
            linkedin: "https://www.linkedin.com/in/ai-qi-tan",
          },
          {
            name: "Makendra Prasad",
            position: "Partnerships Executive",
            photo: exco2627Photo("makendra-temp.jpg"),
            linkedin: "https://www.linkedin.com/in/subramanian-makendra-prasad/",
          },
          {
            name: "Palaash Jadav",
            position: "Partnerships Executive",
            photo: exco2627Photo("palaash temp.jpg"),
            linkedin: "https://sg.linkedin.com/in/palaash-jadav",
          },
          {
            name: "Liu Zihan",
            position: "Partnerships Executive",
            photo: exco2627Photo("zihan-temp.jpg"),
            linkedin: "https://www.linkedin.com/in/zihan-liu-bb2bba3b4",
          },
        ],
      },
      {
        name: "Programmes",
        leads: [
          {
            name: "Keane Travasso",
            position: "Programmes Lead",
            photo: exco2627Photo("keane-temp.jpg"),
            linkedin: "https://www.linkedin.com/in/keanedt/",
          },
        ],
        executives: [
          {
            name: "William Hansel",
            position: "Programmes Executive",
            photo: exco2627Photo("william-temp.jpg"),
            linkedin: "https://www.linkedin.com/in/whansel007",
          },
          {
            name: "Ang Cheng Zuo (Alric)",
            position: "Programmes Executive",
            photo: exco2627Photo("alric-temp.jpg"),
            linkedin: "https://www.linkedin.com/in/ang-cheng-zuo",
          },
          {
            name: "Chelsea Gaol",
            position: "Programmes Executive",
            photo: exco2627Photo("chelsea-temp.jpg"),
            linkedin: "https://www.linkedin.com/in/chelseamalg",
          },
          {
            name: "Yang Dairu",
            position: "Programmes Executive",
            photo: exco2627Photo("dairu-temp.jpg"),
            linkedin: "https://www.linkedin.com/in/dairu/",
          },
        ],
      },
      {
        name: "Marketing",
        leads: [
          {
            name: "Su Pyae Pyae Zaw (Suzan)",
            position: "Marketing Lead",
            photo: exco2627Photo("suzan-temp.jpg"),
            linkedin: "https://www.linkedin.com/in/supyaepyaezaw/",
          },
        ],
        executives: [
          {
            name: "Alan Sebastian Bun",
            position: "Marketing Executive",
            photo: exco2627Photo("alan-temp.jpg"),
            linkedin: "https://www.linkedin.com/in/alan-sebastian-bun",
          },
          {
            name: "Wunna Aung",
            position: "Marketing Executive",
            photo: exco2627Photo("wunna-temp.jpg"),
            linkedin: "https://www.linkedin.com/in/wunna-aung/",
          },
        ],
      },
      {
        name: "Research",
        leads: [
          {
            name: "Darrius Ng",
            position: "Research Lead",
            photo: exco2627Photo("darrius-temp.jpg"),
            linkedin: "https://www.linkedin.com/in/darriusng",
          },
        ],
        executives: [
          {
            name: "Yi Khuen Chai",
            position: "Research Executive",
            photo: exco2627Photo("yikhuen-temp.jpg"),
            linkedin: "https://www.linkedin.com/in/chaiyikhuen/",
          },
          {
            name: "Anson Koh",
            position: "Research Executive",
            photo: exco2627Photo("anson-temp.jpg"),
            linkedin: "https://www.linkedin.com/in/ansonkohh/",
          },
        ],
      },
    ],
  },
  "25/26": {
    excoNumber: "7th ExCo",
    leadership: [
      {
        name: "Darrius Ng",
        position: "President",
        photo: "/team/exco/25-26/president.jpg",
        linkedin: "https://sg.linkedin.com/in/darriusng",
      },
      {
        name: "Yi Khuen Chai",
        position: "Vice President",
        photo: "/team/exco/25-26/vice-president.jpg",
        linkedin: "https://sg.linkedin.com/in/chaiyikhuen",
      },
      {
        name: "Chantel Lee",
        position: "Honorary General Secretary",
        photo: "/team/exco/25-26/hgs.jpg",
        linkedin: "https://sg.linkedin.com/in/chantelleejy",
      },
      {
        name: "Priyal Nevatia",
        position: "Honorary Finance Secretary",
        photo: "/team/exco/25-26/hfs.jpg",
        linkedin: "https://www.linkedin.com/in/priyalnevatia/",
      },
    ],
    departments: [
      {
        name: "Programmes",
        leads: [
          {
            name: "Jones Koh",
            position: "Programmes Lead",
            photo: "/team/exco/25-26/programmes-lead.jpg",
            linkedin: "https://www.linkedin.com/in/kohweijunjones/",
          },
        ],
        executives: [
          {
            name: "Harry Ng",
            position: "Programmes Executive",
            photo: "/team/exco/25-26/programmes-executive-1.jpg",
            linkedin: "https://www.linkedin.com/in/ngkokjing/",
          },
          {
            name: "Flash Teng",
            position: "Programmes Executive",
            photo: "/team/exco/25-26/programmes-executive-2.jpg",
            linkedin: "https://sg.linkedin.com/in/flashtxh",
          },
          {
            name: "Jayden Teoh",
            position: "Programmes Executive",
            photo: "/team/exco/25-26/programmes-executive-3.jpg",
            linkedin: "https://sg.linkedin.com/in/jayden-teoh",
          },
        ],
      },
      {
        name: "Partnerships",
        leads: [
          {
            name: "Anson Koh",
            position: "Partnerships Lead",
            photo: "/team/exco/25-26/partnerships-lead.jpg",
            linkedin: "https://www.linkedin.com/in/ansonkohh/",
          },
        ],
        executives: [
          {
            name: "Isaac Pua",
            position: "Partnerships Executive",
            photo: "/team/exco/25-26/partnerships-executive-1.jpg",
            linkedin: "https://www.linkedin.com/in/isaacpua/",
          },
          {
            name: "Saai Raja",
            position: "Partnerships Executive",
            photo: "/team/exco/25-26/partnerships-executive-2.jpg",
            linkedin: "https://sg.linkedin.com/in/saaiaravindhraja",
          },
        ],
      },
      {
        name: "Marketing",
        leads: [
          {
            name: "Win Lei Thawdar",
            position: "Marketing Lead",
            photo: "/team/exco/25-26/marketing-lead.jpg",
            linkedin: "https://sg.linkedin.com/in/winleithawdar",
          },
        ],
        executives: [
          {
            name: "Chue Myat Sandy",
            position: "Marketing Executive",
            photo: "/team/exco/25-26/marketing-executive-1.jpg",
            linkedin: "https://sg.linkedin.com/in/chue-myat-sandy",
          },
          {
            name: "Kiara Desai",
            position: "Marketing Executive",
            photo: "/team/exco/25-26/marketing-executive-2.jpg",
            linkedin: "https://sg.linkedin.com/in/kiarakuldeepdesai",
          },
        ],
      },
    ],
  },
  "24/25": {
    excoNumber: "6th ExCo",
    leadership: [
      {
        name: "Vaishnavi Singh",
        position: "President",
        photo: "/team/exco/24-25/president-1.jpg",
        linkedin: "https://sg.linkedin.com/in/vaishnavisingh-",
      },
      {
        name: "Anson Koh",
        position: "Vice President",
        photo: "/team/exco/24-25/vice-president-1.jpg",
        linkedin: "https://www.linkedin.com/in/ansonkohh/",
      },
      {
        name: "Maymunah M",
        position: "Honorary General Secretary",
        photo: "/team/exco/24-25/hgs-1.jpg",
        linkedin: "https://www.linkedin.com/in/maymunahm/",
      },
      {
        name: "Kaung Htet Nyunt",
        position: "Honorary Finance Secretary",
        photo: "/team/exco/24-25/hfs-1.jpg",
        linkedin: "https://sg.linkedin.com/in/kaung-htet-nyunt",
      },
    ],
    departments: [
      {
        name: "Programmes",
        leads: [
          {
            name: "Jayden Teoh",
            position: "Programmes Lead",
            photo: "/team/exco/24-25/programmes-lead-1.jpg",
            linkedin: "https://sg.linkedin.com/in/jayden-teoh",
          },
          {
            name: "Lye Jia Jun",
            position: "Programmes Lead",
            photo: "/team/exco/24-25/programmes-lead-2.jpg",
            linkedin: "https://www.linkedin.com/in/lyejiajun",
          },
        ],
        executives: [],
      },
      {
        name: "Partnerships",
        leads: [
          {
            name: "Ryan Teo",
            position: "Partnerships Lead",
            photo: "/team/exco/24-25/partnerships-lead-1.jpg",
            linkedin: "https://www.linkedin.com/in/ryanteoyx/",
          },
          {
            name: "Shyn Lim",
            position: "Partnerships Lead",
            photo: "/team/exco/24-25/partnerships-lead-2.jpg",
            linkedin: "https://sg.linkedin.com/in/limshynru",
          },
        ],
        executives: [],
      },
      {
        name: "Marketing",
        leads: [
          {
            name: "Diya Desai",
            position: "Marketing Lead",
            photo: "/team/exco/24-25/marketing-lead-1.jpg",
            linkedin: "https://sg.linkedin.com/in/diyadesai",
          },
          {
            name: "Sandra Yap",
            position: "Marketing Lead",
            photo: "/team/exco/24-25/marketing-lead-2.jpg",
            linkedin: "https://www.linkedin.com/in/sandraykx/",
          },
        ],
        executives: [],
      },
    ],
  },
  "22/23": {
    excoNumber: "3rd ExCo",
    leadership: [
      {
        name: "Yap En Rui Andrea",
        position: "President",
        photo: `${exco2223Root}/president.jpg`,
        linkedin: "https://www.linkedin.com/in/andreayapenrui",
      },
      {
        name: "Ang Zheng Nan",
        position: "Honorary General Secretary",
        photo: `${exco2223Root}/hgs.jpg`,
        linkedin: "https://www.linkedin.com/in/zheng-nan-ang/",
      },
      {
        name: "Elijah Ang Chang Hao",
        position: "Finance Lead",
        photo: `${exco2223Root}/finance-lead.jpg`,
        linkedin: "https://www.linkedin.com/in/elijah-ang-chang-hao/",
      },
    ],
    departments: [
      {
        name: "Programmes",
        leads: [
          {
            name: "Pang Jun Rong (Jayden)",
            position: "Programmes Lead",
            photo: `${exco2223Root}/programmes-lead-1.jpg`,
            linkedin: "https://www.linkedin.com/in/jun-rong-pang",
          },
          {
            name: "Yin Qiuhao (Ben)",
            position: "Programmes Lead",
            photo: `${exco2223Root}/programmes-lead-2.jpeg`,
            linkedin: "https://www.linkedin.com/in/qiuhaoyin74b999198",
          },
        ],
        executives: [],
      },
      {
        name: "Partnerships",
        leads: [
          {
            name: "Lau Li Qing",
            position: "Partnerships Lead",
            photo: `${exco2223Root}/partnerships-lead.jpg`,
            linkedin: "https://www.linkedin.com/in/lau-li-qing",
          },
        ],
        executives: [],
      },
      {
        name: "Marketing",
        leads: [
          {
            name: "Audrey Ang",
            position: "Marketing Lead",
            photo: `${exco2223Root}/marketing-lead-1.jpg`,
            linkedin: "https://www.linkedin.com/in/audrey-ang01",
          },
          {
            name: "Reuben Yang Zhong Hng",
            position: "Marketing Lead",
            photo: `${exco2223Root}/marketing-lead-2.jpg`,
            linkedin: "https://www.linkedin.com/in/reuben-yang-zh224",
          },
        ],
        executives: [],
      },
    ],
  },
  "20/21": {
    excoNumber: "2nd ExCo",
    leadership: [
      {
        name: "Kwa Zhi Poh",
        position: "President",
        photo: `${exco2021Root}/president.jpg`,
        linkedin: "https://www.linkedin.com/in/zhi-poh-kwa/",
      },
      {
        name: "Shawn Teo",
        position: "Honorary General Secretary",
        photo: `${exco2021Root}/hgs.jpg`,
        linkedin: "https://www.linkedin.com/in/shawn-teo-5459101a5/",
      },
      {
        name: "Gan Shao Hong",
        position: "Finance Lead",
        photo: `${exco2021Root}/finance-lead.jpg`,
        linkedin: "https://www.linkedin.com/in/g-shaohong/?originalSubdomain=sg",
      },
    ],
    departments: [
      {
        name: "Programmes",
        leads: [
          {
            name: "Hafil Zachiary",
            position: "Programmes Lead",
            photo: `${exco2021Root}/programmes-lead.jpg`,
            linkedin: "https://www.linkedin.com/in/hafilnz/",
          },
        ],
        executives: [],
      },
      {
        name: "Partnerships",
        leads: [
          {
            name: "Lukas Tham Wei Jie",
            position: "Partnerships Lead",
            photo: `${exco2021Root}/partnerships-lead.jpg`,
            linkedin: "https://www.linkedin.com/in/lukastham/",
          },
        ],
        executives: [],
      },
      {
        name: "Marketing",
        leads: [
          {
            name: "Jean Goh Kai Xuan",
            position: "Marketing Lead",
            photo: `${exco2021Root}/marketing-lead.jpg`,
            linkedin: "https://www.linkedin.com/in/jgkx/",
          },
        ],
        executives: [],
      },
    ],
  },
  "19/20": {
    excoNumber: "1st ExCo",
    leadership: [
      {
        name: "Sheldon Chin",
        position: "President",
        photo: `${exco1920Root}/president.jpg`,
        linkedin: "https://www.linkedin.com/in/sheldon-chin-715951124/",
      },
      {
        name: "Lee Ee Xuan",
        position: "Honorary General Secretary",
        photo: `${exco1920Root}/hgs.jpeg`,
        linkedin: "https://www.linkedin.com/in/lee-e-b3b19593/",
      },
      {
        name: "Charis Low",
        position: "Finance Lead",
        photo: `${exco1920Root}/finance-lead.png`,
        linkedin: "https://www.linkedin.com/in/charislow/",
      },
    ],
    departments: [
      {
        name: "Programmes",
        leads: [
          {
            name: "Cindy Zheng",
            position: "Programmes Lead",
            photo: `${exco1920Root}/programmes-lead-1.jpg`,
            linkedin: "https://www.linkedin.com/in/zxx/",
          },
          {
            name: "Johnathan Tan",
            position: "Programmes Lead",
            photo: `${exco1920Root}/programmes-lead-2.jpg`,
            linkedin: "https://www.linkedin.com/in/johnathan-tan-kw/",
          },
        ],
        executives: [],
      },
      {
        name: "Partnerships",
        leads: [
          {
            name: "Jeremy Ang",
            position: "Partnerships Lead",
            photo: `${exco1920Root}/partnerships-lead.jpg`,
            linkedin: "https://www.linkedin.com/in/jeremy-ang/",
          },
        ],
        executives: [],
      },
      {
        name: "Marketing",
        leads: [
          {
            name: "Haran Dorairaj",
            position: "Marketing Lead",
            photo: `${exco1920Root}/marketing-lead.jpg`,
            linkedin: "https://www.linkedin.com/in/harandrj/",
          },
        ],
        executives: [],
      },
    ],
  },
};

export const advisors: TeamMember[] = [
  {
    name: "Huo Yasi",
    position: "Senior Associate Director at IIE",
    photo: "/team/advisors/yasi.jpg",
    linkedin: "https://www.linkedin.com/in/huo-yasi/",
  },
  {
    name: "Nazreen Coupland",
    position: "Assistant Manager at IIE",
    photo: "/team/advisors/naz.jpg",
    linkedin: "https://www.linkedin.com/in/nazreen-annecoupland/",
  },
];

export const advisorsIntro =
  "This is the space to introduce the team and what makes it special. Describe the team culture and work philosophy. To help site visitors connect with the team, add details about team members’ experience and skills.";

export const advisorsProfileSummary: Record<string, string> = {
  "Huo Yasi":
    "Leading programs that inspire innovation, Yasi combines her rich educational background and a Harvard Master’s to foster impactful learning experiences and partnerships.",
  "Nazreen Coupland":
    "Nazreen brings her passion for community building to IIE, with experience at the Mental Health Film Festival and a Theatre Studies degree from NUS.",
};
