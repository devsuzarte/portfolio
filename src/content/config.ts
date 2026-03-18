import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title:           z.string(),
    description:     z.string(),
    longDescription: z.string().optional(),
    thumbnail:       z.string(),
    images:          z.array(z.string()).optional(),
    tags:            z.array(z.string()),
    tech:            z.array(z.string()),
    github:          z.string().url().optional(),
    demo:            z.string().url().optional(),
    featured:        z.boolean().default(false),
    status:          z.enum(['completed', 'in-progress', 'archived']).default('completed'),
    category:        z.enum(['web', 'mobile', 'fullstack', 'backend', 'frontend']),
    startDate:       z.date(),
    endDate:         z.date().optional(),
    pubDate:         z.date(),
    theme:           z.enum(['dark', 'light', 'warm']).default('dark'),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    author:      z.string().default('Juan Benjamin Almeida Suzarte'),
    image:       z.string(),
    imageAlt:    z.string().optional(),
    category:    z.enum(['tutorial', 'opinion', 'news', 'project-log', 'tech']),
    tags:        z.array(z.string()),
    pubDate:     z.date(),
    updatedDate: z.date().optional(),
    featured:    z.boolean().default(false),
    draft:       z.boolean().default(false),
    readingTime: z.number().optional(),
    theme:       z.enum(['dark', 'light', 'warm']).default('dark'),
  }),
});

const experience = defineCollection({
  type: 'data',
  schema: z.object({
    company:      z.string(),
    position:     z.string(),
    location:     z.string(),
    kind:         z.enum(['work', 'education']).default('work'),
    type:         z.enum(['full-time', 'part-time', 'contract', 'freelance', 'course', 'degree']),
    startDate:    z.string(),
    endDate:      z.string().optional(),
    current:      z.boolean().default(false),
    description:  z.string(),
    achievements: z.array(z.string()),
    technologies: z.array(z.string()),
    companyUrl:   z.string().url().optional(),
  }),
});

const skills = defineCollection({
  type: 'data',
  schema: z.object({
    name:               z.string(),
    category:           z.enum(['frontend', 'backend', 'database', 'devops', 'tools', 'soft-skills', 'design', 'ai']),
    proficiency:        z.number().min(0).max(100),
    icon:               z.string().optional(),
    yearsOfExperience:  z.number().optional(),
  }),
});

export const collections = { projects, blog, experience, skills };
