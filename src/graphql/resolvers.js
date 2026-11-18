/* eslint-disable camelcase */
import jobsRepository from '../modules/jobs/jobs-repositories.js';
import companiesRepository from '../modules/companies/companies-repositories.js';
import categoriesRepository from '../modules/categories/categories-repositories.js';
import appsRepository from '../modules/applications/applications-repositories.js';
import bookmarksRepository from '../modules/bookmarks/bookmarks-repositories.js';
import userRepository from '../modules/users/user-repositories.js';

const requireAuth = (context) => {
  if (!context.user || !context.user.id) {
    throw new Error('Unauthorized: Token tidak valid atau belum disertakan');
  }
  return context.user;
};

export const resolvers = {
  Query: {
    jobs: async (_, { title, companyName }) => {
      const { jobs } = await jobsRepository.getJobs({ title, companyName });
      return jobs;
    },

    job: async (_, { id }) => {
      const { job } = await jobsRepository.getJobById(id);
      return job;
    },

    companies: async () => {
      const { companies } = await companiesRepository.getCompanies();
      return companies;
    },

    company: async (_, { id }) => {
      const { company } = await companiesRepository.getCompanyById(id);
      return company;
    },

    categories: async () => {
      const { categories } = await categoriesRepository.getCategories();
      return categories;
    },

    category: async (_, { id }) => {
      const { category } = await categoriesRepository.getCategoryById(id);
      return category;
    },

    myProfile: async (_, __, context) => {
      const authUser = requireAuth(context);
      const { user } = await userRepository.getUserById(authUser.id);
      return user;
    },

    applications: async (_, __, context) => {
      requireAuth(context);
      const { applications } = await appsRepository.getApps();
      return applications;
    },
  },

  Mutation: {
    applyJob: async (_, { job_id }, context) => {
      const authUser = requireAuth(context);

      const alreadyApplied = await appsRepository.verifyUserAlreadyApplied({
        user_id: authUser.id,
        job_id,
      });

      if (alreadyApplied) {
        throw new Error('Anda sudah melamar pada lowongan ini');
      }

      return await appsRepository.createApp({
        user_id: authUser.id,
        job_id,
      });
    },

    updateApplicationStatus: async (_, { id, status }, context) => {
      requireAuth(context);
      return await appsRepository.editApp({ id, status });
    },

    addBookmark: async (_, { job_id }, context) => {
      const authUser = requireAuth(context);
      return await bookmarksRepository.createBookmark({
        userId: authUser.id,
        jobId: job_id,
      });
    },

    removeBookmark: async (_, { job_id }, context) => {
      requireAuth(context);
      return await bookmarksRepository.deleteBookmark(job_id);
    },
  },

  // --- Field Resolvers (Relasi Bersarang) ---

  Job: {
    salary_min: (parent) => (parent.is_salary_visible ? parent.salary_min : null),
    salary_max: (parent) => (parent.is_salary_visible ? parent.salary_max : null),

    company: async (parent) => {
      if (!parent.company_id) return null;
      const { company } = await companiesRepository.getCompanyById(parent.company_id);
      return company;
    },

    category: async (parent) => {
      if (!parent.category_id) return null;
      const { category } = await categoriesRepository.getCategoryById(parent.category_id);
      return category;
    },

    applications: async (parent) => {
      const { applications } = await appsRepository.getAppByJobId(parent.id);
      return applications;
    },
  },

  Company: {
    jobs: async (parent) => {
      const { jobs } = await jobsRepository.getJobByCompanyId(parent.id);
      return jobs;
    },
  },

  Category: {
    jobs: async (parent) => {
      const { jobs } = await jobsRepository.getJobByCategoryId(parent.id);
      return jobs;
    },
  },

  User: {
    applications: async (parent) => {
      const { applications } = await appsRepository.getAppByUserId(parent.id);
      return applications;
    },

    bookmarks: async (parent) => {
      const { bookmarks } = await bookmarksRepository.getBookmarks(parent.id);
      return bookmarks;
    },
  },

  Application: {
    job: async (parent) => {
      const { job } = await jobsRepository.getJobById(parent.job_id);
      return job;
    },

    user: async (parent) => {
      const { user } = await userRepository.getUserById(parent.user_id);
      return user;
    },
  },

  Bookmark: {
    job: async (parent) => {
      if (parent.title) {
        return {
          id: parent.job_id,
          company_id: parent.company_id,
          category_id: parent.category_id,
          title: parent.title,
          description: parent.description,
          job_type: parent.job_type,
          experience_level: parent.experience_level,
          location_type: parent.location_type,
          location_city: parent.location_city,
          salary_min: parent.salary_min,
          salary_max: parent.salary_max,
          is_salary_visible: parent.is_salary_visible,
          status: parent.status,
        };
      }

      const { job } = await jobsRepository.getJobById(parent.job_id);
      return job;
    },
  },
};
