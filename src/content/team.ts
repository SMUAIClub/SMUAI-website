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

export const executiveCommitteeByYear: Record<string, ExecutiveCommitteeByYear> = {
  "26/27": {
    excoNumber: "8th ExCo",
    leadership: [
      { name: "Eric Law", position: "President", photo: "/team/exco/26-27/president.jpg" },
      { name: "Win Lei Thawdar", position: "Vice President", photo: "/team/exco/26-27/vice-president.jpg" },
      { name: "Jasmine Cheong", position: "Honorary General Secretary", photo: "/team/exco/26-27/hgs.jpg" },
      { name: "Su Myat Myat Htay (Sera)", position: "Honorary Finance Secretary", photo: "/team/exco/26-27/hfs.jpg" },
    ],
    departments: [
      {
        name: "Partnerships",
        leads: [{ name: "Isaac Pua", position: "Partnerships Lead", photo: "/team/exco/26-27/partnerships-lead.jpg" }],
        executives: [
          {
            name: "Liu Zihan",
            position: "Partnerships Executive",
            photo: "/team/exco/26-27/partnerships-executive-1.jpg",
          },
          {
            name: "Makendra Prasad",
            position: "Partnerships Executive",
            photo: "/team/exco/26-27/partnerships-executive-2.jpg",
          },
          {
            name: "Palaash Jadav",
            position: "Partnerships Executive",
            photo: "/team/exco/26-27/partnerships-executive-3.jpg",
          },
          {
            name: "Tan Ai Qi",
            position: "Partnerships Executive",
            photo: "/team/exco/26-27/partnerships-executive-4.jpg",
          },
        ],
      },
      {
        name: "Programmes",
        leads: [{ name: "Keane Travasso", position: "Programmes Lead", photo: "/team/exco/26-27/programmes-lead.jpg" }],
        executives: [
          {
            name: "Ang Cheng Zuo",
            position: "Programmes Executive",
            photo: "/team/exco/26-27/programmes-executive-1.jpg",
          },
          {
            name: "Chelsea Gaol",
            position: "Programmes Executive",
            photo: "/team/exco/26-27/programmes-executive-2.jpg",
          },
          {
            name: "William Hansel",
            position: "Programmes Executive",
            photo: "/team/exco/26-27/programmes-executive-3.jpg",
          },
          {
            name: "Yang Dairu",
            position: "Programmes Executive",
            photo: "/team/exco/26-27/programmes-executive-4.jpg",
          },
        ],
      },
      {
        name: "Marketing",
        leads: [{ name: "Su Pyae Pyae Zaw (Suzan)", position: "Marketing Lead", photo: "/team/exco/26-27/marketing-lead.jpg" }],
        executives: [
          {
            name: "Alan Sebastian",
            position: "Marketing Executive",
            photo: "/team/exco/26-27/marketing-executive-1.jpg",
          },
          {
            name: "Wunna Aung",
            position: "Marketing Executive",
            photo: "/team/exco/26-27/marketing-executive-2.jpg",
          },
        ],
      },
      {
        name: "Research",
        leads: [{ name: "Darrius Ng", position: "Research Lead", photo: "/team/exco/26-27/research-lead.jpg" }],
        executives: [
          {
            name: "Chai Yi Khuen",
            position: "Research Executive",
            photo: "/team/exco/26-27/research-executive-1.jpg",
          },
          {
            name: "Anson Koh",
            position: "Research Executive",
            photo: "/team/exco/26-27/research-executive-2.jpg",
          },
        ],
      },
    ],
  },
  "25/26": {
    excoNumber: "7th ExCo",
    leadership: [
      { name: "Darrius Ng", position: "President", photo: "/team/exco/25-26/president.jpg" },
      { name: "Yi Khuen Chai", position: "Vice-President", photo: "/team/exco/25-26/vice-president.jpg" },
      { name: "Chantel Lee", position: "HGS", photo: "/team/exco/25-26/hgs.jpg" },
      { name: "Priyal Nevatia", position: "HFS", photo: "/team/exco/25-26/hfs.jpg" },
    ],
    departments: [
      {
        name: "Programmes",
        leads: [{ name: "Jones Koh", position: "Programmes Lead", photo: "/team/exco/25-26/programmes-lead.jpg" }],
        executives: [
          {
            name: "Harry Ng",
            position: "Programmes Executive",
            photo: "/team/exco/25-26/programmes-executive-1.jpg",
          },
          {
            name: "Flash Teng",
            position: "Programmes Executive",
            photo: "/team/exco/25-26/programmes-executive-2.jpg",
          },
          {
            name: "Jayden Teoh",
            position: "Programmes Executive",
            photo: "/team/exco/25-26/programmes-executive-3.jpg",
          },
        ],
      },
      {
        name: "Partnerships",
        leads: [{ name: "Anson Koh", position: "Partnerships Lead", photo: "/team/exco/25-26/partnerships-lead.jpg" }],
        executives: [
          {
            name: "Isaac Pua",
            position: "Partnerships Executive",
            photo: "/team/exco/25-26/partnerships-executive-1.jpg",
          },
          {
            name: "Saai Raja",
            position: "Partnerships Executive",
            photo: "/team/exco/25-26/partnerships-executive-2.jpg",
          },
        ],
      },
      {
        name: "Marketing",
        leads: [{ name: "Win Lei Thawdar", position: "Marketing Lead", photo: "/team/exco/25-26/marketing-lead.jpg" }],
        executives: [
          {
            name: "Chue Myat Sandy",
            position: "Marketing Executive",
            photo: "/team/exco/25-26/marketing-executive-1.jpg",
          },
          {
            name: "Kiara Desai",
            position: "Marketing Executive",
            photo: "/team/exco/25-26/marketing-executive-2.jpg",
          },
        ],
      },
    ],
  },
  "24/25": {
    excoNumber: "6th ExCo",
    leadership: [
      { name: "TBC", position: "President", photo: "/team/exco/24-25/president.jpg" },
      { name: "TBC", position: "Vice-President", photo: "/team/exco/24-25/vice-president.jpg" },
      { name: "TBC", position: "HGS", photo: "/team/exco/24-25/hgs.jpg" },
      { name: "TBC", position: "HFS", photo: "/team/exco/24-25/hfs.jpg" },
    ],
    departments: [
      {
        name: "Programmes",
        leads: [
          { name: "TBC", position: "Programmes Lead", photo: "/team/exco/24-25/programmes-lead-1.jpg" },
          { name: "TBC", position: "Programmes Lead", photo: "/team/exco/24-25/programmes-lead-2.jpg" },
        ],
        executives: [],
      },
      {
        name: "Partnerships",
        leads: [
          { name: "TBC", position: "Partnerships Lead", photo: "/team/exco/24-25/partnerships-lead-1.jpg" },
          { name: "TBC", position: "Partnerships Lead", photo: "/team/exco/24-25/partnerships-lead-2.jpg" },
        ],
        executives: [],
      },
      {
        name: "Marketing",
        leads: [
          { name: "TBC", position: "Marketing Lead", photo: "/team/exco/24-25/marketing-lead-1.jpg" },
          { name: "TBC", position: "Marketing Lead", photo: "/team/exco/24-25/marketing-lead-2.jpg" },
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
    linkedin: "",
  },
  {
    name: "Nazreen Coupland",
    position: "Assistant Manager at IIE",
    photo: "/team/advisors/naz.jpg",
    linkedin: "",
  },
  {
    name: "Lu Yi",
    position: "Senior Manager at IIE",
    photo: "/team/advisors/luyi.jpg",
    linkedin: "",
  },
];

export const advisorsIntro =
  "This is the space to introduce the team and what makes it special. Describe the team culture and work philosophy. To help site visitors connect with the team, add details about team members’ experience and skills.";

export const advisorsProfileSummary: Record<string, string> = {
  "Huo Yasi":
    "Leading programs that inspire innovation, Yasi combines her rich educational background and a Harvard Master’s to foster impactful learning experiences and partnerships.",
  "Nazreen Coupland":
    "Nazreen brings her passion for community building to IIE, with experience at the Mental Health Film Festival and a Theatre Studies degree from NUS.",
  "Lu Yi":
    "Lu Yi combines expertise in finance and education to drive innovation and entrepreneurship. A First-Class Honours LSE graduate with a Master’s in Education, she is dedicated to shaping future leaders.",
};
